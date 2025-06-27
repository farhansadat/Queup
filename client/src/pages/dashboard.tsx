import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage, getStoreTypeLabels } from "@/lib/i18n";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DragDropQueue } from "@/components/DragDropQueue";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { FileUpload } from "@/components/FileUpload";
import { WeeklyScheduleSetup } from "@/components/WeeklyScheduleSetup";
import { 
  Users, 
  Settings, 
  QrCode, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  UserCheck,
  Store as StoreIcon,
  Download,
  Printer,
  User,
  Crown,
  Sparkles,
  LogOut
} from "lucide-react";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { AnimatedStatsCard } from "@/components/AnimatedStatsCard";
import { AddToQueueDialog } from "@/components/AddToQueueDialog";
import { StaffPhotoUpload } from "@/components/StaffPhotoUpload";
import type { Store, Staff } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("queue");
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", title: "", photoUrl: "" });
  const [profileData, setProfileData] = useState({ 
    currentPassword: "", 
    newPassword: "", 
    confirmPassword: "" 
  });
  const [newStore, setNewStore] = useState({
    name: "",
    slug: "",
    description: "",
    type: "barbershop",
    address: "",
    phone: "",
    logoUrl: "",
    workingHours: { openTime: "09:00", closeTime: "17:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
    services: [""],
    theme: { primaryColor: "#7C3AED", accentColor: "#06B6D4", backgroundColor: "#F8FAFC" }
  });

  // Get user from localStorage
  const [user, setUser] = useState<{ id: string; email: string; firstName?: string; lastName?: string } | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    
    if (!token || !userData) {
      setLocation('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLocation('/login');
      return;
    }
    
    setUserLoading(false);
  }, [setLocation]);

  const { data: stores = [], isLoading: storesLoading } = useQuery<Store[]>({
    queryKey: ["/api/stores"],
    enabled: !!user && !userLoading
  });

  const currentStore = stores[0]; // For simplicity, use first store
  
  // Store-type-specific configurations
  const getStoreConfig = (storeType: string) => {
    const configs = {
      barbershop: {
        queueLabel: "Customer Queue",
        customerLabel: "Customer",
        serviceLabel: "Haircut Services",
        staffLabel: "Barbers",
        waitLabel: "Wait Time",
        servedLabel: "Completed Cuts",
        addCustomerLabel: "Add Customer",
        defaultServices: ["Haircut", "Beard Trim", "Styling", "Wash & Cut"],
        icon: "✂️",
        primaryColor: "#7C3AED"
      },
      salon: {
        queueLabel: "Client Queue",
        customerLabel: "Client",
        serviceLabel: "Beauty Services", 
        staffLabel: "Stylists",
        waitLabel: "Service Time",
        servedLabel: "Completed Services",
        addCustomerLabel: "Add Client",
        defaultServices: ["Hair Styling", "Color Treatment", "Manicure", "Facial"],
        icon: "💄",
        primaryColor: "#EC4899"
      },
      restaurant: {
        queueLabel: "Waiting List",
        customerLabel: "Party",
        serviceLabel: "Table Sizes",
        staffLabel: "Hosts",
        waitLabel: "Wait Time",
        servedLabel: "Seated Today",
        addCustomerLabel: "Add Party",
        defaultServices: ["Table for 2", "Table for 4", "Table for 6", "Table for 8+"],
        icon: "🍽️",
        primaryColor: "#F59E0B"
      },
      clinic: {
        queueLabel: "Patient Queue",
        customerLabel: "Patient", 
        serviceLabel: "Medical Services",
        staffLabel: "Medical Staff",
        waitLabel: "Wait Time",
        servedLabel: "Patients Seen",
        addCustomerLabel: "Add Patient",
        defaultServices: ["Consultation", "Check-up", "Treatment", "Follow-up"],
        icon: "🏥",
        primaryColor: "#10B981"
      },
      retail: {
        queueLabel: "Service Queue",
        customerLabel: "Customer",
        serviceLabel: "Store Services",
        staffLabel: "Associates",
        waitLabel: "Wait Time", 
        servedLabel: "Customers Helped",
        addCustomerLabel: "Add Customer",
        defaultServices: ["Personal Shopping", "Fitting", "Returns", "Consultation"],
        icon: "🛍️",
        primaryColor: "#6366F1"
      },
      dentist: {
        queueLabel: "Patient Queue",
        customerLabel: "Patient",
        serviceLabel: "Dental Services",
        staffLabel: "Dental Staff",
        waitLabel: "Wait Time",
        servedLabel: "Patients Treated",
        addCustomerLabel: "Add Patient", 
        defaultServices: ["Cleaning", "Examination", "Filling", "Consultation"],
        icon: "🦷",
        primaryColor: "#06B6D4"
      },
      spa: {
        queueLabel: "Guest Queue",
        customerLabel: "Guest",
        serviceLabel: "Spa Services",
        staffLabel: "Therapists",
        waitLabel: "Wait Time",
        servedLabel: "Treatments Completed",
        addCustomerLabel: "Add Guest",
        defaultServices: ["Massage", "Facial", "Body Treatment", "Relaxation"],
        icon: "🧘",
        primaryColor: "#8B5CF6"
      },
      other: {
        queueLabel: "Customer Queue",
        customerLabel: "Customer",
        serviceLabel: "Services",
        staffLabel: "Staff",
        waitLabel: "Wait Time",
        servedLabel: "Customers Served",
        addCustomerLabel: "Add Customer",
        defaultServices: ["Service 1", "Service 2", "Service 3", "Service 4"],
        icon: "🏢",
        primaryColor: "#64748B"
      }
    };
    return configs[storeType as keyof typeof configs] || configs.other;
  };

  const storeConfig = getStoreConfig(currentStore?.type || "other");

  const { data: staff = [] } = useQuery<Staff[]>({
    queryKey: [`/api/stores/${currentStore?.id}/staff`],
    enabled: !!currentStore?.id
  });

  const { data: stats } = useQuery<{
    totalCustomers: number;
    avgWaitTime: number;
    completed: number;
    waiting: number;
  }>({
    queryKey: [`/api/stores/${currentStore?.id}/stats`],
    enabled: !!currentStore?.id,
    refetchInterval: 5000 // Refresh every 5 seconds for real-time updates
  });

  const { data: servedCustomers = [] } = useQuery<any[]>({
    queryKey: [`/api/stores/${currentStore?.id}/served`],
    enabled: !!currentStore?.id,
    refetchInterval: 10000 // Refresh every 10 seconds
  });

  // Logout functionality
  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Clear localStorage tokens
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.clear();
      setUser(null);
      setLocation("/login");
    }
  });

  // Create store mutation
  const createStoreMutation = useMutation({
    mutationFn: async (storeData: any) => {
      const response = await apiRequest("POST", "/api/stores", storeData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Store created!", description: "Your store has been set up successfully." });
      queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
    }
  });

  // Add staff mutation
  const addStaffMutation = useMutation({
    mutationFn: async (staffData: any) => {
      const response = await apiRequest("POST", "/api/staff", {
        ...staffData,
        storeId: currentStore?.id
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Staff added!", description: "New staff member has been added." });
      setIsAddStaffOpen(false);
      setNewStaff({ name: "", title: "", photoUrl: "" });
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${currentStore?.id}/staff`] });
    }
  });

  // Delete staff mutation
  const deleteStaffMutation = useMutation({
    mutationFn: async (staffId: string) => {
      const response = await apiRequest("DELETE", `/api/staff/${staffId}`);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Staff removed!", description: "Staff member has been removed successfully." });
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${currentStore?.id}/staff`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove staff member. Please try again.", variant: "destructive" });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (passwordData: { currentPassword: string; newPassword: string }) => {
      const response = await apiRequest("PUT", "/api/auth/change-password", passwordData);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Password updated!", description: "Your password has been changed successfully." });
      setIsProfileOpen(false);
      setProfileData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update password. Please check your current password.", variant: "destructive" });
    }
  });

  // Authentication is handled in the main useEffect above

  if (userLoading || storesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no stores, show store creation form
  if (!currentStore) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Setup Your Store</CardTitle>
            <p className="text-center text-gray-600">Create your first store to get started</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              createStoreMutation.mutate(newStore);
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    required
                    value={newStore.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setNewStore(prev => ({
                        ...prev,
                        name,
                        slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
                      }));
                    }}
                    className="h-11 rounded-xl"
                    placeholder="Mike's Barbershop"
                  />
                </div>
                <div>
                  <Label htmlFor="store-slug">Store URL Slug</Label>
                  <Input
                    id="store-slug"
                    required
                    value={newStore.slug}
                    onChange={(e) => setNewStore(prev => ({ ...prev, slug: e.target.value }))}
                    className="h-11 rounded-xl"
                    placeholder="mikes-barbershop"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="store-type">Business Type</Label>
                <Select value={newStore.type} onValueChange={(value) => setNewStore(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barbershop">Barbershop</SelectItem>
                    <SelectItem value="salon">Hair Salon</SelectItem>
                    <SelectItem value="clinic">Medical Clinic</SelectItem>
                    <SelectItem value="restaurant">Restaurant</SelectItem>
                    <SelectItem value="retail">Retail Store</SelectItem>
                    <SelectItem value="service">Service Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="store-address">Address</Label>
                  <Input
                    id="store-address"
                    value={newStore.address}
                    onChange={(e) => setNewStore(prev => ({ ...prev, address: e.target.value }))}
                    className="h-11 rounded-xl"
                    placeholder="123 Main St, City, State"
                  />
                </div>
                <div>
                  <Label htmlFor="store-phone">Phone</Label>
                  <Input
                    id="store-phone"
                    value={newStore.phone}
                    onChange={(e) => setNewStore(prev => ({ ...prev, phone: e.target.value }))}
                    className="h-11 rounded-xl"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
              
              <div>
                <FileUpload
                  label="Store Logo"
                  currentUrl={newStore.logoUrl}
                  onUrlChange={(url) => setNewStore(prev => ({ ...prev, logoUrl: url }))}
                  onFileSelect={(file) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      setNewStore(prev => ({ ...prev, logoUrl: e.target?.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </div>
              <div>
                <Label htmlFor="store-description">Description</Label>
                <Textarea
                  id="store-description"
                  value={newStore.description}
                  onChange={(e) => setNewStore(prev => ({ ...prev, description: e.target.value }))}
                  className="input-field"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-200" 
                disabled={createStoreMutation.isPending}
              >
                {createStoreMutation.isPending ? "Creating your store..." : "Create Store"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                {currentStore?.logoUrl ? (
                  <img 
                    src={currentStore.logoUrl} 
                    alt={`${currentStore.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StoreIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  QueueUp Pro
                  <Crown className="w-5 h-5 text-yellow-300" />
                </h1>
                <p className="text-purple-100 flex items-center gap-1">
                  <span className="text-lg">{storeConfig.icon}</span>
                  {currentStore.name} • {currentStore.type.charAt(0).toUpperCase() + currentStore.type.slice(1)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center text-white/90 text-sm bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <User className="w-4 h-4 mr-2" />
                {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.email}
              </div>
              
              <LanguageSelector variant="glassmorphism" />
              
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    {t('dashboard.settings')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-semibold dark:text-white">{user?.firstName ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</p>
                    </div>

                    {/* Language Settings */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                        {language === 'de' ? 'Sprache / Language' : 'Language / Sprache'}
                      </Label>
                      <LanguageSelector />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {language === 'de' 
                          ? 'Ihre Sprachauswahl wird für Ihr Dashboard und Ihre Kundenwarteschlange verwendet'
                          : 'Your language choice will be used for your dashboard and customer queue'
                        }
                      </p>
                    </div>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      if (profileData.newPassword !== profileData.confirmPassword) {
                        toast({ title: "Error", description: "New passwords don't match", variant: "destructive" });
                        return;
                      }
                      changePasswordMutation.mutate({
                        currentPassword: profileData.currentPassword,
                        newPassword: profileData.newPassword
                      });
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="h-11 rounded-xl"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl"
                        disabled={changePasswordMutation.isPending}
                      >
                        {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  </div>
                </DialogContent>
              </Dialog>
              
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => logoutMutation.mutate()} 
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-xl"
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {logoutMutation.isPending ? (language === 'de' ? "Abmelden..." : "Signing out...") : (language === 'de' ? "Abmelden" : "Sign Out")}
                </Button>
                <DarkModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="queue" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{t('dashboard.queue')}</span>
            </TabsTrigger>
            <TabsTrigger value="served" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('dashboard.served')}</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4" />
              <span>{t('dashboard.staff')}</span>
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center space-x-2">
              <StoreIcon className="w-4 h-4" />
              <span>{language === 'de' ? 'Geschäft' : 'Store'}</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>{language === 'de' ? 'QR-Codes' : 'QR Codes'}</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t('dashboard.analytics')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Queue Management */}
          <TabsContent value="queue" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{storeConfig.queueLabel}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {currentStore?.type === 'restaurant' 
                    ? (language === 'de' ? 'Verwalten Sie Ihre Warteliste und setzen Sie Gäste an Tische' : 'Manage your waiting list and seat parties')
                    : (language === 'de' ? 'Verwalten Sie Ihre aktuelle Warteschlange und bedienen Sie Kunden' : 'Manage your current queue and serve customers')
                  }
                </p>
              </div>

              {/* Animated Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AnimatedStatsCard
                  title={t('dashboard.today_customers')}
                  value={stats?.totalCustomers || 0}
                  icon={Users}
                  color="bg-primary"
                  delay={0}
                />
                <AnimatedStatsCard
                  title={t('dashboard.avg_wait_time')}
                  value={stats?.avgWaitTime || 0}
                  icon={Clock}
                  color="bg-orange-500"
                  delay={100}
                />
                <AnimatedStatsCard
                  title={t('dashboard.completed')}
                  value={stats?.completed || 0}
                  icon={CheckCircle}
                  color="bg-accent"
                  delay={200}
                />
                <AnimatedStatsCard
                  title={t('dashboard.currently_waiting')}
                  value={stats?.waiting || 0}
                  icon={UserCheck}
                  color="bg-purple-500"
                  delay={300}
                />
              </div>

              {/* Queue Management Actions */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.queue_management')}</h3>
                <AddToQueueDialog storeId={currentStore?.id || ""} staff={staff} />
              </div>

              {/* Queue Component */}
              <DragDropQueue storeId={currentStore.id} />
            </div>
          </TabsContent>

          {/* Served Customers */}
          <TabsContent value="served" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.served')}</h2>
                <p className="text-gray-600 dark:text-gray-300">{t('dashboard.served_customers_note')}</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  {servedCustomers.length > 0 ? (
                    <div className="space-y-4">
                      {servedCustomers.map((customer: any) => {
                        const staffMember = staff.find(s => s.id === customer.staffId);
                        const servedDate = new Date(customer.updatedAt || customer.joinedAt);
                        return (
                          <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-4">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">{customer.customerName}</h4>
                                  <div className="flex flex-col space-y-1">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {language === 'de' ? 'Bedient von:' : 'Served by:'} <span className="font-medium">{staffMember?.name || (language === 'de' ? 'Mitarbeiter' : 'Staff Member')}</span>
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      {language === 'de' ? 'Datum:' : 'Date:'} {servedDate.toLocaleDateString()} {language === 'de' ? 'um' : 'at'} {servedDate.toLocaleTimeString()}
                                    </p>
                                  </div>
                                  {customer.contactInfo && (
                                    <p className="text-sm text-gray-500 mt-1">{customer.contactInfo}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              {language === 'de' ? 'Abgeschlossen' : 'Completed'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No {storeConfig.customerLabel.toLowerCase()}s served today</p>
                      <p className="text-sm">Served {storeConfig.customerLabel.toLowerCase()}s will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Staff Management */}
          <TabsContent value="staff" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('dashboard.staff_management')}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{language === 'de' ? 'Verwalten Sie Ihre Teammitglieder und deren Verfügbarkeit' : 'Manage your team members and their availability'}</p>
                </div>
                <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('dashboard.add_staff_member')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add {storeConfig.staffLabel.slice(0, -1)} Member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      addStaffMutation.mutate(newStaff);
                    }} className="space-y-4">
                      <div>
                        <Label htmlFor="staff-name">Name</Label>
                        <Input
                          id="staff-name"
                          required
                          value={newStaff.name}
                          onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <Label htmlFor="staff-title">Title</Label>
                        <Input
                          id="staff-title"
                          value={newStaff.title}
                          onChange={(e) => setNewStaff(prev => ({ ...prev, title: e.target.value }))}
                          className="input-field"
                        />
                      </div>
                      <StaffPhotoUpload
                        currentPhotoUrl={newStaff.photoUrl}
                        onPhotoChange={(photoUrl) => setNewStaff(prev => ({ ...prev, photoUrl }))}
                        staffName={newStaff.name}
                      />
                      <Button type="submit" className="w-full btn-primary" disabled={addStaffMutation.isPending}>
                        {addStaffMutation.isPending ? "Adding..." : "Add Staff Member"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 overflow-hidden">
                          {member.photoUrl ? (
                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-gray-600">{member.title}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge variant={member.status === "available" ? "default" : "secondary"}>
                            {member.status}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${member.name} from your staff?`)) {
                                deleteStaffMutation.mutate(member.id);
                              }
                            }}
                            disabled={deleteStaffMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Store Profile */}
          <TabsContent value="store" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Store Profile</h2>
                <p className="text-gray-600">Customize your store information and settings</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="store-name-edit">Store Name</Label>
                        <Input
                          id="store-name-edit"
                          defaultValue={currentStore.name}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <Label htmlFor="store-slug-edit">Store URL Slug</Label>
                        <Input
                          id="store-slug-edit"
                          defaultValue={currentStore.slug}
                          className="input-field"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="store-description-edit">Description</Label>
                      <Textarea
                        id="store-description-edit"
                        defaultValue={currentStore.description || ""}
                        className="input-field"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-lg font-semibold">Weekly Operating Hours</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditScheduleOpen(true)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Schedule
                        </Button>
                      </div>
                      
                      {currentStore.workingHours && (
                        <div className="space-y-3">
                          {Object.entries(currentStore.workingHours).map(([day, hours]: [string, any]) => (
                            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <span className="font-medium capitalize">{day}</span>
                              {hours?.isOpen ? (
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-gray-600">{hours.open}</span>
                                  <span className="text-gray-400">to</span>
                                  <span className="text-sm text-gray-600">{hours.close}</span>
                                  <Badge variant="default" className="ml-2">Open</Badge>
                                </div>
                              ) : (
                                <Badge variant="secondary">Closed</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {!currentStore.workingHours && (
                        <div className="text-center py-8 text-gray-500">
                          <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No operating hours set</p>
                          <p className="text-sm">Configure your weekly schedule during store setup</p>
                        </div>
                      )}
                    </div>

                    {/* Weekly Schedule Edit Dialog */}
                    <Dialog open={isEditScheduleOpen} onOpenChange={setIsEditScheduleOpen}>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Edit Weekly Schedule</DialogTitle>
                        </DialogHeader>
                        <WeeklyScheduleSetup
                          initialSchedule={currentStore.workingHours ? currentStore.workingHours : undefined}
                          onScheduleChange={async (schedule) => {
                            try {
                              const response = await apiRequest("PUT", `/api/stores/${currentStore.id}`, {
                                workingHours: schedule
                              });
                              await response.json();
                              toast({ title: "Schedule updated!", description: "Your weekly schedule has been saved." });
                              queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
                              setIsEditScheduleOpen(false);
                            } catch (error) {
                              toast({ title: "Error", description: "Failed to update schedule", variant: "destructive" });
                            }
                          }}
                        />
                      </DialogContent>
                    </Dialog>

                    <div className="flex justify-end">
                      <Button type="submit" className="btn-primary">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* QR Codes */}
          <TabsContent value="qr" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Generator</h2>
                <p className="text-gray-600">Generate QR codes for customer access and display monitors</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer QR Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <QrCode className="w-5 h-5 mr-2 text-primary" />
                      Customer Join Page
                    </CardTitle>
                    <p className="text-gray-600">QR code for customers to scan and join your queue</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="inline-block p-4 bg-gray-100 rounded-xl">
                        <QRCodeGenerator 
                          value={`${window.location.protocol}//${window.location.host}/store/${currentStore.slug}`}
                          size={160}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>URL:</strong> {window.location.protocol}//{window.location.host}/store/{currentStore.slug}
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1 btn-primary">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monitor QR Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <QrCode className="w-5 h-5 mr-2 text-primary" />
                      Monitor Display
                    </CardTitle>
                    <p className="text-gray-600">QR code to access the kiosk display mode</p>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-4">
                      <div className="inline-block p-4 bg-gray-100 rounded-xl">
                        <QRCodeGenerator 
                          value={`https://${window.location.hostname}/store/${currentStore.slug}/display`}
                          size={160}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600">
                        <strong>URL:</strong> https://{window.location.hostname}/store/{currentStore.slug}/display
                      </div>
                      <div className="flex space-x-2">
                        <Button className="flex-1 btn-primary">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Printer className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Instructions */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Setup Instructions
                  </h4>
                  <div className="space-y-2 text-blue-800">
                    <p><strong>Customer QR Code:</strong> Print and display this in your shop for customers to scan and join the queue.</p>
                    <p><strong>Monitor QR Code:</strong> Use this to set up a kiosk display on tablets, Raspberry Pi, or any device for walk-in customers.</p>
                    <p><strong>Tip:</strong> Place customer QR codes at the entrance and monitor displays where customers wait.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="mt-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics</h2>
                <p className="text-gray-600">Track your business performance and customer patterns</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.totalCustomers || 0}</h3>
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <div className="mt-2 flex items-center justify-center text-sm text-accent">
                      <span>+12%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                    <h3 className="text-3xl font-bold text-gray-900">{stats?.avgWaitTime || 0}</h3>
                    <p className="text-sm text-gray-600">Avg Wait Time (min)</p>
                    <div className="mt-2 flex items-center justify-center text-sm text-accent">
                      <span>-5%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="text-3xl font-bold text-gray-900">94</h3>
                    <p className="text-sm text-gray-600">Completion Rate (%)</p>
                    <div className="mt-2 flex items-center justify-center text-sm text-accent">
                      <span>+3%</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6 text-center">
                    <BarChart3 className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="text-3xl font-bold text-gray-900">4.8</h3>
                    <p className="text-sm text-gray-600">Customer Rating</p>
                    <div className="mt-2 flex items-center justify-center text-sm text-accent">
                      <span>+0.2</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Hourly Traffic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <BarChart3 className="w-16 h-16 mx-auto mb-2" />
                        <p>Chart visualization will be implemented here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Staff Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {staff.map((member) => (
                        <div key={member.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                              <div className="bg-primary h-2 rounded-full" style={{ width: "85%" }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">34</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

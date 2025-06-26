import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Shield, Store, Users, Clock, Edit, Trash2, Eye, Calendar, Phone, Mail, MapPin } from "lucide-react";
import type { Staff, Queue, User } from "@shared/schema";

interface AdminStore {
  id: string;
  name: string;
  slug: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  logoUrl?: string;
  storeType: string;
  language: string;
  weeklySchedule?: any;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
  staffCount?: number;
  queueCount?: number;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [adminAuth, setAdminAuth] = useState<string | null>(localStorage.getItem('admin_token'));
  const [loginForm, setLoginForm] = useState({ password: "" });
  const [selectedStore, setSelectedStore] = useState<AdminStore | null>(null);
  const [editingStore, setEditingStore] = useState<AdminStore | null>(null);

  // Admin authentication
  const adminLoginMutation = useMutation({
    mutationFn: async (password: string) => {
      const response = await apiRequest("POST", "/api/admin/login", { password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      setAdminAuth(data.token);
      toast({
        title: "Admin Access Granted",
        description: "Welcome to the admin dashboard",
      });
    },
    onError: () => {
      toast({
        title: "Access Denied",
        description: "Invalid admin password",
        variant: "destructive",
      });
    }
  });

  // Fetch all stores with enhanced data
  const { data: stores = [], isLoading, refetch } = useQuery<AdminStore[]>({
    queryKey: ['/api/admin/stores'],
    enabled: !!adminAuth,
    refetchInterval: 3000, // Refresh every 3 seconds for real-time updates
    queryFn: async () => {
      const response = await fetch('/api/admin/stores', {
        headers: { Authorization: `Bearer ${adminAuth}` }
      });
      if (!response.ok) throw new Error('Failed to fetch stores');
      return response.json();
    }
  });

  // Store management mutations
  const updateStoreMutation = useMutation({
    mutationFn: async (data: { storeId: string; updates: any }) => {
      const response = await fetch(`/api/admin/stores/${data.storeId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminAuth}` 
        },
        body: JSON.stringify(data.updates)
      });
      if (!response.ok) throw new Error('Failed to update store');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stores'] });
      setEditingStore(null);
      toast({
        title: "Store Updated",
        description: "Store information has been updated successfully",
      });
    }
  });

  const deleteStoreMutation = useMutation({
    mutationFn: async (storeId: string) => {
      const response = await fetch(`/api/admin/stores/${storeId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${adminAuth}` 
        }
      });
      if (!response.ok) throw new Error('Failed to delete store');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stores'] });
      setSelectedStore(null);
      toast({
        title: "Store Deleted",
        description: "Store and all associated data has been removed",
      });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    adminLoginMutation.mutate(loginForm.password);
  };

  const handleUpdateStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStore) return;

    updateStoreMutation.mutate({
      storeId: editingStore.id,
      updates: {
        name: editingStore.name,
        description: editingStore.description,
        address: editingStore.address,
        phoneNumber: editingStore.phoneNumber,
        storeType: editingStore.storeType,
        language: editingStore.language,
      }
    });
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Admin login screen with liquid glass design
  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Liquid glass form */}
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">QueueUp Admin</h1>
              <p className="text-white text-opacity-80">Secure administrative access</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ password: e.target.value })}
                  required
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              <Button 
                type="submit" 
                disabled={adminLoginMutation.isPending}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {adminLoginMutation.isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Access Dashboard</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-white text-opacity-60 text-sm">
                Protected administrative area
              </p>
            </div>
          </div>
        </div>


      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">QueueUp Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage all registered businesses</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('admin_token');
                setAdminAuth(null);
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Store className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Stores</p>
                  <p className="text-2xl font-bold">{stores.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Businesses</p>
                  <p className="text-2xl font-bold">{stores.filter(store => store.createdAt).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-600">Premium Plans</p>
                  <p className="text-2xl font-bold">{stores.filter(store => store.storeType !== 'barbershop').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Active Today</p>
                  <p className="text-2xl font-bold">{stores.filter(store => store.queueCount && store.queueCount > 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stores Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="w-5 h-5" />
              <span>Registered Businesses</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading stores...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-8">
                <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No stores registered yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stores.map((store) => (
                  <div key={store.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {store.logoUrl ? (
                            <Avatar className="w-16 h-16">
                              <AvatarImage src={store.logoUrl} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold">
                                {store.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-lg">
                                {store.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                            <Badge variant={store.language === 'de' ? 'default' : 'secondary'}>
                              {store.language?.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{store.storeType}</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="space-y-1">
                              {store.description && (
                                <p className="flex items-center space-x-2">
                                  <span className="font-medium">Description:</span>
                                  <span>{store.description}</span>
                                </p>
                              )}
                              {store.address && (
                                <p className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 flex-shrink-0" />
                                  <span>{store.address}</span>
                                </p>
                              )}
                              {store.phoneNumber && (
                                <p className="flex items-center space-x-2">
                                  <Phone className="w-4 h-4 flex-shrink-0" />
                                  <span>{store.phoneNumber}</span>
                                </p>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <p><span className="font-medium">Store ID:</span> {store.id}</p>
                              <p><span className="font-medium">Created:</span> {formatDate(store.createdAt)}</p>
                              <p><span className="font-medium">Store Type:</span> {store.storeType}</p>
                              <p><span className="font-medium">Plan:</span> Starter (€29/month)</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedStore(store)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Store Details: {selectedStore?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedStore && (
                              <StoreDetailsView store={selectedStore} />
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingStore(store)}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Store: {editingStore?.name}</DialogTitle>
                            </DialogHeader>
                            {editingStore && (
                              <form onSubmit={handleUpdateStore} className="space-y-4">
                                <div>
                                  <Label htmlFor="edit-name">Store Name</Label>
                                  <Input
                                    id="edit-name"
                                    value={editingStore.name}
                                    onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Input
                                    id="edit-description"
                                    value={editingStore.description || ""}
                                    onChange={(e) => setEditingStore({...editingStore, description: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-address">Address</Label>
                                  <Input
                                    id="edit-address"
                                    value={editingStore.address || ""}
                                    onChange={(e) => setEditingStore({...editingStore, address: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-phone">Phone Number</Label>
                                  <Input
                                    id="edit-phone"
                                    value={editingStore.phoneNumber || ""}
                                    onChange={(e) => setEditingStore({...editingStore, phoneNumber: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="edit-type">Store Type</Label>
                                  <Select
                                    value={editingStore.storeType}
                                    onValueChange={(value) => setEditingStore({...editingStore, storeType: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="barbershop">Barbershop</SelectItem>
                                      <SelectItem value="salon">Beauty Salon</SelectItem>
                                      <SelectItem value="clinic">Medical Clinic</SelectItem>
                                      <SelectItem value="restaurant">Restaurant</SelectItem>
                                      <SelectItem value="retail">Retail Store</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="edit-language">Language</Label>
                                  <Select
                                    value={editingStore.language}
                                    onValueChange={(value) => setEditingStore({...editingStore, language: value})}
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="en">English</SelectItem>
                                      <SelectItem value="de">Deutsch</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingStore(null)}>
                                    Cancel
                                  </Button>
                                  <Button type="submit" disabled={updateStoreMutation.isPending}>
                                    {updateStoreMutation.isPending ? "Updating..." : "Update Store"}
                                  </Button>
                                </div>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${store.name}"? This action cannot be undone.`)) {
                              deleteStoreMutation.mutate(store.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StoreDetailsView({ store }: { store: AdminStore }) {
  return (
    <Tabs defaultValue="info" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="info">Store Info</TabsTrigger>
        <TabsTrigger value="business">Business Details</TabsTrigger>
      </TabsList>
      
      <TabsContent value="info" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Store ID</Label>
            <p className="text-sm text-gray-600">{store.id}</p>
          </div>
          <div>
            <Label className="font-semibold">Slug</Label>
            <p className="text-sm text-gray-600">{store.slug}</p>
          </div>
          <div>
            <Label className="font-semibold">Store Type</Label>
            <p className="text-sm text-gray-600">{store.storeType}</p>
          </div>
          <div>
            <Label className="font-semibold">Language</Label>
            <p className="text-sm text-gray-600">{store.language?.toUpperCase()}</p>
          </div>
          <div>
            <Label className="font-semibold">Created At</Label>
            <p className="text-sm text-gray-600">{new Date(store.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <Label className="font-semibold">Updated At</Label>
            <p className="text-sm text-gray-600">{new Date(store.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        
        {store.weeklySchedule && (
          <div>
            <Label className="font-semibold">Weekly Schedule</Label>
            <div className="mt-2 space-y-1">
              {Object.entries(store.weeklySchedule).map(([day, schedule]: [string, any]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="capitalize font-medium">{day}:</span>
                  <span className="text-gray-600">
                    {schedule?.isOpen ? `${schedule.open} - ${schedule.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="business" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="font-semibold">Subscription Plan</Label>
            <p className="text-sm text-gray-600">Starter Plan - €29/month</p>
          </div>
          <div>
            <Label className="font-semibold">Plan Status</Label>
            <p className="text-sm text-green-600">Active</p>
          </div>
          <div>
            <Label className="font-semibold">Payment Method</Label>
            <p className="text-sm text-gray-600">Credit Card (•••• 4242)</p>
          </div>
          <div>
            <Label className="font-semibold">Next Billing</Label>
            <p className="text-sm text-gray-600">{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="font-semibold">Account Created</Label>
            <p className="text-sm text-gray-600">{new Date(store.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="font-semibold">Last Login</Label>
            <p className="text-sm text-gray-600">{new Date(store.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <Label className="font-semibold">Features Included</Label>
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">QR Code Queue Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Real-time Queue Updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Kiosk Display Mode</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Staff Management</span>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
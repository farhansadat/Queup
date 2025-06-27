import { useState } from "react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PasswordReset } from "@/components/PasswordReset";
import { WeeklyScheduleSetup } from "@/components/WeeklyScheduleSetup";
import { FileUpload } from "@/components/FileUpload";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { Users, Store, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("login");

  useEffect(() => {
    if (location === "/register") {
      setActiveTab("register");
    }
  }, [location]);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    email: "", 
    password: "", 
    firstName: "", 
    lastName: "",
    storeType: "barbershop" 
  });
  const [weeklySchedule, setWeeklySchedule] = useState<any>(null);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    logoUrl: "",
    language: "en",
    address: "",
    phoneNumber: ""
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome back!", description: "Login successful." });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { 
      email: string; 
      password: string; 
      firstName: string; 
      lastName: string; 
      storeType: string; 
      storeName?: string;
      storeDescription?: string;
      storeAddress?: string;
      storePhoneNumber?: string;
      storeLogoUrl?: string;
      storeLanguage?: string;
      workingHours?: any;
      weeklySchedule?: any;
    }) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Account created!", description: "Welcome to QueueUp Pro." });
      setLocation("/dashboard");
    },
    onError: () => {
      toast({ title: "Registration failed", description: "Email may already be in use.", variant: "destructive" });
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
          <div className="text-center mb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">QueueUp Pro</h1>
            <p className="text-white text-opacity-80 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              Professional Queue Management
            </p>
          </div>
          {/* Back to Landing Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="text-white text-opacity-80 hover:text-white p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm p-1 rounded-xl border border-white border-opacity-20">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:bg-opacity-20 data-[state=active]:text-white text-white text-opacity-80">
                <Users className="w-4 h-4 mr-2" />
                {t('auth.login_title')}
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:bg-opacity-20 data-[state=active]:text-white text-white text-opacity-80">
                <Store className="w-4 h-4 mr-2" />
                {t('auth.register_title')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-white">{t('auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder={language === 'de' ? 'E-Mail eingeben' : 'Enter your email'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium text-white">{t('auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                    placeholder={language === 'de' ? 'Passwort eingeben' : 'Enter your password'}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" 
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (language === 'de' ? "Wird angemeldet..." : "Signing in...") : (
                    <span className="flex items-center gap-2">
                      {t('auth.login_button')}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
                <div className="text-center">
                  <PasswordReset>
                    <Button variant="ghost" type="button" className="text-sm text-white text-opacity-80 hover:text-white h-auto p-0 font-normal">
                      {language === 'de' ? 'Passwort vergessen?' : 'Forgot your password?'}
                    </Button>
                  </PasswordReset>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <div className="space-y-6">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registrationStep >= 1 ? 'bg-purple-500 text-white shadow-lg' : 'bg-white bg-opacity-20 text-white text-opacity-60'
                  }`}>
                    1
                  </div>
                  <div className={`w-8 h-1 rounded ${registrationStep >= 2 ? 'bg-purple-500' : 'bg-white bg-opacity-20'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registrationStep >= 2 ? 'bg-purple-500 text-white shadow-lg' : 'bg-white bg-opacity-20 text-white text-opacity-60'
                  }`}>
                    2
                  </div>
                  <div className={`w-8 h-1 rounded ${registrationStep >= 3 ? 'bg-purple-500' : 'bg-white bg-opacity-20'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registrationStep >= 3 ? 'bg-purple-500 text-white shadow-lg' : 'bg-white bg-opacity-20 text-white text-opacity-60'
                  }`}>
                    3
                  </div>
                  <div className={`w-8 h-1 rounded ${registrationStep >= 4 ? 'bg-purple-500' : 'bg-white bg-opacity-20'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registrationStep >= 4 ? 'bg-purple-500 text-white shadow-lg' : 'bg-white bg-opacity-20 text-white text-opacity-60'
                  }`}>
                    4
                  </div>
                </div>

                {registrationStep === 1 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setRegistrationStep(2);
                  }} className="space-y-5">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {language === 'de' ? 'Persönliche Informationen' : 'Personal Information'}
                      </h3>
                      <p className="text-sm text-white text-opacity-80">
                        {language === 'de' ? 'Beginnen wir mit Ihren grundlegenden Daten' : "Let's start with your basic details"}
                      </p>
                      <div className="flex justify-center mt-4">
                        <LanguageSelector variant="glassmorphism" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName" className="text-sm font-medium text-white">{t('auth.first_name')}</Label>
                        <Input
                          id="register-firstName"
                          type="text"
                          required
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder={language === 'de' ? 'Max' : 'John'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName" className="text-sm font-medium text-white">{t('auth.last_name')}</Label>
                        <Input
                          id="register-lastName"
                          type="text"
                          required
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder={language === 'de' ? 'Mustermann' : 'Doe'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium text-white">{t('auth.email')}</Label>
                      <Input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        placeholder={language === 'de' ? 'max@beispiel.de' : 'john@example.com'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium text-white">{t('auth.password')}</Label>
                      <Input
                        id="register-password"
                        type="password"
                        required
                        minLength={6}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                        placeholder={language === 'de' ? 'Mindestens 6 Zeichen' : 'At least 6 characters'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-storeType" className="text-sm font-medium text-white">{t('auth.store_type')}</Label>
                      <Select value={registerData.storeType} onValueChange={(value) => setRegisterData(prev => ({ ...prev, storeType: value }))}>
                        <SelectTrigger className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
                          <SelectValue placeholder={language === 'de' ? 'Geschäftstyp auswählen' : 'Select your business type'} />
                        </SelectTrigger>
                        <SelectContent className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-lg border border-white border-opacity-30">
                          <SelectItem value="barbershop" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_barbershop')}</SelectItem>
                          <SelectItem value="salon" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_salon')}</SelectItem>
                          <SelectItem value="clinic" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_clinic')}</SelectItem>
                          <SelectItem value="restaurant" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_restaurant')}</SelectItem>
                          <SelectItem value="retail" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_retail')}</SelectItem>
                          <SelectItem value="spa" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_spa')}</SelectItem>
                          <SelectItem value="dental" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_dental')}</SelectItem>
                          <SelectItem value="veterinary" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_veterinary')}</SelectItem>
                          <SelectItem value="automotive" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_automotive')}</SelectItem>
                          <SelectItem value="other" className="text-gray-900 hover:bg-purple-100">{t('auth.store_type_other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                      <span className="flex items-center gap-2">
                        {t('auth.next')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </form>
                )}

                {registrationStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('auth.store_information')}</h3>
                      <p className="text-sm text-white text-opacity-80">{t('auth.store_information_subtitle')}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name" className="text-sm font-medium text-white">{t('auth.store_name')}</Label>
                        <Input
                          id="store-name"
                          type="text"
                          required
                          value={storeData.name}
                          onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder={language === 'de' ? 'Name Ihres Unternehmens' : 'Your Business Name'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="store-description" className="text-sm font-medium text-white">{t('auth.store_description')} (Optional)</Label>
                        <Input
                          id="store-description"
                          type="text"
                          value={storeData.description}
                          onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder={language === 'de' ? 'Kurze Beschreibung Ihres Unternehmens' : 'Brief description of your business'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white">{t('auth.store_language')}</Label>
                        <Select value={storeData.language} onValueChange={(value) => setStoreData(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300">
                            <SelectValue placeholder={language === 'de' ? 'Geschäftssprache auswählen' : 'Select store language'} />
                          </SelectTrigger>
                          <SelectContent className="bg-white bg-opacity-95 backdrop-filter backdrop-blur-sm border border-white border-opacity-30">
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white">{t('auth.logo_upload')} (Optional)</Label>
                        <FileUpload
                          onFileSelect={(file) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              setStoreData(prev => ({ ...prev, logoUrl: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }}
                          onUrlChange={(url) => setStoreData(prev => ({ ...prev, logoUrl: url }))}
                          currentUrl={storeData.logoUrl}
                          accept="image/*"
                          label="Upload store logo"
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setRegistrationStep(1)}
                        className="flex-1 h-11 rounded-xl"
                      >
                        {t('auth.previous')}
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setRegistrationStep(3)}
                        className="flex-1 h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!storeData.name}
                      >
                        <span className="flex items-center gap-2">
                          Continue to Address
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {registrationStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">Store Address</h3>
                      <p className="text-sm text-white text-opacity-80">Tell us where your business is located</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-address" className="text-sm font-medium text-white">Business Address</Label>
                        <Input
                          id="store-address"
                          type="text"
                          required
                          value={storeData.address || ''}
                          onChange={(e) => setStoreData(prev => ({ ...prev, address: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder="123 Main Street, City, Country"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="store-phone" className="text-sm font-medium text-white">Phone Number (Optional)</Label>
                        <Input
                          id="store-phone"
                          type="tel"
                          value={storeData.phoneNumber || ''}
                          onChange={(e) => setStoreData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="h-11 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 text-white placeholder:text-white placeholder:text-opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
                          placeholder="+49 123 456 789"
                        />
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setRegistrationStep(2)}
                        className="flex-1 h-11 rounded-xl text-white border-white border-opacity-30 hover:bg-white hover:bg-opacity-20"
                      >
                        Previous
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => setRegistrationStep(4)}
                        className="flex-1 h-11 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        disabled={!storeData.address}
                      >
                        <span className="flex items-center gap-2">
                          Continue to Schedule
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {registrationStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-white mb-2">{t('auth.business_hours')}</h3>
                      <p className="text-sm text-white text-opacity-80">{t('auth.business_hours_subtitle')}</p>
                    </div>
                    
                    <WeeklyScheduleSetup
                      onScheduleChange={(schedule) => setWeeklySchedule(schedule)}
                      initialSchedule={weeklySchedule || undefined}
                    />
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="button"
                        onClick={() => setRegistrationStep(3)}
                        className="flex-1 h-11 rounded-xl bg-transparent border-2 border-white border-opacity-30 text-white hover:bg-white hover:bg-opacity-20 backdrop-filter backdrop-blur-sm transition-all duration-300"
                      >
                        {t('auth.previous')}
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => {
                          registerMutation.mutate({
                            ...registerData,
                            storeName: storeData.name,
                            storeDescription: storeData.description,
                            storeAddress: storeData.address,
                            storePhoneNumber: storeData.phoneNumber,
                            storeLogoUrl: storeData.logoUrl,
                            storeLanguage: storeData.language,
                            weeklySchedule: weeklySchedule
                          });
                        }}
                        className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? (language === 'de' ? "Konto wird erstellt..." : "Creating account...") : (
                          <span className="flex items-center gap-2">
                            {t('auth.create_account')}
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
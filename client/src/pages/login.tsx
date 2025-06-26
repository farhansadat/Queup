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
    language: "en"
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
    mutationFn: async (data: { email: string; password: string; firstName: string; lastName: string; storeType: string; workingHours?: any }) => {
      const fullData = {
        ...data,
        ...storeData,
        weeklySchedule
      };
      const response = await apiRequest("POST", "/api/auth/register", fullData);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-2xl border-0">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            QueueUp Pro
          </CardTitle>
          <p className="text-gray-600 mt-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Professional Queue Management
          </p>
        </CardHeader>
        <CardContent>
          {/* Back to Landing Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/")}
              className="text-gray-600 hover:text-purple-600 p-0 h-auto font-normal"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {language === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="login" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="w-4 h-4 mr-2" />
                {t('auth.login_title')}
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Store className="w-4 h-4 mr-2" />
                {t('auth.register_title')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">{t('auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    placeholder={language === 'de' ? 'E-Mail eingeben' : 'Enter your email'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">{t('auth.password')}</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                    placeholder={language === 'de' ? 'Passwort eingeben' : 'Enter your password'}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group" 
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
                    <Button variant="ghost" type="button" className="text-sm text-purple-600 hover:text-purple-700 h-auto p-0 font-normal">
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
                    registrationStep >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <div className={`w-12 h-1 ${registrationStep >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    registrationStep >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                </div>

                {registrationStep === 1 && (
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    setRegistrationStep(2);
                  }} className="space-y-5">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {language === 'de' ? 'Persönliche Informationen' : 'Personal Information'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {language === 'de' ? 'Beginnen wir mit Ihren grundlegenden Daten' : "Let's start with your basic details"}
                      </p>
                      <div className="flex justify-center mt-4">
                        <LanguageSelector />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-firstName" className="text-sm font-medium">{t('auth.first_name')}</Label>
                        <Input
                          id="register-firstName"
                          type="text"
                          required
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          placeholder={language === 'de' ? 'Max' : 'John'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-lastName" className="text-sm font-medium">{t('auth.last_name')}</Label>
                        <Input
                          id="register-lastName"
                          type="text"
                          required
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          placeholder={language === 'de' ? 'Mustermann' : 'Doe'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-sm font-medium">{t('auth.email')}</Label>
                      <Input
                        id="register-email"
                        type="email"
                        required
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                        placeholder={language === 'de' ? 'max@beispiel.de' : 'john@example.com'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-sm font-medium">{t('auth.password')}</Label>
                      <Input
                        id="register-password"
                        type="password"
                        required
                        minLength={6}
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                        placeholder={language === 'de' ? 'Mindestens 6 Zeichen' : 'At least 6 characters'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-storeType" className="text-sm font-medium">{t('auth.store_type')}</Label>
                      <Select value={registerData.storeType} onValueChange={(value) => setRegisterData(prev => ({ ...prev, storeType: value }))}>
                        <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder={language === 'de' ? 'Geschäftstyp auswählen' : 'Select your business type'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="barbershop">{t('auth.store_type_barbershop')}</SelectItem>
                          <SelectItem value="salon">{t('auth.store_type_salon')}</SelectItem>
                          <SelectItem value="clinic">{t('auth.store_type_clinic')}</SelectItem>
                          <SelectItem value="restaurant">{t('auth.store_type_restaurant')}</SelectItem>
                          <SelectItem value="retail">{t('auth.store_type_retail')}</SelectItem>
                          <SelectItem value="spa">{t('auth.store_type_spa')}</SelectItem>
                          <SelectItem value="dental">{t('auth.store_type_dental')}</SelectItem>
                          <SelectItem value="veterinary">{t('auth.store_type_veterinary')}</SelectItem>
                          <SelectItem value="automotive">{t('auth.store_type_automotive')}</SelectItem>
                          <SelectItem value="other">{t('auth.store_type_other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('auth.store_information')}</h3>
                      <p className="text-sm text-gray-600">{t('auth.store_information_subtitle')}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="store-name" className="text-sm font-medium">{t('auth.store_name')}</Label>
                        <Input
                          id="store-name"
                          type="text"
                          required
                          value={storeData.name}
                          onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                          className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          placeholder={language === 'de' ? 'Name Ihres Unternehmens' : 'Your Business Name'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="store-description" className="text-sm font-medium">{t('auth.store_description')} (Optional)</Label>
                        <Input
                          id="store-description"
                          type="text"
                          value={storeData.description}
                          onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                          className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-colors"
                          placeholder={language === 'de' ? 'Kurze Beschreibung Ihres Unternehmens' : 'Brief description of your business'}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t('auth.store_language')}</Label>
                        <Select value={storeData.language} onValueChange={(value) => setStoreData(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500">
                            <SelectValue placeholder={language === 'de' ? 'Geschäftssprache auswählen' : 'Select store language'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="de">Deutsch (German)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">{t('auth.logo_upload')} (Optional)</Label>
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
                        className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl group"
                        disabled={!storeData.name}
                      >
                        <span className="flex items-center gap-2">
                          {t('auth.continue_to_schedule')}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </Button>
                    </div>
                  </div>
                )}

                {registrationStep === 3 && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('auth.business_hours')}</h3>
                      <p className="text-sm text-gray-600">{t('auth.business_hours_subtitle')}</p>
                    </div>
                    
                    <WeeklyScheduleSetup
                      onScheduleChange={(schedule) => setWeeklySchedule(schedule)}
                      initialSchedule={weeklySchedule || undefined}
                    />
                    
                    <div className="flex space-x-3">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setRegistrationStep(2)}
                        className="flex-1 h-11 rounded-xl"
                      >
                        {t('auth.previous')}
                      </Button>
                      <Button 
                        type="button"
                        onClick={() => {
                          registerMutation.mutate({
                            ...registerData,
                            workingHours: weeklySchedule
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
        </CardContent>
      </Card>
    </div>
  );
}
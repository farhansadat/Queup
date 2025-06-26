import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/lib/i18n";
import { 
  Users, 
  Clock, 
  QrCode, 
  Smartphone, 
  BarChart3, 
  Shield, 
  CheckCircle, 
  Star,
  ArrowRight,
  Menu,
  X
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useLanguage();

  const getGermanTestimonial = (index: number) => {
    return t(`landing.testimonial_${index + 1}_content`);
  };

  const features = language === 'de' ? [
    {
      icon: QrCode,
      title: "QR-Code Integration",
      description: "Kunden scannen QR-Codes, um sofort über ihr Handy in die Warteschlange einzusteigen"
    },
    {
      icon: Clock,
      title: "Echtzeit-Updates",
      description: "Live-Warteschlangenstatus und Wartezeitschätzungen für Kunden und Personal"
    },
    {
      icon: Users,
      title: "Personal-Management",
      description: "Verwalten Sie Teamzeitpläne, weisen Sie Kunden zu und verfolgen Sie die Leistung"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Umfassende Einblicke in Kundenfluss und Geschäftskennzahlen"
    },
    {
      icon: Smartphone,
      title: "Mobil Optimiert",
      description: "Perfekte Erfahrung auf allen Geräten - Handys, Tablets und Desktops"
    },
    {
      icon: Shield,
      title: "Sicher & Zuverlässig",
      description: "Enterprise-Sicherheit mit 99,9% Verfügbarkeitsgarantie"
    }
  ] : [
    {
      icon: QrCode,
      title: "QR Code Integration",
      description: "Customers scan QR codes to join queues instantly from their phones"
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live queue status and wait time estimates for customers and staff"
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Manage team schedules, assign customers, and track performance"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into customer flow and business metrics"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices - phones, tablets, and desktops"
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      business: "Bella Hair Salon",
      text: "QueueUp Pro transformed our customer experience. No more crowded waiting areas!",
      rating: 5
    },
    {
      name: "Mike Rodriguez", 
      business: "Classic Cuts Barbershop",
      text: "Our customers love the convenience. Queue management has never been easier.",
      rating: 5
    },
    {
      name: "Dr. Emily Watson",
      business: "Downtown Medical Clinic", 
      text: "Reduced wait times and improved patient satisfaction significantly.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                QueueUp Pro
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div 
                className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
                onClick={() => setLocation("/features")}
              >
                {t('navigation.features')}
              </div>
              <div 
                className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
                onClick={() => setLocation("/pricing")}
              >
                {t('navigation.pricing')}
              </div>
              <a href="#testimonials" className="text-gray-600 hover:text-purple-600 transition-colors">
                {language === 'de' ? 'Bewertungen' : 'Reviews'}
              </a>
              <LanguageSelector />
              <Button 
                variant="outline" 
                onClick={() => setLocation("/login")}
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                {t('common.login')}
              </Button>
              <Button 
                onClick={() => setLocation("/register")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {t('landing.get_started')}
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-purple-100">
              <div className="flex flex-col space-y-3">
                <div className="flex justify-center mb-3">
                  <LanguageSelector />
                </div>
                <div 
                  className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => {
                    setLocation("/features");
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('navigation.features')}
                </div>
                <div 
                  className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => {
                    setLocation("/pricing");
                    setMobileMenuOpen(false);
                  }}
                >
                  {t('navigation.pricing')}
                </div>
                <a 
                  href="#testimonials" 
                  className="text-gray-600 hover:text-purple-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {language === 'de' ? 'Bewertungen' : 'Reviews'}
                </a>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation("/login")}
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 w-full"
                >
                  {t('common.login')}
                </Button>
                <Button 
                  onClick={() => setLocation("/register")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 w-full"
                >
                  {t('landing.get_started')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 hero-gradient relative overflow-hidden">
        {/* Floating gradient blobs */}
        <div className="blob w-64 h-64 bg-gradient-to-r from-purple-400/40 to-violet-600/40 top-20 left-10 z-0"></div>
        <div className="blob w-80 h-80 bg-gradient-to-r from-indigo-400/30 to-purple-500/30 top-40 right-20 z-0 animation-delay-2000"></div>
        <div className="blob w-48 h-48 bg-gradient-to-r from-violet-300/50 to-indigo-400/50 bottom-20 left-1/4 z-0 animation-delay-4000"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            ✨ {language === 'de' ? 'Jetzt verfügbar - Transformieren Sie Ihr Geschäft' : 'Now Available - Transform Your Business'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeInUp">
            {language === 'de' ? 'Wartezeiten eliminieren mit' : 'Eliminate Wait Times with'}
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Intelligentem Warteschlangen-Management' : 'Smart Queue Management'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fadeInUp animation-delay-200">
            {t('landing.hero_subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeInUp animation-delay-400">
            <Button 
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg btn-hero animate-glow"
            >
              {t('landing.get_started')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg btn-hero"
            >
              {t('landing.watch_demo')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center animate-fadeInUp animation-delay-600">
            <div className="animate-fadeInScale">
              <div className="text-3xl font-bold text-purple-600">500+</div>
              <div className="text-gray-600">{t('landing.stats_businesses')}</div>
            </div>
            <div className="animate-fadeInScale animation-delay-200">
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-gray-600">{t('landing.stats_customers')}</div>
            </div>
            <div className="animate-fadeInScale animation-delay-400">
              <div className="text-3xl font-bold text-purple-600">2h</div>
              <div className="text-gray-600">{t('landing.stats_time_saved')}</div>
            </div>
            <div className="animate-fadeInScale animation-delay-600">
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600">{t('landing.stats_satisfaction')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'de' 
                ? 'Leistungsstarke Funktionen zur Verbesserung der Kundenerfahrung und Optimierung von Betriebsabläufen'
                : 'Powerful features designed to improve customer experience and streamline operations'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`border-purple-100 feature-card shadow-lg animate-fadeInUp animation-delay-${index * 200}`}>
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4 icon-hover">
                    <feature.icon className="w-6 h-6 text-purple-600 animate-iconFloat" />
                  </div>
                  <CardTitle className="text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.pricing_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'de' 
                ? 'Wählen Sie den perfekten Plan für Ihre Unternehmensgröße und Bedürfnisse'
                : 'Choose the perfect plan for your business size and needs'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-purple-200 pricing-card shadow-lg animate-fadeInUp">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{t('landing.pricing_starter')}</CardTitle>
                <div className="text-4xl font-bold text-purple-600 mt-4">
                  €29<span className="text-lg text-gray-600">/{t('landing.pricing_month')}</span>
                </div>
                <p className="text-gray-600 mt-2">
                  {language === 'de' ? 'Perfekt für kleine Unternehmen' : 'Perfect for small businesses'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Bis zu 2 Mitarbeiter' : 'Up to 2 staff members'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? '100 Kunden pro Tag' : '100 customers per day'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'QR-Code Generierung' : 'QR code generation'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Echtzeit-Warteschlangen Updates' : 'Real-time queue updates'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Basis Analytics' : 'Basic analytics'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'E-Mail Support' : 'Email support'}
                  </span>
                </div>
                <Button 
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setLocation("/register")}
                >
                  {language === 'de' ? '14-tägige kostenlose Testversion starten' : 'Start 14-Day Free Trial'}
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-purple-300 pricing-card shadow-lg animate-fadeInUp animation-delay-200 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1">
                  {t('landing.pricing_most_popular')}
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">{t('landing.pricing_professional')}</CardTitle>
                <div className="text-4xl font-bold text-purple-600 mt-4">
                  €79<span className="text-lg text-gray-600">/{t('landing.pricing_month')}</span>
                </div>
                <p className="text-gray-600 mt-2">
                  {language === 'de' ? 'Für wachsende Unternehmen' : 'For growing businesses'}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Unbegrenzte Mitarbeiteranzahl' : 'Unlimited staff members'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Unbegrenzte Kundenanzahl' : 'Unlimited customers'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Erweiterte QR-Code Anpassung' : 'Advanced QR customization'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Kiosk-Display Modus' : 'Kiosk display mode'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Erweiterte Analytics & Berichte' : 'Advanced analytics & reports'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Individuelles Branding' : 'Custom branding'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'Priority Support' : 'Priority support'}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">
                    {language === 'de' ? 'API Zugang' : 'API access'}
                  </span>
                </div>
                <Button 
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setLocation("/register")}
                >
                  {language === 'de' ? '14-tägige kostenlose Testversion starten' : 'Start 14-Day Free Trial'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {language === 'de' ? 'Geliebt von Unternehmen weltweit' : 'Loved by Businesses Worldwide'}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {language === 'de' 
                ? 'Sehen Sie, was unsere Kunden über QueueUp Pro sagen'
                : 'See what our customers have to say about QueueUp Pro'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{language === 'de' ? getGermanTestimonial(index) : testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {language === 'de' ? t(`landing.testimonial_${index + 1}_name`) : testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {language === 'de' ? t(`landing.testimonial_${index + 1}_role`) : testimonial.business}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600 relative overflow-hidden">
        {/* Floating gradient blobs */}
        <div className="blob w-72 h-72 bg-gradient-to-r from-purple-400/30 to-violet-600/30 top-10 left-20 z-0"></div>
        <div className="blob w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 bottom-10 right-10 z-0 animation-delay-2000"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 animate-fadeInUp">
            {t('landing.cta_title')}
          </h2>
          <p className="text-xl text-purple-100 mb-8 animate-fadeInUp animation-delay-200">
            {t('landing.cta_subtitle')}
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg btn-hero animate-glow animate-fadeInUp animation-delay-400"
          >
            {t('landing.cta_start_trial')}
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QueueUp Pro</span>
              </div>
              <p className="text-gray-400">
                {language === 'de' 
                  ? 'Intelligente Warteschlangenmanagement für moderne Unternehmen.'
                  : 'Smart queue management for modern businesses.'
                }
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('landing.footer_product')}</h3>
              <div className="space-y-2">
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/features")}
                >
                  {t('navigation.features')}
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/pricing")}
                >
                  {t('navigation.pricing')}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('landing.footer_support')}</h3>
              <div className="space-y-2">
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">
                  {language === 'de' ? 'Kontakt' : 'Contact'}
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/status")}
                >
                  {language === 'de' ? 'Status' : 'Status'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">{t('landing.footer_company')}</h3>
              <div className="space-y-2">
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/about")}
                >
                  {t('navigation.about')}
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/privacy")}
                >
                  {language === 'de' ? 'Datenschutz' : 'Privacy'}
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/terms")}
                >
                  {language === 'de' ? 'AGB' : 'Terms'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center">
            <p className="text-gray-400">
              © 2025 QueueUp Pro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
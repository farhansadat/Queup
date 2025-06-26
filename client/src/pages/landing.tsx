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

  const features = [
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
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            ✨ {language === 'de' ? 'Jetzt verfügbar - Transformieren Sie Ihr Geschäft' : 'Now Available - Transform Your Business'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'de' ? 'Wartezeiten eliminieren mit' : 'Eliminate Wait Times with'}
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Intelligentem Warteschlangen-Management' : 'Smart Queue Management'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('landing.hero_subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={() => setLocation("/register")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-6 text-lg"
            >
              {t('landing.get_started')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg"
            >
              {t('landing.watch_demo')}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">2.5M+</div>
              <div className="text-gray-600">Queues Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">4.9/5</div>
              <div className="text-gray-600">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Queues
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to improve customer experience and streamline operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-purple-600" />
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your business size and needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Starter Plan */}
            <Card className="border-purple-200 hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Starter</CardTitle>
                <div className="text-4xl font-bold text-purple-600 mt-4">
                  $29<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Perfect for small businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Up to 2 staff members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">100 customers per day</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">QR code generation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Real-time queue updates</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Basic analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Email support</span>
                </div>
                <Button 
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setLocation("/register")}
                >
                  Start 14-Day Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Professional Plan */}
            <Card className="border-purple-300 hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Professional</CardTitle>
                <div className="text-4xl font-bold text-purple-600 mt-4">
                  $79<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">For growing businesses</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited staff members</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Unlimited customers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Advanced QR customization</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Kiosk display mode</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Advanced analytics & reports</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Custom branding</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Priority support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">API access</span>
                </div>
                <Button 
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => setLocation("/register")}
                >
                  Start 14-Day Free Trial
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
              Loved by Businesses Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about QueueUp Pro
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
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.business}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of businesses already using QueueUp Pro to improve customer experience
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Get Started Today - Free Trial
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
                Smart queue management for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <div className="space-y-2">
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/features")}
                >
                  Features
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/pricing")}
                >
                  Pricing
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/api")}
                >
                  API
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/help")}
                >
                  Help Center
                </div>
                <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Contact</div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/status")}
                >
                  Status
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <div className="space-y-2">
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/about")}
                >
                  About
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/privacy")}
                >
                  Privacy
                </div>
                <div 
                  className="text-gray-400 hover:text-white cursor-pointer transition-colors"
                  onClick={() => setLocation("/terms")}
                >
                  Terms
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
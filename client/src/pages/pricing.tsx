import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { 
  Users, 
  BarChart3, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Headphones
} from "lucide-react";

export default function PricingPage() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();

  const plans = [
    {
      name: "Starter",
      price: 29,
      icon: Users,
      description: "Perfect for small businesses",
      features: [
        "Up to 2 staff members",
        "100 customers per day",
        "QR code generation",
        "Real-time queue updates",
        "Basic analytics",
        "Email support",
        "Mobile responsive design",
        "Customer notifications"
      ],
      limitations: [
        "Limited customization",
        "Standard support only",
        "Basic reporting"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: 79,
      icon: BarChart3,
      description: "For growing businesses",
      features: [
        "Unlimited staff members",
        "Unlimited customers",
        "Advanced QR customization",
        "Kiosk display mode",
        "Advanced analytics & reports",
        "Custom branding",
        "Priority support",
        "API access",
        "SMS notifications",
        "Multi-location support",
        "White-label options",
        "Custom integrations"
      ],
      limitations: [],
      popular: true
    }
  ];

  const faqs = [
    {
      question: "Can I change plans anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, we offer a 14-day free trial for both plans. No credit card required to start."
    },
    {
      question: "What happens if I exceed my plan limits?",
      answer: "For the Starter plan, we'll notify you when approaching limits and help you upgrade. Professional plan has no limits."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes, we offer custom enterprise solutions for large organizations. Contact our sales team for pricing."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual subscriptions."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security with SSL encryption, SOC 2 compliance, and regular security audits."
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
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {language === 'de' ? 'Zurück zur Startseite' : 'Back to Home'}
              </Button>
              <Button 
                onClick={() => setLocation("/register")}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {language === 'de' ? 'Loslegen' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            {language === 'de' ? '💰 Einfache, transparente Preise' : '💰 Simple, Transparent Pricing'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'de' ? 'Wählen Sie den perfekten Plan' : 'Choose the Perfect Plan'}
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'de' ? 'für Ihr Unternehmen' : 'for Your Business'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === 'de' 
              ? 'Starten Sie mit unserer 14-tägigen kostenlosen Testversion. Keine Kreditkarte erforderlich. Skalieren Sie mit unseren flexiblen Preisoptionen.'
              : 'Start with our 14-day free trial. No credit card required. Scale as you grow with our flexible pricing options.'
            }
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-purple-200 hover:shadow-xl transition-shadow relative ${plan.popular ? 'border-purple-300 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <div className={`w-16 h-16 ${plan.popular ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 'bg-gradient-to-br from-purple-100 to-indigo-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-purple-600'}`} />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-purple-600 mt-4">
                    ${plan.price}<span className="text-lg text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                      Included Features
                    </h4>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {plan.limitations.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">Limitations</h4>
                      {plan.limitations.map((limitation, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-4 h-4 border border-gray-300 rounded flex-shrink-0"></div>
                          <span className="text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Button 
                    className="w-full mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    onClick={() => setLocation("/register")}
                  >
                    Start 14-Day Free Trial
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose QueueUp Pro?</h2>
            <p className="text-xl text-gray-600">More than just pricing - we deliver exceptional value</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quick Setup</h3>
              <p className="text-gray-600">Get started in under 5 minutes. No technical knowledge required.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level encryption and SOC 2 compliance for your peace of mind.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our expert team is always ready to help you succeed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-gray-200">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
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
            Join thousands of businesses already using QueueUp Pro
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Start Free Trial Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro</span>
          </div>
          <p className="text-gray-400">
            © 2025 QueueUp Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
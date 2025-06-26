import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { 
  Users, 
  Clock, 
  QrCode, 
  Smartphone, 
  BarChart3, 
  Shield, 
  ArrowLeft,
  ArrowRight,
  Zap,
  Globe,
  Bell,
  Settings
} from "lucide-react";

export default function FeaturesPage() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();

  const features = language === 'de' ? [
    {
      icon: QrCode,
      title: "QR-Code Integration",
      description: "Kunden scannen QR-Codes, um sofort über ihr Handy in die Warteschlange einzutreten",
      details: "Generieren Sie einzigartige QR-Codes für jeden Service oder Mitarbeiter. Kunden scannen und treten automatisch in die Warteschlange mit ihrem bevorzugten Mitarbeiter ein.",
      benefits: ["Kontaktloser Warteschlangen-Beitritt", "Sofortige Warteschlangen-Updates", "Reduziert körperliche Ansammlung"]
    },
    {
      icon: Clock,
      title: "Echtzeit-Updates",
      description: "Live-Warteschlangenstatus und Wartezeit-Schätzungen für Kunden und Personal",
      details: "WebSocket-betriebene Echtzeit-Benachrichtigungen halten alle über Warteschlangenänderungen, Wartezeiten und Service-Updates informiert.",
      benefits: ["Live-Positionsverfolgung", "Genaue Wartezeit-Schätzungen", "Sofortige Benachrichtigungen"]
    },
    {
      icon: Users,
      title: "Personal-Management",
      description: "Verwalten Sie Team-Zeitpläne, weisen Sie Kunden zu und verfolgen Sie die Leistung",
      details: "Komplettes Personal-Management-System mit Foto-Uploads, Verfügbarkeitsverfolgung und Leistungsanalysen.",
      benefits: ["Personal-Planung", "Leistungsverfolgung", "Kundenzuweisungen"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Umfassende Einblicke in Kundenfluss und Geschäftskennzahlen",
      details: "Erweiterte Analytics zeigen Spitzenzeiten, durchschnittliche Wartezeiten, Kundenzufriedenheit und Umsatzoptimierungs-Einblicke.",
      benefits: ["Business Intelligence", "Umsatzoptimierung", "Kunden-Einblicke"]
    },
    {
      icon: Smartphone,
      title: "Mobil Optimiert",
      description: "Perfekte Erfahrung auf allen Geräten - Handys, Tablets und Desktops",
      details: "Responsive Design, das nahtlos auf allen Geräten mit nativer Mobile-App-Leistung funktioniert.",
      benefits: ["Geräteübergreifende Kompatibilität", "Touch-optimierte Benutzeroberfläche", "Offline-Fähigkeiten"]
    },
    {
      icon: Shield,
      title: "Sicher & Zuverlässig",
      description: "Unternehmens-Sicherheit mit 99,9% Verfügbarkeits-Garantie",
      details: "Bank-Level-Verschlüsselung, SOC 2-Konformität und redundante Infrastruktur gewährleisten, dass Ihre Daten immer sicher und zugänglich sind.",
      benefits: ["Datenverschlüsselung", "SOC 2-konform", "99,9% Verfügbarkeits-SLA"]
    },
    {
      icon: Bell,
      title: "Intelligente Benachrichtigungen",
      description: "Automatisierte SMS- und E-Mail-Benachrichtigungen für Kunden",
      details: "Halten Sie Kunden mit automatisierten Benachrichtigungen über ihre Warteschlangenposition, geschätzte Wartezeiten und wann sie an der Reihe sind informiert.",
      benefits: ["SMS-Benachrichtigungen", "E-Mail-Alerts", "Benutzerdefinierte Nachrichten"]
    },
    {
      icon: Globe,
      title: "Multi-Standort-Unterstützung",
      description: "Verwalten Sie mehrere Geschäftsstandorte von einem Dashboard aus",
      details: "Zentralisierte Verwaltung für Franchise-Besitzer und Multi-Standort-Unternehmen mit standortspezifischen Analytics und Einstellungen.",
      benefits: ["Zentralisierte Verwaltung", "Standort-Analytics", "Franchise-Unterstützung"]
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Verbinden Sie sich mit Ihren bestehenden Geschäftstools und Software",
      details: "Robuste REST-API ermöglicht die Integration mit POS-Systemen, CRM-Tools, Terminbuchungs-Software und anderen Geschäftsanwendungen.",
      benefits: ["POS-Integration", "CRM-Konnektivität", "Benutzerdefinierte Integrationen"]
    },
    {
      icon: Settings,
      title: "Benutzerdefiniertes Branding",
      description: "Vollständige Anpassung der Erfahrung mit Ihren Markenfarben und Logo",
      details: "White-Label-Lösung mit vollständigen Anpassungsoptionen einschließlich Farben, Logos, Nachrichten und Domain-Anpassung.",
      benefits: ["Marken-Anpassung", "White-Label-Option", "Benutzerdefinierte Domains"]
    }
  ] : [
    {
      icon: QrCode,
      title: "QR Code Integration",
      description: "Customers scan QR codes to join queues instantly from their phones",
      details: "Generate unique QR codes for each service or staff member. Customers scan and automatically join the queue with their preferred staff member.",
      benefits: ["Contactless queue joining", "Instant queue updates", "Reduces physical crowding"]
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Live queue status and wait time estimates for customers and staff",
      details: "WebSocket-powered real-time notifications keep everyone informed about queue changes, wait times, and service updates.",
      benefits: ["Live position tracking", "Accurate wait time estimates", "Instant notifications"]
    },
    {
      icon: Users,
      title: "Staff Management",
      description: "Manage team schedules, assign customers, and track performance",
      details: "Complete staff management system with photo uploads, availability tracking, and performance analytics.",
      benefits: ["Staff scheduling", "Performance tracking", "Customer assignments"]
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive insights into customer flow and business metrics",
      details: "Advanced analytics showing peak hours, average wait times, customer satisfaction, and revenue optimization insights.",
      benefits: ["Business intelligence", "Revenue optimization", "Customer insights"]
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Perfect experience on all devices - phones, tablets, and desktops",
      details: "Responsive design that works flawlessly across all devices with native mobile app performance.",
      benefits: ["Cross-device compatibility", "Touch-optimized interface", "Offline capabilities"]
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
      details: "Bank-level encryption, SOC 2 compliance, and redundant infrastructure ensuring your data is always safe and accessible.",
      benefits: ["Data encryption", "SOC 2 compliant", "99.9% uptime SLA"]
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Automated SMS and email notifications for customers",
      details: "Keep customers informed with automated notifications about their queue position, estimated wait times, and when it's their turn.",
      benefits: ["SMS notifications", "Email alerts", "Custom messaging"]
    },
    {
      icon: Globe,
      title: "Multi-Location Support",
      description: "Manage multiple business locations from one dashboard",
      details: "Centralized management for franchise owners and multi-location businesses with location-specific analytics and settings.",
      benefits: ["Centralized management", "Location analytics", "Franchise support"]
    },
    {
      icon: Zap,
      title: "API Integration",
      description: "Connect with your existing business tools and software",
      details: "Robust REST API allows integration with POS systems, CRM tools, appointment software, and other business applications.",
      benefits: ["POS integration", "CRM connectivity", "Custom integrations"]
    },
    {
      icon: Settings,
      title: "Custom Branding",
      description: "Fully customize the experience with your brand colors and logo",
      details: "White-label solution with complete customization options including colors, logos, messaging, and domain customization.",
      benefits: ["Brand customization", "White-label option", "Custom domains"]
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
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
              >
                {language === 'de' ? 'Jetzt starten' : 'Get Started'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            {language === 'de' ? '✨ Vollständige Funktionsübersicht' : '✨ Complete Feature Overview'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'de' ? 'Leistungsstarke Funktionen für' : 'Powerful Features for'}
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Moderne Unternehmen' : 'Modern Businesses'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === 'de' 
              ? 'Entdecken Sie, wie QueueUp Pros umfassende Funktionen Ihre Geschäftsabläufe transformieren und außergewöhnliche Kundenerfahrungen liefern können.'
              : 'Discover how QueueUp Pro\'s comprehensive feature set can transform your business operations and deliver exceptional customer experiences.'
            }
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-purple-100 hover:shadow-xl transition-all duration-300 group">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  <p className="text-gray-600">{feature.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{feature.details}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">{language === 'de' ? 'Hauptvorteile:' : 'Key Benefits:'}</h4>
                    <ul className="space-y-1">
                      {feature.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
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
            Ready to Experience These Features?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start your free trial today and see how QueueUp Pro can transform your business
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Start Free Trial Now
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
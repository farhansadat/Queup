import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  Scale, 
  Shield,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  CreditCard,
  RefreshCw
} from "lucide-react";
import { useLanguage } from "../lib/i18n";
import { LanguageSelector } from "../components/LanguageSelector";

export default function TermsPage() {
  const [, setLocation] = useLocation();
  const { t, language } = useLanguage();

  const sections = language === 'de' ? [
    {
      title: "Leistungsbeschreibung",
      icon: FileText,
      content: "QueueUp Pro bietet digitale Warteschlangen-Management-Software, die es Unternehmen ermöglicht, den Kundenfluss durch QR-Codes, Echtzeit-Updates und Analytics zu verwalten. Unser Service umfasst webbasierte Anwendungen, mobile Optimierung und API-Zugang je nach Ihrem Abonnement-Plan."
    },
    {
      title: "Kontoregistrierung",
      icon: Users,
      content: "Sie müssen genaue und vollständige Informationen bei der Kontoerstellung angeben. Sie sind verantwortlich für die Wahrung der Vertraulichkeit Ihrer Kontodaten und für alle Aktivitäten, die unter Ihrem Konto auftreten. Sie müssen uns unverzüglich über jede unbefugte Nutzung informieren."
    },
    {
      title: "Nutzungsrechte und -beschränkungen",
      icon: Scale,
      content: "Wir gewähren Ihnen ein begrenztes, nicht-exklusives, nicht-übertragbares Recht zur Nutzung unserer Software gemäß den Bestimmungen Ihres Abonnements. Sie dürfen die Software nicht reverse-engineeren, dekompilieren oder versuchen, den Quellcode zu extrahieren."
    },
    {
      title: "Datenschutz und DSGVO-Konformität",
      icon: Shield,
      content: "Als in Deutschland ansässiges Unternehmen halten wir uns vollständig an die DSGVO (Datenschutz-Grundverordnung). Wir verarbeiten personenbezogene Daten nur für die Bereitstellung unserer Dienstleistungen und mit Ihrer ausdrücklichen Einwilligung. Detaillierte Informationen finden Sie in unserer Datenschutzerklärung."
    },
    {
      title: "Zahlungsbedingungen",
      icon: CreditCard,
      content: "Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer (MwSt.). Zahlungen sind im Voraus zu leisten. Bei Zahlungsrückständen behalten wir uns das Recht vor, den Service zu suspendieren. Rückerstattungen erfolgen gemäß unserem Widerrufsrecht und den gesetzlichen Bestimmungen."
    },
    {
      title: "Haftungsausschluss",
      icon: AlertTriangle,
      content: "Unsere Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig. Für leichte Fahrlässigkeit haften wir nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung für mittelbare Schäden ist ausgeschlossen, soweit gesetzlich zulässig."
    },
    {
      title: "Kündigung",
      icon: XCircle,
      content: "Beide Parteien können das Abonnement mit einer Frist von 30 Tagen zum Monatsende kündigen. Bei Verstößen gegen diese AGB können wir das Konto sofort kündigen. Nach Kündigung werden Ihre Daten gemäß unserer Datenschutzerklärung behandelt."
    },
    {
      title: "Anwendbares Recht",
      icon: Scale,
      content: "Diese AGB unterliegen deutschem Recht unter Ausschluss des UN-Kaufrechts. Ausschließlicher Gerichtsstand für alle Streitigkeiten ist Berlin, Deutschland. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt."
    }
  ] : [
    {
      title: "Service Description",
      icon: FileText,
      content: "QueueUp Pro provides digital queue management software that enables businesses to manage customer flow through QR codes, real-time updates, and analytics. Our service includes web-based applications, mobile optimization, and API access depending on your subscription plan."
    },
    {
      title: "Account Registration",
      icon: Users,
      content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use."
    },
    {
      title: "Acceptable Use",
      icon: CheckCircle,
      content: "You may use our service only for lawful purposes and in accordance with these terms. You agree not to use the service to violate any laws, infringe on intellectual property rights, or engage in harmful activities including spamming, hacking, or distributing malware."
    },
    {
      title: "Payment Terms",
      icon: CreditCard,
      content: "Subscription fees are billed monthly or annually in advance. All fees are non-refundable except as required by law. We may change our pricing with 30 days' notice. Failed payments may result in service suspension after a grace period."
    },
    {
      title: "Service Availability", 
      icon: RefreshCw,
      content: "We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service. We may perform scheduled maintenance with advance notice. We are not liable for service interruptions beyond our reasonable control."
    },
    {
      title: "Data and Privacy",
      icon: Shield,
      content: "Your data belongs to you. We process your data according to our Privacy Policy. You grant us the right to use your data to provide our services. We implement appropriate security measures but cannot guarantee absolute security."
    },
    {
      title: "Intellectual Property",
      icon: Scale,
      content: "QueueUp Pro and all related materials are our intellectual property. You receive a limited license to use our service. You retain ownership of your content but grant us rights to store and process it to provide our services."
    },
    {
      title: "Termination",
      icon: XCircle,
      content: "Either party may terminate this agreement with 30 days' notice. We may suspend or terminate your account immediately for violations of these terms. Upon termination, your access ends and we may delete your data after a reasonable period."
    }
  ];

  const prohibited = [
    "Using the service for illegal activities",
    "Attempting to breach security measures",
    "Reverse engineering or copying our software",
    "Reselling or redistributing our service",
    "Creating fake accounts or impersonating others",
    "Overloading our systems with excessive requests",
    "Storing or transmitting malicious code",
    "Violating others' privacy or intellectual property"
  ];

  const liability = [
    "Service interruptions or downtime",
    "Data loss due to technical failures",
    "Third-party integrations or services",
    "Indirect, incidental, or consequential damages",
    "Loss of profits or business opportunities",
    "Damages exceeding fees paid in the last 12 months"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t('pages.terms_title')}
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
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            📋 Legal Agreement
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms of Service
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Please read these terms carefully before using QueueUp Pro. 
            By using our service, you agree to be bound by these terms.
          </p>
          
          <div className="text-sm text-gray-500">
            Effective Date: June 25, 2025 | Last Updated: June 25, 2025
          </div>
        </div>
      </section>

      {/* Agreement Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-100 bg-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Agreement Summary</CardTitle>
              <p className="text-gray-600">Key points of our service agreement</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What We Provide</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Queue management software platform</li>
                    <li>• Real-time updates and notifications</li>
                    <li>• Analytics and reporting tools</li>
                    <li>• Customer support and documentation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What We Expect</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Lawful use of our platform</li>
                    <li>• Timely payment of subscription fees</li>
                    <li>• Accurate account information</li>
                    <li>• Respect for our intellectual property</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Detailed Terms */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index} className="border-purple-100">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Activities */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-red-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-xl text-red-800">Prohibited Activities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prohibited.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-yellow-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-yellow-600" />
                  <CardTitle className="text-xl text-yellow-800">Limitation of Liability</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">We are not liable for:</p>
                <ul className="space-y-2">
                  {liability.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Governing Law & Disputes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Jurisdiction</h3>
                <p className="text-gray-700">
                  These terms are governed by the laws of Delaware, United States. 
                  Any disputes will be resolved in the courts of Delaware.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Dispute Resolution</h3>
                <p className="text-gray-700">
                  We encourage resolving disputes through direct communication. 
                  For formal disputes, we prefer binding arbitration before litigation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Changes to Terms</h3>
                <p className="text-gray-700">
                  We may update these terms periodically. Material changes will be 
                  communicated with 30 days' notice. Continued use constitutes acceptance.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Contact our legal team for clarification
          </p>
          <div className="space-y-2 mb-8">
            <div className="text-white font-medium">Email: legal@queueuppro.com</div>
            <div className="text-purple-100">Address: 123 Business St, Delaware, DE 19801</div>
          </div>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Contact Legal Team
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro Terms</span>
          </div>
          <p className="text-gray-400">
            © 2025 QueueUp Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
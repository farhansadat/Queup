import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { 
  Users, 
  Shield, 
  Lock, 
  Eye,
  ArrowLeft,
  Database,
  Globe,
  FileText,
  UserCheck,
  Settings
} from "lucide-react";

export default function PrivacyPage() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();

  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account information (name, email, password)",
        "Store information (business name, address, phone number)",
        "Staff member details and photos",
        "Customer queue data (names, contact information, queue positions)",
        "Usage analytics and performance metrics",
        "Payment and billing information"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Settings,
      content: [
        "Provide and maintain our queue management services",
        "Process customer queue entries and notifications",
        "Generate analytics and business insights",
        "Communicate with you about your account and services",
        "Improve our platform and develop new features",
        "Ensure security and prevent fraud"
      ]
    },
    {
      title: "Information Sharing",
      icon: Globe,
      content: [
        "We do not sell, trade, or rent your personal information",
        "Customer queue data is only visible to your authorized staff",
        "Aggregate, anonymized data may be used for platform improvements",
        "Information may be shared with service providers under strict agreements",
        "Legal compliance may require disclosure in certain circumstances",
        "Business transfers would include appropriate data protection measures"
      ]
    },
    {
      title: "Data Security",
      icon: Shield,
      content: [
        "End-to-end encryption for all data transmission",
        "Industry-standard SSL/TLS encryption",
        "Regular security audits and penetration testing",
        "SOC 2 Type II compliance",
        "Multi-factor authentication options",
        "Regular automated backups with encryption"
      ]
    },
    {
      title: "Your Rights",
      icon: UserCheck,
      content: [
        "Access your personal data at any time",
        "Request correction of inaccurate information",
        "Delete your account and associated data",
        "Export your data in portable formats",
        "Opt-out of marketing communications",
        "Request restriction of data processing"
      ]
    },
    {
      title: "Data Retention",
      icon: FileText,
      content: [
        "Active account data is retained for service provision",
        "Queue data is retained for 12 months for analytics",
        "Deleted accounts are purged within 30 days",
        "Backup data is retained for 90 days after deletion",
        "Financial records are kept for legal compliance periods",
        "Anonymized analytics data may be retained indefinitely"
      ]
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
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t('pages.privacy_title')}
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
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            🔒 Privacy & Data Protection
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your information when you use QueueUp Pro.
          </p>
          
          <div className="text-sm text-gray-500">
            Last updated: June 25, 2025
          </div>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Privacy at a Glance</h2>
            <p className="text-xl text-gray-600">Key principles that guide our data practices</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-purple-100 text-center">
              <CardHeader>
                <Lock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Data Minimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">We only collect data necessary to provide our services</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 text-center">
              <CardHeader>
                <Eye className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Clear information about what data we collect and why</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Security First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Enterprise-grade security protects your information</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
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
                  <ul className="space-y-3">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* GDPR/CCPA Compliance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Regulatory Compliance</CardTitle>
              <p className="text-gray-600">We comply with major privacy regulations worldwide</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">GDPR (European Union)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Lawful basis for processing personal data</li>
                    <li>• Right to access and portability</li>
                    <li>• Right to rectification and erasure</li>
                    <li>• Data protection by design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">CCPA (California)</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Right to know about data collection</li>
                    <li>• Right to delete personal information</li>
                    <li>• Right to opt-out of sale</li>
                    <li>• Non-discrimination for exercising rights</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-100 bg-purple-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Privacy Questions?</CardTitle>
              <p className="text-gray-600">Contact our Data Protection Officer</p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-700">
                If you have questions about this privacy policy or how we handle your data, 
                please contact our Data Protection Officer.
              </p>
              <div className="space-y-2">
                <div className="font-medium">Email: privacy@queueuppro.com</div>
                <div className="text-gray-600">Response time: Within 72 hours</div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Contact Privacy Team
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro Privacy</span>
          </div>
          <p className="text-gray-400">
            © 2025 QueueUp Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
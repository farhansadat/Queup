import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search, 
  HelpCircle, 
  BookOpen,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
  Video,
  FileText,
  Settings,
  QrCode,
  BarChart3,
  Shield,
  Smartphone
} from "lucide-react";

export default function HelpPage() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: Settings,
      title: "Getting Started",
      description: "Setup guides and initial configuration",
      articles: [
        "How to create your first store",
        "Setting up staff members",
        "Configuring weekly schedules",
        "Uploading your logo and branding"
      ]
    },
    {
      icon: QrCode,
      title: "QR Codes & Queue Management",
      description: "Everything about QR codes and managing queues",
      articles: [
        "Generating QR codes for your store",
        "How customers join queues",
        "Managing queue positions",
        "Serving and canceling customers"
      ]
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Understanding your business metrics",
      articles: [
        "Reading your dashboard analytics",
        "Understanding wait time calculations",
        "Viewing served customer history",
        "Exporting reports (Professional plan)"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile & Kiosk Mode",
      description: "Mobile optimization and display modes",
      articles: [
        "Using QueueUp on mobile devices",
        "Setting up kiosk display mode",
        "Troubleshooting mobile QR scanning",
        "Customer notification settings"
      ]
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Account security and data protection",
      articles: [
        "Changing your password",
        "Understanding data privacy",
        "Two-factor authentication",
        "API security best practices"
      ]
    },
    {
      icon: Users,
      title: "Account & Billing",
      description: "Managing your subscription and account",
      articles: [
        "Upgrading or downgrading plans",
        "Understanding billing cycles",
        "Managing payment methods",
        "Canceling your subscription"
      ]
    }
  ];

  const faqs = [
    {
      question: "How do customers join my queue?",
      answer: "Customers scan your QR code with their phone camera or QR code reader app. This takes them to your store's queue page where they can enter their name and join the queue instantly."
    },
    {
      question: "Can I customize the QR code design?",
      answer: "With the Professional plan, you can customize QR code colors and add your logo. The Starter plan includes standard black and white QR codes."
    },
    {
      question: "What happens if a customer leaves without being served?",
      answer: "You can mark customers as 'canceled' in your dashboard. This removes them from the active queue and helps maintain accurate wait time estimates."
    },
    {
      question: "How accurate are the wait time estimates?",
      answer: "Wait times are calculated based on your historical service times and current queue length. The system learns from your patterns to provide increasingly accurate estimates."
    },
    {
      question: "Can I use QueueUp for multiple locations?",
      answer: "Yes! The Professional plan supports multiple locations with centralized management and location-specific analytics."
    },
    {
      question: "Is there a limit to queue size?",
      answer: "The Starter plan supports up to 100 customers per day. The Professional plan has no limits on queue size or daily customers."
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
                <HelpCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Help Center
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
                className="text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
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
            📚 Help & Support
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            How can we
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions, browse our knowledge base, or contact our support team
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-purple-200 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <Video className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Step-by-step video guides for common tasks</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Live Chat</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Chat with our support team in real-time</p>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <FileText className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">Complete technical documentation and API guides</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find the help you need organized by topic</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                  <p className="text-gray-600">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.articles.map((article, i) => (
                      <li key={i} className="text-sm text-gray-700 hover:text-purple-600 cursor-pointer transition-colors">
                        • {article}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4 border-purple-200 text-purple-600 hover:bg-purple-50">
                    View All Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to the most common questions</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Our support team is here to help you succeed
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
            >
              Contact Support
              <MessageCircle className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-6 text-lg"
              onClick={() => setLocation("/api")}
            >
              View API Docs
              <BookOpen className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro Help</span>
          </div>
          <p className="text-gray-400">
            © 2025 QueueUp Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
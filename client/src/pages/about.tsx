import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/i18n";
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  ArrowLeft,
  ArrowRight,
  Building,
  Globe,
  TrendingUp
} from "lucide-react";

export default function AboutPage() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "2.5M+", label: "Queues Managed", icon: TrendingUp },
    { number: "150+", label: "Countries", icon: Globe },
    { number: "99.9%", label: "Uptime", icon: Award }
  ];

  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We constantly push the boundaries of what's possible in queue management technology."
    },
    {
      icon: Heart,
      title: "Customer Obsessed",
      description: "Every decision we make is driven by our commitment to delivering exceptional customer experiences."
    },
    {
      icon: Building,
      title: "Reliability",
      description: "We build enterprise-grade solutions that businesses can depend on 24/7."
    },
    {
      icon: Users,
      title: "Inclusive Growth",
      description: "We believe in creating solutions that help businesses of all sizes succeed."
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
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            {language === 'de' ? '🚀 Unsere Geschichte' : '🚀 Our Story'}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {language === 'de' ? 'Unternehmen transformieren' : 'Transforming Business'}
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Eine Warteschlange nach der anderen' : 'One Queue at a Time'}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {language === 'de' 
              ? 'QueueUp Pro wurde 2023 aus einer einfachen Beobachtung heraus gegründet: Das Warten in der Schlange sollte weder für Kunden frustrierend noch für Unternehmen stressig sein.'
              : 'Founded in 2023, QueueUp Pro was born from a simple observation: waiting in line shouldn\'t be a source of frustration for customers or stress for businesses.'
            }
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-purple-100 shadow-xl">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl text-gray-900 mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-xl text-gray-700 leading-relaxed">
                We believe that every customer interaction is an opportunity to create a positive experience. 
                Our mission is to eliminate waiting frustration and empower businesses to deliver exceptional service 
                through intelligent queue management technology.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From small local barbershops to large medical clinics, we're committed to providing tools 
                that help businesses operate more efficiently while keeping their customers happy and engaged.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-purple-100 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Built by Experts</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our team combines decades of experience in software development, 
            customer experience design, and business operations to create solutions that truly work.
          </p>
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white">
            <blockquote className="text-xl italic mb-4">
              "We don't just build software – we solve real problems that businesses face every day. 
              Every feature we develop is tested in real-world scenarios to ensure it delivers genuine value."
            </blockquote>
            <div className="text-lg font-semibold">QueueUp Pro Development Team</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Our Journey
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Become part of the queue management revolution
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/register")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Start Your Free Trial
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
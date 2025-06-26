import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  ArrowLeft,
  Server,
  Database,
  Cloud,
  Shield,
  Zap,
  Globe
} from "lucide-react";

export default function StatusPage() {
  const [, setLocation] = useLocation();

  const services = [
    {
      name: "API Services",
      status: "operational",
      uptime: "99.98%",
      icon: Server,
      description: "REST API and WebSocket connections"
    },
    {
      name: "Database",
      status: "operational", 
      uptime: "99.99%",
      icon: Database,
      description: "PostgreSQL database cluster"
    },
    {
      name: "CDN & Assets",
      status: "operational",
      uptime: "99.95%",
      icon: Cloud,
      description: "Global content delivery network"
    },
    {
      name: "Authentication",
      status: "operational",
      uptime: "99.97%",
      icon: Shield,
      description: "User authentication and authorization"
    },
    {
      name: "Real-time Updates",
      status: "operational",
      uptime: "99.96%",
      icon: Zap,
      description: "WebSocket connections for live updates"
    },
    {
      name: "Global Infrastructure",
      status: "operational",
      uptime: "99.94%",
      icon: Globe,
      description: "Multi-region deployment"
    }
  ];

  const incidents = [
    {
      date: "2025-06-20",
      title: "Brief API latency increase",
      status: "resolved",
      description: "Increased response times for 15 minutes due to database optimization. All services fully restored.",
      duration: "15 minutes"
    },
    {
      date: "2025-06-15", 
      title: "Scheduled maintenance",
      status: "completed",
      description: "Planned infrastructure upgrade completed successfully with zero downtime.",
      duration: "0 minutes downtime"
    },
    {
      date: "2025-06-10",
      title: "WebSocket connection issues",
      status: "resolved", 
      description: "Some users experienced delayed real-time updates. Issue resolved with connection pool optimization.",
      duration: "23 minutes"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "text-green-600 bg-green-100";
      case "degraded": return "text-yellow-600 bg-yellow-100"; 
      case "outage": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return CheckCircle;
      case "degraded": return AlertTriangle;
      case "outage": return XCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                System Status
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
          <Badge className="mb-6 bg-green-100 text-green-600 hover:bg-green-100">
            ✅ All Systems Operational
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            System Status &
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Uptime Monitor
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Real-time status of QueueUp Pro services and infrastructure. 
            Subscribe to updates to stay informed about any service issues.
          </p>
        </div>
      </section>

      {/* Overall Status */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">All Systems Operational</CardTitle>
              <p className="text-green-700">All QueueUp Pro services are running normally</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl font-bold text-green-600">99.97%</div>
                  <div className="text-sm text-green-700">30-day uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">45ms</div>
                  <div className="text-sm text-green-700">Avg response time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">6</div>
                  <div className="text-sm text-green-700">Global regions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-sm text-green-700">Active incidents</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Status</h2>
            <p className="text-xl text-gray-600">Individual component status and uptime</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              return (
                <Card key={index} className="border-purple-100">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">30-day uptime</span>
                      <span className="font-semibold text-green-600">{service.uptime}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Incidents</h2>
            <p className="text-xl text-gray-600">Past 30 days incident history</p>
          </div>
          
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {incident.date}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {incident.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{incident.title}</h3>
                      <p className="text-gray-600 mb-2">{incident.description}</p>
                      <div className="text-sm text-gray-500">
                        Duration: {incident.duration}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Informed
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get notified about service updates and maintenance windows
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            Subscribe to Updates
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro Status</span>
          </div>
          <p className="text-gray-400">
            Last updated: June 25, 2025 at 4:23 PM UTC
          </p>
        </div>
      </footer>
    </div>
  );
}
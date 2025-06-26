import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Code, 
  Key, 
  Shield,
  ArrowLeft,
  ArrowRight,
  Terminal,
  Book,
  Zap
} from "lucide-react";

export default function APIPage() {
  const [, setLocation] = useLocation();

  const endpoints = [
    {
      method: "GET",
      path: "/api/stores",
      description: "Retrieve all stores for authenticated user",
      auth: true
    },
    {
      method: "POST",
      path: "/api/stores",
      description: "Create a new store",
      auth: true
    },
    {
      method: "GET",
      path: "/api/stores/{storeId}/queue",
      description: "Get current queue for a store",
      auth: false
    },
    {
      method: "POST",
      path: "/api/queue",
      description: "Add customer to queue",
      auth: false
    },
    {
      method: "PUT",
      path: "/api/queue/{queueId}",
      description: "Update queue entry status",
      auth: true
    },
    {
      method: "GET",
      path: "/api/stores/{storeId}/staff",
      description: "Get all staff members for a store",
      auth: true
    },
    {
      method: "POST",
      path: "/api/stores/{storeId}/staff",
      description: "Add new staff member",
      auth: true
    },
    {
      method: "GET",
      path: "/api/stores/{storeId}/stats",
      description: "Get queue statistics and analytics",
      auth: true
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "WebSocket support for live queue updates and notifications"
    },
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "API key-based authentication with rate limiting and CORS support"
    },
    {
      icon: Book,
      title: "Comprehensive Documentation",
      description: "Complete API documentation with examples and SDKs"
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
                QueueUp Pro API
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
                Get API Access
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-6 bg-purple-100 text-purple-600 hover:bg-purple-100">
            🔧 Developer Resources
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            QueueUp Pro
            <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              REST API
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Integrate queue management into your existing applications with our powerful REST API. 
            Build custom solutions, connect with third-party systems, and automate your workflow.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
            <p className="text-xl text-gray-600">Get started with the QueueUp Pro API in minutes</p>
          </div>
          
          <Card className="border-purple-100">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Terminal className="w-5 h-5 mr-2 text-purple-600" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                All API requests require authentication using your API key in the Authorization header:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                curl -H "Authorization: Bearer YOUR_API_KEY" \<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;https://api.queueuppro.com/api/stores
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Key className="w-4 h-4" />
                <span>Get your API key from the Professional plan dashboard</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Endpoints</h2>
            <p className="text-xl text-gray-600">Complete list of available endpoints</p>
          </div>
          
          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : endpoint.method === 'POST' ? 'secondary' : 'destructive'}
                        className="font-mono"
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-gray-800 font-mono">{endpoint.path}</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      {endpoint.auth && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="w-3 h-3 mr-1" />
                          Auth Required
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-3">{endpoint.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Features</h2>
            <p className="text-xl text-gray-600">Everything you need to build powerful integrations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-purple-100 text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Code Examples</h2>
            <p className="text-xl text-gray-600">Get started with these examples</p>
          </div>
          
          <div className="space-y-8">
            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle>Get Queue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="text-gray-500">// JavaScript Example</div>
                  <div>const response = await fetch('https://api.queueuppro.com/api/stores/store-id/queue');</div>
                  <div>const queueData = await response.json();</div>
                  <div>console.log(`Current queue length: $&#123;queueData.length&#125;`);</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle>Add Customer to Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="text-gray-500"># Python Example</div>
                  <div>import requests</div>
                  <div></div>
                  <div>data = &#123;'storeId': 'store-id', 'customerName': 'John Doe', 'position': 1&#125;</div>
                  <div>response = requests.post('https://api.queueuppro.com/api/queue', json=data)</div>
                  <div>print(f"Queue entry created: &#123;response.json()['id']&#125;")</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get API access with our Professional plan
          </p>
          <Button 
            size="lg"
            onClick={() => setLocation("/pricing")}
            className="bg-white text-purple-600 hover:bg-gray-50 px-8 py-6 text-lg"
          >
            View Pricing Plans
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">QueueUp Pro API</span>
          </div>
          <p className="text-gray-400">
            © 2025 QueueUp Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRealTimeQueue } from "@/hooks/useRealTimeQueue";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Plus, UserCheck, Clock, Scissors, Star } from "lucide-react";
import type { Store, Staff } from "@shared/schema";

export default function KioskDisplayPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string>("any");
  const [customerName, setCustomerName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data: store, isLoading: storeLoading } = useQuery<Store>({
    queryKey: [`/api/stores/${slug}`],
    enabled: !!slug
  });

  const { data: staff = [], isLoading: staffLoading } = useQuery<Staff[]>({
    queryKey: [`/api/stores/${store?.id}/staff`],
    enabled: !!store?.id
  });

  const { queue, isLoading: queueLoading } = useRealTimeQueue(store?.id);

  const joinQueueMutation = useMutation({
    mutationFn: async (data: {
      storeId: string;
      staffId?: string;
      customerName?: string;
    }) => {
      const response = await apiRequest("POST", "/api/queue", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Welcome!", description: "You've been added to the queue." });
      setCustomerName("");
      setSelectedStaff("any");
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${store?.id}/queue`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not join the queue. Please try again.", variant: "destructive" });
    }
  });

  const handleKioskJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    joinQueueMutation.mutate({
      storeId: store.id,
      staffId: selectedStaff === "any" ? undefined : selectedStaff,
      customerName: customerName || undefined
    });
  };

  const currentCustomer = queue?.[0];
  const upcomingCustomers = queue?.slice(1, 3) || [];

  if (storeLoading || staffLoading || queueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading kiosk display...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Store Not Found</h1>
            <p className="text-gray-600">The store you're looking for doesn't exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex flex-col overflow-hidden">
      {/* Professional Kiosk Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Scissors className="w-10 h-10 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{store.name}</h1>
                <p className="text-xl text-white/90 font-medium">Welcome • Please take a number</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white mb-2 font-mono tracking-wider">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-lg text-white/90 font-medium">
                {currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex p-8 gap-8">
        {/* Left Side - Queue Status Display */}
        <div className="flex-1 space-y-8">
          {/* Now Serving - Large Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <UserCheck className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Now Serving</h2>
              <div className="text-8xl font-bold text-white mb-4 font-mono tracking-wider">
                {currentCustomer?.customerName || "---"}
              </div>
              {currentCustomer && (
                <p className="text-xl text-white/90 font-medium">
                  with {staff.find(s => s.id === currentCustomer.staffId)?.name || "Staff Member"}
                </p>
              )}
            </div>
          </div>

          {/* Next in Line */}
          <Card className="card-elevated p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Next in Line</h3>
            {upcomingCustomers.length > 0 ? (
              <div className="space-y-4">
                {upcomingCustomers.map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 text-white rounded-full flex items-center justify-center text-lg font-bold ${
                        index === 0 ? "bg-primary" : "bg-orange-500"
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-gray-900">
                          {customer.customerName || "Anonymous"}
                        </p>
                        <p className="text-gray-600">
                          with {staff.find(s => s.id === customer.staffId)?.name || "First Available"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500">Est. wait</p>
                      <p className="text-lg font-semibold text-gray-900">{(index + 1) * 20} min</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                <p className="text-lg">No one waiting</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Side - Join Queue */}
        <div className="w-96 p-8">
          <Card className="card-elevated p-8 h-full flex flex-col">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Join the Queue</h2>
              <p className="text-gray-600">Walk-in customers can join here</p>
            </div>

            <form onSubmit={handleKioskJoin} className="flex-1 flex flex-col space-y-6">
              {/* Staff Selection */}
              <div>
                <Label className="block text-lg font-medium text-gray-900 mb-4">Choose Your Staff Member</Label>
                <div className="space-y-3">
                  {staff.filter(member => member.status === "available").map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      className={`w-full p-4 border-2 rounded-2xl transition-all text-left ${
                        selectedStaff === member.id
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 hover:border-primary"
                      }`}
                      onClick={() => setSelectedStaff(member.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={member.photoUrl || ""} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-sm text-accent">Available</p>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    className={`w-full p-4 border-2 rounded-2xl transition-all text-left ${
                      selectedStaff === "any"
                        ? "border-primary bg-primary/10"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    onClick={() => setSelectedStaff("any")}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Star className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-primary">First Available</p>
                        <p className="text-sm text-primary">Fastest service</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <Label htmlFor="kiosk-name" className="block text-lg font-medium text-gray-900 mb-3">
                  Your Name (Optional)
                </Label>
                <Input
                  id="kiosk-name"
                  type="text"
                  placeholder="Enter your name"
                  className="input-field text-lg py-4"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              {/* Join Button */}
              <Button 
                type="submit" 
                className="w-full btn-accent py-6 text-xl"
                disabled={joinQueueMutation.isPending}
              >
                <Plus className="w-6 h-6 mr-3" />
                {joinQueueMutation.isPending ? "Joining..." : "Join Queue Now"}
              </Button>
            </form>

            {/* QR Code for Mobile */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-3">Or scan to join on your phone</p>
              <div className="flex justify-center">
                <QRCodeGenerator 
                  value={`${window.location.origin}/store/${slug}`}
                  size={80}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white/10 backdrop-blur-sm p-4 text-center">
        <p className="text-white/80 text-sm">Powered by QueueUp Pro • Real-time queue management</p>
      </div>
    </div>
  );
}

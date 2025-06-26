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
import { ArrowRight, UserCheck, Clock, Scissors, Star, Maximize, Minimize } from "lucide-react";
import type { Store, Staff } from "@shared/schema";

export default function KioskDisplayPage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string>("any");
  const [customerName, setCustomerName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Fullscreen functionality
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        exitFullscreen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
              <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center shadow-2xl border border-white/30 overflow-hidden">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  <div className="text-center">
                    <div className="animate-pulse text-3xl font-bold text-white tracking-wider">
                      {store.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
                  {store.logoUrl ? store.name : (
                    <span className="animate-fade-in-up">{store.name}</span>
                  )}
                </h1>
                <p className="text-xl text-white/90 font-medium">Welcome • Please take a number</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              {!isFullscreen && (
                <Button
                  onClick={enterFullscreen}
                  className="bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/50 px-6 py-3 rounded-2xl transition-all"
                >
                  <Maximize className="w-6 h-6 text-white mr-2" />
                  <span className="text-white font-medium">Fullscreen</span>
                </Button>
              )}
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
      </div>

      {/* Main Content - Redesigned Kiosk Layout */}
      <div className="flex-1 flex gap-8 p-8">
        {/* Left Side - Queue Status (Compact) */}
        <div className="w-80 space-y-6">
          {/* Now Serving - Compact Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <UserCheck className="w-8 h-8 text-white animate-heartbeat" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Now Serving</h2>
              <div className="text-4xl font-bold text-white mb-2 font-mono tracking-wider">
                {currentCustomer?.customerName || "---"}
              </div>
              {currentCustomer && (
                <p className="text-sm text-white/90 font-medium">
                  with {staff.find(s => s.id === currentCustomer.staffId)?.name || "Staff Member"}
                </p>
              )}
            </div>
          </div>

          {/* Next in Line - Compact Display */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Next in Line</h3>
            {upcomingCustomers.length > 0 ? (
              <div className="space-y-3">
                {upcomingCustomers.slice(0, 5).map((customer, index) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg ${
                        index === 0 ? "bg-gradient-to-br from-orange-400 to-red-500" : "bg-gradient-to-br from-purple-400 to-pink-500"
                      }`}>
                        {index + 2}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {customer.customerName || "Anonymous"}
                        </p>
                        <p className="text-xs text-white/80">
                          {staff.find(s => s.id === customer.staffId)?.name || "First Available"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">{(index + 2) * 20}m</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-white/60">
                <Clock className="w-8 h-8 mx-auto mb-2 text-white/40" />
                <p className="text-sm">No one waiting</p>
              </div>
            )}
          </div>
        </div>

        {/* Center/Right - Prominent Join Queue Section */}
        <div className="flex-1">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/30 shadow-2xl h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 p-8 text-center border-b border-white/20">
              <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <ArrowRight className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">Join the Queue</h2>
              <p className="text-white/90 text-lg">Touch to get started</p>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center">
              <form onSubmit={handleKioskJoin} className="space-y-8">
                {/* Staff Selection - Large Touch Targets */}
                <div>
                  <Label className="block text-2xl font-bold text-white mb-6 text-center">Choose Your Staff Member</Label>
                  <div className="grid grid-cols-1 gap-4">
                    {/* First Available Option - Prominent */}
                    <button
                      type="button"
                      className={`w-full p-6 border-3 rounded-3xl transition-all text-left transform hover:scale-[1.02] ${
                        selectedStaff === "any"
                          ? "border-white bg-white/20 shadow-2xl scale-[1.02]"
                          : "border-white/40 hover:border-white/60 bg-white/10"
                      }`}
                      onClick={() => setSelectedStaff("any")}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white">First Available</p>
                          <p className="text-white/80 text-lg">Fastest service • No preference</p>
                        </div>
                      </div>
                    </button>

                    {/* Individual Staff Members */}
                    {staff.filter(member => member.status === "available").map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        className={`w-full p-6 border-3 rounded-3xl transition-all text-left transform hover:scale-[1.02] ${
                          selectedStaff === member.id
                            ? "border-white bg-white/20 shadow-2xl scale-[1.02]"
                            : "border-white/40 hover:border-white/60 bg-white/10"
                        }`}
                        onClick={() => setSelectedStaff(member.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 border-2 border-white/30">
                            <AvatarImage src={member.photoUrl || ""} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-xl font-bold text-white">{member.name}</p>
                            <p className="text-white/80 text-lg">Available now</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name Input - Large */}
                <div>
                  <Label htmlFor="kiosk-name" className="block text-2xl font-bold text-white mb-4 text-center">
                    Your Name
                  </Label>
                  <Input
                    id="kiosk-name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full px-6 py-6 text-2xl text-center rounded-2xl border-2 border-white/40 bg-white/10 text-white placeholder-white/60 focus:border-white focus:ring-2 focus:ring-white/30 transition-all"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                {/* Join Button - Very Prominent */}
                <Button 
                  type="submit" 
                  className="w-full py-8 text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={joinQueueMutation.isPending || !selectedStaff}
                >
                  <ArrowRight className="w-8 h-8 mr-4" />
                  {joinQueueMutation.isPending ? "Joining..." : "Join Queue Now"}
                </Button>
              </form>

              {/* QR Code Section */}
              <div className="mt-8 pt-6 border-t border-white/20 text-center">
                <p className="text-white/80 mb-6 text-xl font-medium">Or scan with your phone</p>
                <div className="flex justify-center">
                  <div className="bg-white/20 p-6 rounded-3xl shadow-2xl border border-white/30 animate-glow">
                    <QRCodeGenerator 
                      value={`${window.location.origin}/store/${slug}`}
                      size={180}
                    />
                  </div>
                </div>
                <p className="text-white/60 mt-4 text-sm">Point your camera at the QR code to join</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRealTimeQueue } from "@/hooks/useRealTimeQueue";
import { Clock, Users, UserCheck, Scissors, Star } from "lucide-react";
import type { Store, Staff, Queue } from "@shared/schema";

export default function CustomerQueuePage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", contact: "" });

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
      contactInfo?: string;
    }) => {
      const response = await apiRequest("POST", "/api/queue", data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Joined queue!", description: "You've been added to the queue successfully." });
      setCustomerForm({ name: "", contact: "" });
      setSelectedStaff(null);
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${store?.id}/queue`] });
    },
    onError: () => {
      toast({ title: "Failed to join", description: "Could not join the queue. Please try again.", variant: "destructive" });
    }
  });

  const handleJoinQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    joinQueueMutation.mutate({
      storeId: store.id,
      staffId: selectedStaff === "any" ? undefined : selectedStaff || undefined,
      customerName: customerForm.name || undefined,
      contactInfo: customerForm.contact || undefined
    });
  };

  const currentCustomer = queue?.[0];
  const waitingCount = queue?.length || 0;
  const estimatedWait = waitingCount * 20; // 20 minutes per person

  if (storeLoading || staffLoading || queueLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store information...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Store Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center">
              {store.logoUrl ? (
                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Scissors className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
              <p className="text-gray-600">{store.description}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                <span>
                  {store.workingHours ? 
                    `${store.workingHours.openTime} - ${store.workingHours.closeTime}` : 
                    "Hours not set"
                  }
                </span>
                <span className="mx-2">•</span>
                <Badge variant="secondary" className="bg-accent text-accent-foreground">
                  Currently Open
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Queue Status */}
        <Card className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Queue Status</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse-dot"></div>
              <span className="text-sm text-gray-600">Live Updates</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-xl">
              <UserCheck className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Now Serving</h3>
              <p className="text-lg font-semibold text-primary">
                {currentCustomer?.customerName || "No one"}
              </p>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">People Waiting</h3>
              <p className="text-lg font-semibold text-orange-600">{waitingCount}</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Est. Wait Time</h3>
              <p className="text-lg font-semibold text-purple-600">{estimatedWait} min</p>
            </div>
          </div>
        </Card>

        {/* Staff Selection */}
        <Card className="card-elevated p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Staff Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staff.map((member) => (
              <div
                key={member.id}
                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedStaff === member.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary"
                }`}
                onClick={() => setSelectedStaff(member.id)}
              >
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={member.photoUrl || ""} alt={member.name} />
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h4 className="text-center font-medium text-gray-900">{member.name}</h4>
                <p className="text-center text-sm text-gray-600">{member.title}</p>
                <div className="flex items-center justify-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    member.status === "available" ? "bg-accent" : "bg-gray-400"
                  }`}></div>
                  <span className={`text-xs font-medium ${
                    member.status === "available" ? "text-accent" : "text-gray-400"
                  }`}>
                    {member.status === "available" ? "Available" : "Busy"}
                  </span>
                </div>
              </div>
            ))}
            
            <div
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedStaff === "any"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary"
              }`}
              onClick={() => setSelectedStaff("any")}
            >
              <div className="w-16 h-16 rounded-full mx-auto mb-3 bg-gray-200 flex items-center justify-center">
                <Star className="w-8 h-8 text-gray-500" />
              </div>
              <h4 className="text-center font-medium text-primary">First Available</h4>
              <p className="text-center text-sm text-gray-600">Any staff member</p>
              <div className="flex items-center justify-center mt-2">
                <div className="w-2 h-2 bg-accent rounded-full mr-1"></div>
                <span className="text-xs text-accent font-medium">Recommended</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Current Queue */}
        <Card className="card-elevated p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Queue</h3>
          {queue && queue.length > 0 ? (
            <div className="space-y-3">
              {queue.map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-medium ${
                      index === 0 ? "bg-primary" :
                      index === 1 ? "bg-orange-500" :
                      index === 2 ? "bg-purple-500" : "bg-gray-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {customer.customerName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600">
                        with {staff.find(s => s.id === customer.staffId)?.name || "First Available"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">~{(index + 1) * 20} min</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No one in queue</p>
            </div>
          )}
        </Card>

        {/* Join Queue Form */}
        <Card className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Join the Queue</h3>
          <form onSubmit={handleJoinQueue} className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Your Name</Label>
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter your name"
                className="input-field"
                value={customerForm.name}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="customer-contact">Contact (Optional)</Label>
              <Input
                id="customer-contact"
                type="text"
                placeholder="Phone or email for notifications"
                className="input-field"
                value={customerForm.contact}
                onChange={(e) => setCustomerForm(prev => ({ ...prev, contact: e.target.value }))}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full btn-accent py-4"
              disabled={joinQueueMutation.isPending || !selectedStaff}
            >
              {joinQueueMutation.isPending ? "Joining..." : "Join Queue"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

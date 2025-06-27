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
import { getTranslation } from "@/lib/i18n";
import { Clock, Users, UserCheck, Scissors, Star } from "lucide-react";
import type { Store, Staff, Queue } from "@shared/schema";

export default function CustomerQueuePage() {
  const { slug } = useParams();
  const { toast } = useToast();
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [customerForm, setCustomerForm] = useState({ name: "", contact: "" });

  // Helper function to get translations based on store language
  const t = (key: string) => {
    if (!store?.language) return key;
    return getTranslation(store.language as 'en' | 'de', key);
  };

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
      position: number;
    }) => {
      const response = await apiRequest("POST", `/api/stores/${data.storeId}/queue`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Joined queue!", description: "You've been added to the queue successfully." });
      setCustomerForm({ name: "", contact: "" });
      setSelectedStaff(null);
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${store?.id}/queue`] });
    },
    onError: (error: any) => {
      console.error("Queue join error:", error);
      toast({ 
        title: "Join failed", 
        description: "Please try again or contact staff for assistance.", 
        variant: "destructive" 
      });
    }
  });

  const handleJoinQueue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!store) return;

    const position = queue?.filter(entry => entry.status === 'waiting').length + 1 || 1;

    joinQueueMutation.mutate({
      storeId: store.id,
      staffId: selectedStaff === "any" ? undefined : selectedStaff || undefined,
      customerName: customerForm.name || undefined,
      contactInfo: customerForm.contact || undefined,
      position
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile-Optimized Header */}
      <div className="bg-white/90 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {store.logoUrl ? (
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg bg-white border-2 border-white/50">
                  <img src={store.logoUrl} alt={store.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30">
                  <div className="text-center">
                    <div className="animate-pulse text-xl font-bold text-white tracking-wider">
                      {store.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </div>
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  {store.logoUrl ? store.name : (
                    <span className="animate-fade-in-up">{store.name}</span>
                  )}
                </h1>
                <p className="text-sm text-gray-600 font-medium">{t('queue.join_queue')}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-slate-800">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {store?.language === 'de' 
                  ? new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'short' })
                  : new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Live Queue Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Now Serving Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <UserCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">{store?.language === 'de' ? 'Jetzt bedient' : 'Now Serving'}</h3>
              <p className="text-2xl font-bold text-blue-600 leading-tight">
                {currentCustomer?.customerName || (
                  <span className="text-blue-400">{store?.language === 'de' ? 'Niemand' : 'No one'}</span>
                )}
              </p>
            </div>
          </div>

          {/* Next in Line Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">{store?.language === 'de' ? 'Als Nächstes' : 'Next in Line'}</h3>
              <p className="text-2xl font-bold text-gray-600 leading-tight">
                {queue?.[1]?.customerName || (
                  <span className="text-gray-400">{store?.language === 'de' ? 'Niemand wartet' : 'No one waiting'}</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Join Queue Section */}
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl border border-white/30">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-blue-600 animate-pulse">+</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">{t('queue.join_queue')}</h2>
              <p className="text-blue-100 text-lg font-medium">{store?.language === 'de' ? 'Touch-freundliche Erfahrung für Laufkundschaft' : 'Touch-friendly experience for walk-in customers'}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Staff Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{store?.language === 'de' ? 'Wählen Sie Ihren Mitarbeiter' : 'Choose Your Staff Member'}</h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedStaff("any")}
                  className={`w-full p-4 rounded-2xl border-2 transition-all transform ${
                    selectedStaff === "any"
                      ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                      <Star className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <h4 className="font-bold text-gray-900 text-base">{store?.language === 'de' ? 'Erster Verfügbarer' : 'First Available'}</h4>
                      <p className="text-sm text-green-600 font-medium">{store?.language === 'de' ? 'Schnellster Service' : 'Fastest service'}</p>
                    </div>
                  </div>
                </button>
                
                {staff.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setSelectedStaff(member.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all transform ${
                      selectedStaff === member.id
                        ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="w-14 h-14 border-2 border-white shadow-md">
                          <AvatarImage src={member.photoUrl} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          member.status === "available" ? "bg-green-500" : "bg-gray-400"
                        }`}></div>
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="font-bold text-gray-900 text-base">{member.name}</h4>
                        <p className={`text-sm font-medium ${
                          member.status === "available" ? "text-green-600" : "text-gray-500"
                        }`}>
                          {member.status === "available" ? (store?.language === 'de' ? 'Verfügbar' : 'Available') : (store?.language === 'de' ? 'Beschäftigt' : 'Busy')}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information Form */}
            <form onSubmit={handleJoinQueue} className="space-y-4">
              <div>
                <Label htmlFor="customer-name" className="text-base font-semibold text-gray-800 mb-2 block">
                  {store?.language === 'de' ? 'Ihr Name' : 'Your Name'}
                </Label>
                <Input
                  id="customer-name"
                  type="text"
                  placeholder={store?.language === 'de' ? 'Geben Sie Ihren Namen ein' : 'Enter your name'}
                  className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-blue-500 bg-gray-50/50 transition-all"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Join Button */}
              <Button 
                type="submit" 
                className={`w-full h-16 text-xl font-bold rounded-2xl shadow-lg transition-all transform ${
                  selectedStaff && !joinQueueMutation.isPending
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:scale-[1.02] shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                disabled={joinQueueMutation.isPending || !selectedStaff}
              >
                {joinQueueMutation.isPending ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{store?.language === 'de' ? 'Trete der Warteschlange bei...' : 'Joining Queue...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">+</span>
                    <span>{store?.language === 'de' ? 'Jetzt zur Warteschlange hinzufügen' : 'Join Queue Now'}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Queue Statistics */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">{store?.language === 'de' ? 'Personen in der Warteschlange:' : 'People in queue:'}</span>
                <span className="text-xl font-bold text-gray-800">{waitingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">{store?.language === 'de' ? 'Geschätzte Wartezeit:' : 'Estimated wait:'}</span>
                <span className="text-xl font-bold text-orange-600">{estimatedWait} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Queue Preview */}
        {queue && queue.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{store?.language === 'de' ? 'Warteschlangen-Vorschau' : 'Queue Preview'}</h3>
            <div className="space-y-3">
              {queue.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                      index === 0 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                      index === 1 ? "bg-gradient-to-r from-orange-500 to-red-500" :
                      "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-base">
                        {customer.customerName || (store?.language === 'de' ? 'Anonym' : 'Anonymous')}
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {store?.language === 'de' ? 'mit' : 'with'} {staff.find(s => s.id === customer.staffId)?.name || (store?.language === 'de' ? 'Erster Verfügbarer' : 'First Available')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-orange-600">~{(index + 1) * 20} min</div>
                    <div className="text-xs text-gray-500">{store?.language === 'de' ? 'Wartezeit' : 'wait time'}</div>
                  </div>
                </div>
              ))}
              {queue.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-sm text-gray-500 font-medium">
                    +{queue.length - 5} {store?.language === 'de' ? 'weitere in der Warteschlange' : 'more in queue'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

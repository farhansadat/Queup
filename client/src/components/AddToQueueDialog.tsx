import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, UserPlus } from "lucide-react";
import type { Staff } from "@shared/schema";

interface AddToQueueDialogProps {
  storeId: string;
  staff: Staff[];
}

export function AddToQueueDialog({ storeId, staff }: AddToQueueDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: "",
    contact: "",
    staffId: ""
  });
  const { toast } = useToast();

  const addToQueueMutation = useMutation({
    mutationFn: async (data: { storeId: string; customerName: string; contactInfo?: string; staffId?: string }) => {
      const response = await apiRequest("POST", "/api/queue", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Customer added to queue",
        description: "Customer has been successfully added to the queue."
      });
      setIsOpen(false);
      setCustomerData({ name: "", contact: "", staffId: "" });
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/queue`] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add customer to queue. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.name.trim()) return;

    addToQueueMutation.mutate({
      storeId,
      customerName: customerData.name,
      contactInfo: customerData.contact || undefined,
      staffId: customerData.staffId === "any" ? undefined : customerData.staffId || undefined
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add to Queue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add Customer to Queue
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customer-name">Customer Name *</Label>
            <Input
              id="customer-name"
              type="text"
              placeholder="Enter customer name"
              value={customerData.name}
              onChange={(e) => setCustomerData(prev => ({ ...prev, name: e.target.value }))}
              className="input-field"
              required
            />
          </div>

          <div>
            <Label htmlFor="customer-contact">Contact Info (Optional)</Label>
            <Input
              id="customer-contact"
              type="text"
              placeholder="Phone or email"
              value={customerData.contact}
              onChange={(e) => setCustomerData(prev => ({ ...prev, contact: e.target.value }))}
              className="input-field"
            />
          </div>

          <div>
            <Label htmlFor="staff-selection">Preferred Staff Member</Label>
            <Select value={customerData.staffId} onValueChange={(value) => setCustomerData(prev => ({ ...prev, staffId: value }))}>
              <SelectTrigger className="input-field">
                <SelectValue placeholder="Any available staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any available staff</SelectItem>
                {staff.filter(s => s.status === "available").map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name} - {member.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addToQueueMutation.isPending || !customerData.name.trim()}
              className="flex-1 btn-accent"
            >
              {addToQueueMutation.isPending ? "Adding..." : "Add to Queue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
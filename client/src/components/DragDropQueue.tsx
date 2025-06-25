import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useRealTimeQueue } from "@/hooks/useRealTimeQueue";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Check, X, RefreshCw, Trash2 } from "lucide-react";
import type { Queue, Staff } from "@shared/schema";

interface DragDropQueueProps {
  storeId: string;
}

interface SortableItemProps {
  id: string;
  customer: Queue;
  index: number;
  staff: Staff[];
  onServe: (id: string) => void;
  onCancel: (id: string) => void;
}

function SortableItem({ id, customer, index, staff, onServe, onCancel }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const staffMember = staff.find(s => s.id === customer.staffId);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors ${
        isDragging ? "opacity-50 transform rotate-2" : ""
      }`}
    >
      <div className="flex items-center space-x-4">
        <div
          className="cursor-move text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </div>
        <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center font-medium ${
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
            with {staffMember?.name || "First Available"} • 
            Joined: {new Date(customer.joinedAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          size="sm"
          className="btn-accent"
          onClick={() => onServe(customer.id)}
        >
          <Check className="w-4 h-4 mr-1" />
          Served
        </Button>
        <Button
          size="sm"
          className="btn-danger"
          onClick={() => onCancel(customer.id)}
        >
          <X className="w-4 h-4 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
}

export function DragDropQueue({ storeId }: DragDropQueueProps) {
  const { toast } = useToast();
  const { queue, isLoading } = useRealTimeQueue(storeId);
  const [items, setItems] = useState<Queue[]>([]);

  const { data: staff = [] } = useQuery<Staff[]>({
    queryKey: [`/api/stores/${storeId}/staff`],
    enabled: !!storeId
  });

  // Update local items when queue changes
  useEffect(() => {
    if (queue) {
      setItems(queue);
    }
  }, [queue]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateQueueMutation = useMutation({
    mutationFn: async (data: { action: string; entryId?: string; newOrder?: { id: string; position: number }[] }) => {
      const response = await apiRequest("PUT", `/api/queue/${storeId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/queue`] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update queue.", variant: "destructive" });
    }
  });

  const refreshQueueMutation = useMutation({
    mutationFn: async () => {
      queryClient.invalidateQueries({ queryKey: [`/api/stores/${storeId}/queue`] });
    },
    onSuccess: () => {
      toast({ title: "Refreshed", description: "Queue has been refreshed." });
    }
  });

  const clearQueueMutation = useMutation({
    mutationFn: async () => {
      // Mark all entries as canceled
      const promises = items.map(item => 
        updateQueueMutation.mutateAsync({ action: "cancel", entryId: item.id })
      );
      await Promise.all(promises);
    },
    onSuccess: () => {
      toast({ title: "Queue cleared", description: "All customers have been removed from the queue." });
    }
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Create reorder data
      const newOrder = newItems.map((item, index) => ({
        id: item.id,
        position: index + 1
      }));

      updateQueueMutation.mutate({ action: "reorder", newOrder });
    }
  }

  const handleServe = (entryId: string) => {
    updateQueueMutation.mutate({ action: "serve", entryId });
    toast({ title: "Customer served", description: "Customer has been marked as served." });
  };

  const handleCancel = (entryId: string) => {
    updateQueueMutation.mutate({ action: "cancel", entryId });
    toast({ title: "Customer canceled", description: "Customer has been removed from the queue." });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading queue...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Current Queue ({items.length} customers)
          </CardTitle>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refreshQueueMutation.mutate()}
              disabled={refreshQueueMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshQueueMutation.isPending ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => clearQueueMutation.mutate()}
              disabled={clearQueueMutation.isPending || items.length === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {items.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((customer, index) => (
                  <SortableItem
                    key={customer.id}
                    id={customer.id}
                    customer={customer}
                    index={index}
                    staff={staff}
                    onServe={handleServe}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GripVertical className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-medium">No customers in queue</p>
            <p className="text-sm">Customers will appear here when they join</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

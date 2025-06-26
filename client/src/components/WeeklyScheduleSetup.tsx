import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, CheckCircle } from "lucide-react";

interface WeeklySchedule {
  monday: { open: string; close: string; isOpen: boolean };
  tuesday: { open: string; close: string; isOpen: boolean };
  wednesday: { open: string; close: string; isOpen: boolean };
  thursday: { open: string; close: string; isOpen: boolean };
  friday: { open: string; close: string; isOpen: boolean };
  saturday: { open: string; close: string; isOpen: boolean };
  sunday: { open: string; close: string; isOpen: boolean };
}

interface WeeklyScheduleSetupProps {
  onScheduleChange: (schedule: WeeklySchedule) => void;
  initialSchedule?: Partial<WeeklySchedule>;
}

export function WeeklyScheduleSetup({ onScheduleChange, initialSchedule }: WeeklyScheduleSetupProps) {
  const [schedule, setSchedule] = useState<WeeklySchedule>({
    monday: { open: "09:00", close: "17:00", isOpen: true },
    tuesday: { open: "09:00", close: "17:00", isOpen: true },
    wednesday: { open: "09:00", close: "17:00", isOpen: true },
    thursday: { open: "09:00", close: "17:00", isOpen: true },
    friday: { open: "09:00", close: "17:00", isOpen: true },
    saturday: { open: "10:00", close: "16:00", isOpen: true },
    sunday: { open: "10:00", close: "16:00", isOpen: false },
    ...initialSchedule
  });

  const days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  const updateDaySchedule = (
    day: keyof WeeklySchedule,
    field: 'open' | 'close' | 'isOpen',
    value: string | boolean
  ) => {
    const newSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [field]: value
      }
    };
    setSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };

  const copyToAllDays = (sourceDay: keyof WeeklySchedule) => {
    const sourceSchedule = schedule[sourceDay];
    const newSchedule = { ...schedule };
    
    Object.keys(newSchedule).forEach((day) => {
      if (day !== sourceDay) {
        newSchedule[day as keyof WeeklySchedule] = {
          ...sourceSchedule
        };
      }
    });
    
    setSchedule(newSchedule);
    onScheduleChange(newSchedule);
  };

  return (
    <div className="w-full bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-xl border border-white border-opacity-20 p-6">
      <div className="mb-6">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-2">
          <Calendar className="w-5 h-5 text-purple-300" />
          Weekly Operating Hours
        </h3>
        <p className="text-sm text-white text-opacity-80">
          Set your business hours for each day of the week
        </p>
      </div>
      <div className="space-y-4">
        {days.map(({ key, label }) => (
          <div
            key={key}
            className={`p-4 rounded-xl border transition-colors ${
              schedule[key as keyof WeeklySchedule].isOpen
                ? "bg-white bg-opacity-10 border-purple-300 border-opacity-50"
                : "bg-white bg-opacity-5 border-white border-opacity-20"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <Switch
                  checked={schedule[key as keyof WeeklySchedule].isOpen}
                  onCheckedChange={(checked) =>
                    updateDaySchedule(key as keyof WeeklySchedule, 'isOpen', checked)
                  }
                />
                <Label className="font-medium text-base text-white">{label}</Label>
                {schedule[key as keyof WeeklySchedule].isOpen ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <span className="text-sm text-white text-opacity-60">Closed</span>
                )}
              </div>
            </div>

            {schedule[key as keyof WeeklySchedule].isOpen && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Input
                    type="time"
                    value={schedule[key as keyof WeeklySchedule].open}
                    onChange={(e) =>
                      updateDaySchedule(key as keyof WeeklySchedule, 'open', e.target.value)
                    }
                    className="w-28 h-9 text-sm bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <span className="text-white text-opacity-80 text-sm">to</span>
                  <Input
                    type="time"
                    value={schedule[key as keyof WeeklySchedule].close}
                    onChange={(e) =>
                      updateDaySchedule(key as keyof WeeklySchedule, 'close', e.target.value)
                    }
                    className="w-28 h-9 text-sm bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border border-white border-opacity-20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToAllDays(key as keyof WeeklySchedule)}
                  className="text-xs px-2 py-1 h-7"
                >
                  Copy
                </Button>
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg border border-white border-opacity-20">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-purple-300 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-medium text-white mb-1">Schedule Tips:</h4>
              <ul className="space-y-1 text-white text-opacity-80">
                <li>• Use the "Copy to all" button to quickly set the same hours for multiple days</li>
                <li>• Toggle the switch to mark days as closed</li>
                <li>• You can modify these hours later in your dashboard settings</li>
                <li>• Customers will see these hours when joining your queue</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
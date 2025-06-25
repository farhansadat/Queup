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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Weekly Operating Hours
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Set your business hours for each day of the week
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {days.map(({ key, label }) => (
          <div
            key={key}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              schedule[key as keyof WeeklySchedule].isOpen
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={schedule[key as keyof WeeklySchedule].isOpen}
                  onCheckedChange={(checked) =>
                    updateDaySchedule(key as keyof WeeklySchedule, 'isOpen', checked)
                  }
                />
                <Label className="font-medium w-20">{label}</Label>
              </div>
              
              {schedule[key as keyof WeeklySchedule].isOpen ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">Closed</span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              {schedule[key as keyof WeeklySchedule].isOpen ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <Input
                      type="time"
                      value={schedule[key as keyof WeeklySchedule].open}
                      onChange={(e) =>
                        updateDaySchedule(key as keyof WeeklySchedule, 'open', e.target.value)
                      }
                      className="w-28"
                    />
                  </div>
                  <span className="text-gray-400">to</span>
                  <Input
                    type="time"
                    value={schedule[key as keyof WeeklySchedule].close}
                    onChange={(e) =>
                      updateDaySchedule(key as keyof WeeklySchedule, 'close', e.target.value)
                    }
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToAllDays(key as keyof WeeklySchedule)}
                    className="text-xs px-2"
                  >
                    Copy to all
                  </Button>
                </>
              ) : (
                <div className="w-64 flex justify-end">
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No operating hours
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">Schedule Tips:</h4>
              <ul className="space-y-1 text-blue-800 dark:text-blue-200">
                <li>• Use the "Copy to all" button to quickly set the same hours for multiple days</li>
                <li>• Toggle the switch to mark days as closed</li>
                <li>• You can modify these hours later in your dashboard settings</li>
                <li>• Customers will see these hours when joining your queue</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
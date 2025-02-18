import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";
import { format } from "date-fns";

export default function HealthLeaveComponent() {
  // Mock data for recent notifications
  const recentNotifications = [
    { type: "Health", date: "2024-03-15", status: "Reported", details: "Flu symptoms reported" },
    { type: "Leave", date: "2024-03-14", status: "Notified", details: "Early departure - Family event" },
    { type: "Health", date: "2024-03-13", status: "Pending", details: "Migraine reported" },
  ];

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Health Status Reporting Card */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-600">🏥</span> Health Status Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="health-status">Current Health Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sick">Feeling Sick</SelectItem>
                  <SelectItem value="injured">Injured</SelectItem>
                  <SelectItem value="recovering">Recovering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="health-details">Additional Details</Label>
              <Input
                id="health-details"
                placeholder="Describe your condition..."
                className="h-24"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit Health Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Leave Notification Card */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-600">🚪</span> Campus Leave Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Pick date
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarDateRangePicker />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Parent Email</Label>
                <Input
                  type="email"
                  placeholder="parent@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason for Leaving</Label>
              <Input
                placeholder="Brief reason for leaving campus..."
              />
            </div>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Submit Leave Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Notifications Card */}
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-600">🔔</span> Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotifications.map((notification, index) => (
              <div key={index} className="flex items-start p-3 rounded-lg bg-muted">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${
                      notification.status === 'Reported' ? 'text-yellow-600' :
                      notification.status === 'Notified' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {notification.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(notification.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{notification.details}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  notification.status === 'Reported' ? 'bg-yellow-100 text-yellow-800' :
                  notification.status === 'Notified' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {notification.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, MapPin, Users } from "lucide-react";

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  location: string;
  description: string;
  imageUrl: string;
  availableTimeSlots: string[];
}

interface Booking {
  id: string;
  facilityId: string;
  date: Date;
  timeSlot: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
}

const FacilityBookingComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFacility, setSelectedFacility] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Sample facilities data
  const facilities: Facility[] = [
    {
      id: "1",
      name: "Main Auditorium",
      type: "Auditorium",
      capacity: 500,
      location: "Main Building, Ground Floor",
      description: "Fully equipped auditorium with modern AV systems",
      imageUrl: "/api/placeholder/400/200",
      availableTimeSlots: ["09:00-11:00", "11:00-13:00", "14:00-16:00", "16:00-18:00"]
    },
    {
      id: "2",
      name: "Basketball Court",
      type: "Sports",
      capacity: 50,
      location: "Sports Complex",
      description: "Indoor basketball court with spectator seating",
      imageUrl: "/api/placeholder/400/200",
      availableTimeSlots: ["08:00-10:00", "10:00-12:00", "14:00-16:00", "16:00-18:00"]
    },
    // Add more facilities as needed
  ];

  const handleBooking = () => {
    if (selectedDate && selectedFacility && selectedTimeSlot) {
      // Here you would typically make an API call to create the booking
      setBookingConfirmed(true);
    }
  };

  const selectedFacilityData = facilities.find(f => f.id === selectedFacility);

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Facility Booking</h2>
        <p className="text-muted-foreground">
          Book campus facilities for your events and activities
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Facility Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Facility</CardTitle>
            <CardDescription>Choose from available campus facilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={selectedFacility}
              onValueChange={setSelectedFacility}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a facility" />
              </SelectTrigger>
              <SelectContent>
                {facilities.map((facility) => (
                  <SelectItem key={facility.id} value={facility.id}>
                    {facility.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedFacilityData && (
              <div className="space-y-4 mt-4">
                <img
                  src={selectedFacilityData.imageUrl}
                  alt={selectedFacilityData.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{selectedFacilityData.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Capacity: {selectedFacilityData.capacity} people</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedFacilityData.description}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Date and Time Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Date & Time</CardTitle>
            <CardDescription>Choose your preferred booking slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              disabled={(date) => date < new Date() || date > new Date().setMonth(new Date().getMonth() + 2)}
            />

            {selectedFacilityData && (
              <Select
                value={selectedTimeSlot}
                onValueChange={setSelectedTimeSlot}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {selectedFacilityData.availableTimeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Summary */}
      {selectedFacilityData && selectedDate && selectedTimeSlot && !bookingConfirmed && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>Facility:</strong> {selectedFacilityData.name}</p>
            <p><strong>Date:</strong> {selectedDate.toLocaleDateString()}</p>
            <p><strong>Time Slot:</strong> {selectedTimeSlot}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleBooking} className="w-full">
              Confirm Booking
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Booking Confirmation */}
      {bookingConfirmed && (
        <Alert className="bg-green-500/15">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            Your booking has been confirmed! You will receive a confirmation email shortly.
          </AlertDescription>
        </Alert>
      )}

      {/* My Bookings Section */}
      <Card >
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>View and manage your facility bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="space-y-4">
                {/* Sample upcoming booking */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Main Auditorium</CardTitle>
                        <CardDescription>Annual Cultural Event</CardDescription>
                      </div>
                      <Badge>Approved</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        March 1, 2025 | 14:00-16:00
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        Main Building
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="text-center text-muted-foreground py-4">
                No past bookings found
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FacilityBookingComponent;
import React, { useState } from 'react';
import { format } from 'date-fns';
import Calendar from 'react-calendar';
import { CalendarDays, Clock, Users, Wifi } from 'lucide-react';
import { MEETING_ROOMS } from '../types';
import MeetingRoomGrid from '../components/MeetingRoomGrid';
import { useRealTimeBookings } from '../hooks/useRealTimeBookings';
import 'react-calendar/dist/Calendar.css';

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Use real-time bookings hook
  const { bookings, loading, error, refetch } = useRealTimeBookings({
    date: selectedDate,
    enabled: true,
    interval: 5000 // Poll every 5 seconds for real-time updates
  });

  // Handle date selection
  const handleDateChange = (date) => {
    if (Array.isArray(date)) return;
    setSelectedDate(date);
  };

  // Disable past dates
  const tileDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

    return (
    <div className="min-h-screen glass">
    

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Calendar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card fade-in">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                  <CalendarDays className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  เลือกวันที่
                </h2>
              </div>
              
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                tileDisabled={tileDisabled}
                className="react-calendar w-full border-0"
                locale="en-US"
                formatMonthYear={(locale, date) => 
                  format(date, 'MMMM yyyy')
                }
              />
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">Selected Date</p>
                    <p className="text-xl font-bold">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="card slide-in">
              <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">
                  สรุปประวัติการจองวันนี้
                </h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                  <span className="text-gray-700 font-semibold">จำนวนการจอง:</span>
                  <span className="font-bold text-3xl text-green-600">
                    {bookings.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <span className="text-gray-700 font-semibold">Available Rooms:</span>
                  <span className="font-bold text-3xl text-blue-600">
                    {MEETING_ROOMS.length - new Set(bookings.map(b => b.roomId)).size}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Meeting Rooms */}
          <div className="lg:col-span-2">
            <div className="card fade-in">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Meeting Rooms
                  </h2>
                </div>
                <div className="flex items-center space-x-4">
                  {loading && (
                    <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                      <span className="text-sm font-semibold">Loading...</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    <Wifi className="h-5 w-5" />
                    <span className="text-sm font-semibold">Live Updates</span>
                  </div>
                </div>
              </div>

              <MeetingRoomGrid
                selectedDate={selectedDate}
                bookings={bookings}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
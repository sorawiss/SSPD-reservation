import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { MEETING_ROOMS, TIME_SLOTS } from '../types';

const MeetingRoomGrid = ({
  selectedDate,
  bookings,
  loading
}) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:00');
  const navigate = useNavigate();

  // Check if a room is available at a specific time
  const isRoomAvailable = (roomId, timeSlot) => {
    return !bookings.some(booking => 
      booking.roomId === roomId && 
      booking.timeSlot.start === timeSlot &&
      booking.status === 'active'
    );
  };

  // Get booking for a specific room and time
  const getBookingInfo = (roomId, timeSlot) => {
    return bookings.find(booking => 
      booking.roomId === roomId && 
      booking.timeSlot.start === timeSlot &&
      booking.status === 'active'
    );
  };

  const handleRoomClick = (roomId) => {
    if (!isRoomAvailable(roomId, selectedTimeSlot)) {
      return; // Room is booked
    }

    // Navigate to booking page with room and time slot data
    const timeSlotData = {
      start: selectedTimeSlot,
      end: TIME_SLOTS[TIME_SLOTS.indexOf(selectedTimeSlot) + 1] || '17:00'
    };

    navigate('/booking', {
      state: {
        roomId,
        date: selectedDate,
        timeSlot: timeSlotData
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Time Slot Selector */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-600 to-green-500 rounded-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Select Time Slot</h3>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {TIME_SLOTS.slice(0, -1).map((timeSlot) => (
            <button
              key={timeSlot}
              onClick={() => setSelectedTimeSlot(timeSlot)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedTimeSlot === timeSlot
                  ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:text-green-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              {timeSlot}
            </button>
          ))}
        </div>
      </div>

      {/* Meeting Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MEETING_ROOMS.map((room) => {
          const available = isRoomAvailable(room.id, selectedTimeSlot);
          const bookingInfo = getBookingInfo(room.id, selectedTimeSlot);

          return (
            <div
              key={room.id}
              className={`card transition-all duration-500 cursor-pointer transform hover:scale-105 ${
                available 
                  ? 'hover:shadow-2xl border-l-4 border-l-green-500' 
                  : 'border-l-4 border-l-red-500 opacity-75'
              }`}
              onClick={() => available && handleRoomClick(room.id)}
            >
              {/* Room Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                                     <div className={`p-3 rounded-xl ${
                     available ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                   }`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {room.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Capacity: {room.capacity} people
                    </p>
                  </div>
                </div>
                
                                 <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold ${
                   available 
                     ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg' 
                     : 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                 }`}>
                  {available ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      <span>Booked</span>
                    </>
                  )}
                </div>
              </div>

              {/* Time and Booking Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-semibold">
                    {selectedTimeSlot} - {TIME_SLOTS[TIME_SLOTS.indexOf(selectedTimeSlot) + 1] || '17:00'}
                  </span>
                </div>

                {/* Show booking details if room is booked */}
                {bookingInfo && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl border border-red-200">
                    <p className="text-sm font-bold text-red-800 mb-2">
                      Booked by: {bookingInfo.userDetails.fullName}
                    </p>
                    <p className="text-xs text-red-600">
                      Purpose: {bookingInfo.userDetails.purpose}
                    </p>
                  </div>
                )}

                {/* Show available message if room is free */}
                                 {available && (
                   <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                     <p className="text-sm font-bold text-green-800">
                       Click to book this time slot
                     </p>
                     <p className="text-xs text-green-600">
                       For {format(selectedDate, 'EEEE, MMM d, yyyy')}
                     </p>
                   </div>
                 )}
              </div>

              {/* Action Button */}
              {available && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    className="btn-primary w-full flex items-center justify-center space-x-3 text-lg"
                    disabled={loading}
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Book Now</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MeetingRoomGrid; 
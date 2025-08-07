import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Clock, User, Phone, FileText, Building, Save } from 'lucide-react';
import { MEETING_ROOMS, TIME_SLOTS } from '../types';
import { bookingsAPI } from '../services/api';

const BookingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get booking data from location state
  const bookingData = location.state;

  const [formData, setFormData] = useState({
    fullName: '',
    employeeId: '',
    phoneNumber: '',
    purpose: '',
  });
  const [duration, setDuration] = useState(1); // Number of 30-minute slots
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const room = MEETING_ROOMS.find(r => r.id === bookingData.roomId);
  
  // Calculate end time based on duration
  const calculateEndTime = (startTime, slots) => {
    const startIndex = TIME_SLOTS.indexOf(startTime);
    const endIndex = Math.min(startIndex + slots, TIME_SLOTS.length - 1);
    return TIME_SLOTS[endIndex];
  };

  // Get maximum possible duration (up to 4 hours or 8 slots)
  const getMaxDuration = () => {
    if (!bookingData.timeSlot?.start) return 1;
    const startIndex = TIME_SLOTS.indexOf(bookingData.timeSlot.start);
    const maxSlots = Math.min(8, TIME_SLOTS.length - 1 - startIndex); // Max 4 hours
    return maxSlots;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate form
    if (!formData.fullName.trim() || !formData.employeeId.trim() || 
        !formData.phoneNumber.trim() || !formData.purpose.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const endTime = calculateEndTime(bookingData.timeSlot.start, duration);
      
      const bookingPayload = {
        fullName: formData.fullName.trim(),
        employeeId: formData.employeeId.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        purpose: formData.purpose.trim(),
        roomId: bookingData.roomId,
        date: format(bookingData.date, 'yyyy-MM-dd'),
        timeSlot: {
          start: bookingData.timeSlot.start,
          end: endTime
        }
      };

      await bookingsAPI.createBooking(bookingPayload);
      navigate('/my-bookings', { 
        state: { 
          message: 'Booking created successfully!',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.error || error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!room || !bookingData.timeSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="card max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Booking Request</h1>
            <p className="text-gray-600 mb-6">The booking information is incomplete or invalid.</p>
            <button
              onClick={handleBack}
              className="btn-primary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="card mb-8">
            <div className="flex items-center justify-between p-8 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 hover:scale-110"
                >
                  <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                                 <div className="p-2 bg-gradient-to-r from-green-600 to-green-500 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold gradient-text">Book Meeting Room</h1>
              </div>
            </div>

            {/* Booking Details */}
            <div className="p-8 bg-gradient-to-r from-green-50 to-green-100 border-b border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{room.name}</h2>
                    <p className="text-gray-600">Capacity: {room.capacity} people</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {format(bookingData.date, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-green-600 to-green-500 rounded-xl">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-800">
                      {bookingData.timeSlot.start} - {calculateEndTime(bookingData.timeSlot.start, duration)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card">
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Duration Selector */}
              <div>
                <label className="form-label text-lg">
                  Duration (30-minute intervals)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="form-input text-lg"
                >
                  {Array.from({ length: getMaxDuration() }, (_, i) => i + 1).map(slots => (
                    <option key={slots} value={slots}>
                      {slots * 30} minutes ({slots} slot{slots > 1 ? 's' : ''})
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="form-label text-lg">
                  <User className="inline h-5 w-5 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="form-input text-lg"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Employee ID */}
              <div>
                <label htmlFor="employeeId" className="form-label text-lg">
                  Employee ID *
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  className="form-input text-lg"
                  placeholder="Enter your employee ID"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="form-label text-lg">
                  <Phone className="inline h-5 w-5 mr-2" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="form-input text-lg"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              {/* Purpose */}
              <div>
                <label htmlFor="purpose" className="form-label text-lg">
                  <FileText className="inline h-5 w-5 mr-2" />
                  Purpose of Use *
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  className="form-input text-lg"
                  style={{ resize: 'none' }}
                  rows={4}
                  placeholder="Describe the purpose of your meeting"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm font-semibold">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="btn-secondary flex-1 text-lg"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center space-x-3 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Booking...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      <span>Confirm Booking</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 
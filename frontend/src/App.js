import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import StatisticsPage from './pages/StatisticsPage';
import BookingPage from './pages/BookingPage';

function App() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)' }}>
      <Navigation />
      <main className="container mx-auto px-4 py-8" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App; 
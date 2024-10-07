import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Login from './components/authentication/Login';
import ListHotelManager from './components/users/ListHotelManager';
import ListHotel from './components/hotels/ListHotel';
import ListCustomer from './components/users/ListCustomer';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          {/* user */}
          <Route path="/list-hotel-manager" element={<ListHotelManager />} />
          <Route path="/list-customer" element={<ListCustomer />} />
          {/* hotel */}
          <Route path="/list-hotel" element={<ListHotel />} />
        </Routes>
    </div>
  );
}

export default App;

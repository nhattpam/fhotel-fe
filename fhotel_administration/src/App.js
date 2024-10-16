import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import './App.css';
import Login from './components/authentication/Login';
import ListHotelManager from './components/users/ListHotelManager';
import ListHotelRegistration from './components/hotel-registrations/ListHotelRegistration';
import ListHotel from './components/hotels/ListHotel';
import ListCustomer from './components/users/ListCustomer';
import AdminHome from './components/home/AdminHome';
import HotelManagerHome from './components/home/HotelManagerHome';
import ListOwnerHotel from './components/hotels/ListOwnerHotel';
import ListReceptionist from './components/users/ListReceptionist';
import ListRoomAttendant from './components/users/ListRoomAttendant';
import EditHotel from './components/hotels/EditHotel';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/hotel-manager-home" element={<HotelManagerHome />} />
        <Route path="/login" element={<Login />} />
        {/* user */}
        <Route path="/list-hotel-manager" element={<ListHotelManager />} />
        <Route path="/list-customer" element={<ListCustomer />} />
        <Route path="/list-receptionist" element={<ListReceptionist />} />
        <Route path="/list-room-attendant" element={<ListRoomAttendant />} />
        {/* hotel */}
        <Route path="/list-hotel" element={<ListHotel />} />
        <Route path="/list-owner-hotel" element={<ListOwnerHotel />} />
        <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
        
       
      </Routes>
    </div>
  );
}

export default App;

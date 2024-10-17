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
import ManagerHome from './components/home/ManagerHome';
import ReceptionistHome from './components/home/ReceptionistHome';
import RoomAttendantHome from './components/home/RoomAttendantHome';
import ListService from './components/services/ListService';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/hotel-manager-home" element={<HotelManagerHome />} />
        <Route path="/manager-home" element={<ManagerHome />} />
        <Route path="/receptionist-home" element={<ReceptionistHome />} />
        <Route path="/room-attendant-home" element={<RoomAttendantHome />} />
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
        {/* service */}
        <Route path="/list-service/" element={<ListService />} />
      </Routes>
    </div>
  );
}

export default App;

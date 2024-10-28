import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/authentication/Login';
import ListHotelManager from './components/users/ListHotelManager';
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
import ListRefundPolicy from './components/policies/ListRefundPolicy';
import ListLateCheckOutPolicy from './components/policies/ListLateCheckOutPolicy';
import ListTypePricing from './components/type-pricings/ListTypePricing';
import ListManager from './components/users/ListManager';
import ListStaffReservation from './components/reservations/ListStaffReservation';
import ListOwnerReservation from './components/reservations/ListOwnerReservation';
import ListReservation from './components/reservations/ListReservation';
import CheckInOut from './components/reservations/CheckInOut';
import ListHotelVerification from './components/hotels/ListHotelVerification';
import ListOrder from './components/orders/ListOrder';

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
        <Route path="/list-manager" element={<ListManager />} />
        <Route path="/list-receptionist" element={<ListReceptionist />} />
        <Route path="/list-room-attendant" element={<ListRoomAttendant />} />
        {/* hotel */}
        <Route path="/list-hotel" element={<ListHotel />} />
        <Route path="/list-owner-hotel" element={<ListOwnerHotel />} />
        <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
        {/* service */}
        <Route path="/list-service" element={<ListService />} />
        {/* policy */}
        <Route path="/list-refund-policy" element={<ListRefundPolicy />} />
        <Route path="/list-late-check-out-policy" element={<ListLateCheckOutPolicy />} />
        {/* type-pricing */}
        <Route path="/list-type-pricing/:typeId" element={<ListTypePricing />} />
        {/* reservation */}
        <Route path="/list-staff-reservation" element={<ListStaffReservation />} />
        <Route path="/list-owner-reservation" element={<ListOwnerReservation />} />
        <Route path="/list-reservation" element={<ListReservation />} />
        <Route path="/check-in-out" element={<CheckInOut />} />
        {/* hotel verification */}
        <Route path="/list-hotel-verification" element={<ListHotelVerification />} />
        {/* order */}
        <Route path="/list-order" element={<ListOrder />} />
      </Routes>
    </div>
  );
}

export default App;

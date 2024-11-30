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
import ListTypePricing from './components/type-pricings/ListTypePricing';
import ListManager from './components/users/ListManager';
import ListStaffReservation from './components/reservations/ListStaffReservation';
import ListOwnerReservation from './components/reservations/ListOwnerReservation';
import ListReservation from './components/reservations/ListReservation';
import CheckInOut from './components/reservations/CheckInOut';
import ListHotelVerification from './components/hotels/ListHotelVerification';
import ListOrder from './components/orders/ListOrder';
import RoomManagement from './components/rooms/RoomManagement';
import RoomStatus from './components/rooms/RoomStatus';
import ListRoom from './components/rooms/ListRoom';
import ListStaffCustomer from './components/users/ListStaffCustomer';
import ListOwnerCustomer from './components/users/ListOwnerCustomer';
import ListRefund from './components/reservations/ListRefund';
import ListHotelRoom from './components/rooms/ListHotelRoom';
import ListOwnerBill from './components/bills/ListOwnerBill';
import ListBill from './components/bills/ListBill';
import ListRevenuePolicy from './components/policies/ListRevenuePolicy';
import ListCancellationPolicy from './components/policies/ListCancellationPolicy';
import HotelCancellationPolicy from './components/policies/HotelCancellationPolicy';
import HotelRevenuePolicy from './components/policies/HotelRevenuePolicy';

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
        <Route path="/list-staff-customer" element={<ListStaffCustomer />} />
        <Route path="/list-owner-customer" element={<ListOwnerCustomer />} />
        {/* hotel */}
        <Route path="/list-hotel" element={<ListHotel />} />
        <Route path="/list-owner-hotel" element={<ListOwnerHotel />} />
        <Route path="/edit-hotel/:hotelId" element={<EditHotel />} />
        {/* service */}
        <Route path="/list-service" element={<ListService />} />
      
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
        {/* room management */}
        <Route path="/room-management" element={<RoomManagement />} />
        <Route path="/room-status" element={<RoomStatus />} />
        {/* <Route path="/list-room/:roomTypeId" element={<ListRoom />} /> */}
        <Route path="/list-room/" element={<ListRoom />} />
        <Route path="/list-hotel-room/" element={<ListHotelRoom />} />
        {/* refund */}
        <Route path="/list-refund/" element={<ListRefund />} />
         {/* bill */}
         <Route path="/list-owner-bill/" element={<ListOwnerBill />} />
         <Route path="/list-bill/" element={<ListBill />} />
         {/* policy */}
         <Route path="/list-revenue-policy/" element={<ListRevenuePolicy />} />
         <Route path="/list-cancellation-policy/" element={<ListCancellationPolicy />} />
         <Route path="/hotel-cancellation-policy/" element={<HotelCancellationPolicy />} />
         <Route path="/hotel-revenue-policy/" element={<HotelRevenuePolicy />} />

      </Routes>
    </div>
  );
}

export default App;

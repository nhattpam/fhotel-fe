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
import ListHotelRoom from './components/rooms/ListHotelRoom';
import ListOwnerBill from './components/bills/ListOwnerBill';
import ListBill from './components/bills/ListBill';
import ListRevenuePolicy from './components/policies/ListRevenuePolicy';
import ListCancellationPolicy from './components/policies/ListCancellationPolicy';
import HotelCancellationPolicy from './components/policies/HotelCancellationPolicy';
import HotelRevenuePolicy from './components/policies/HotelRevenuePolicy';
import EscrowWalletTransaction from './components/transactions/EscrowWalletTransaction';
import ListSystemRoom from './components/rooms/ListSystemRoom';
import ProtectedRoute from './components/authentication/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel-manager-home"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <HotelManagerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-home"
          element={
            <ProtectedRoute requiredRoles={["Manager"]}>
              <ManagerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receptionist-home"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <ReceptionistHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room-attendant-home"
          element={
            <ProtectedRoute requiredRoles={["Room Attendant"]}>
              <RoomAttendantHome />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        {/* user */}
        <Route
          path="/list-hotel-manager"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ListHotelManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-customer"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
              <ListCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-manager"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ListManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-receptionist"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListReceptionist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-room-attendant"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListRoomAttendant />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-staff-customer"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <ListStaffCustomer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-owner-customer"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListOwnerCustomer />
            </ProtectedRoute>
          }
        />
        {/* hotel */}
        <Route
          path="/list-hotel"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
              <ListHotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-owner-hotel"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListOwnerHotel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-hotel"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager", "Hotel Manager", "Receptionist", "Room Attendant"]}>
              <EditHotel />
            </ProtectedRoute>
          }
        />
        {/* service */}
        <Route
          path="/list-service"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
              <ListService />
            </ProtectedRoute>
          }
        />
        {/* type-pricing */}
        <Route
          path="/list-type-pricing/:typeId"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ListTypePricing />
            </ProtectedRoute>
          }
        />
        {/* reservation */}
        <Route
          path="/list-staff-reservation"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <ListStaffReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-owner-reservation"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListOwnerReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-reservation"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
              <ListReservation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/check-in-out"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <CheckInOut />
            </ProtectedRoute>
          }
        />
        {/* hotel verification */}
        <Route
          path="/list-hotel-verification"
          element={
            <ProtectedRoute requiredRoles={["Manager"]}>
              <ListHotelVerification />
            </ProtectedRoute>
          }
        />
        {/* order */}
        <Route
          path="/list-order"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <ListOrder />
            </ProtectedRoute>
          }
        />
        {/* room management */}
        <Route path="/room-management" element={<RoomManagement />} />
        <Route
          path="/room-status"
          element={
            <ProtectedRoute requiredRoles={["Room Attendant"]}>
              <RoomStatus />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/list-room/:roomTypeId" element={<ListRoom />} /> */}
        <Route
          path="/list-room"
          element={
            <ProtectedRoute requiredRoles={["Receptionist"]}>
              <ListRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-hotel-room"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListHotelRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-system-room"
          element={
            <ProtectedRoute requiredRoles={["Manager"]}>
              <ListSystemRoom />
            </ProtectedRoute>
          }
        />
        {/* bill */}
        <Route
          path="/list-owner-bill"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <ListOwnerBill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-bill"
          element={
            <ProtectedRoute requiredRoles={["Admin", "Manager"]}>
              <ListBill />
            </ProtectedRoute>
          }
        />
        {/* policy */}
        <Route
          path="/list-revenue-policy/"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ListRevenuePolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/list-cancellation-policy/"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <ListCancellationPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel-cancellation-policy/"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <HotelCancellationPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hotel-revenue-policy/"
          element={
            <ProtectedRoute requiredRoles={["Hotel Manager"]}>
              <HotelRevenuePolicy />
            </ProtectedRoute>
          }
        />
        {/* transaction */}
        <Route
          path="/escrow-wallet-transaction/"
          element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <EscrowWalletTransaction />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SuccessRegister from './components/authentication/SuccessRegister';
import PaymentCallBack from './components/payments/PaymentCallBack';
import SuccessPayment from './components/payments/SuccessPayment';
import HotelPolicy from './components/information/HotelPolicy';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        {/* success register */}
        <Route path="/success-register" element={<SuccessRegister />} />

        <Route path="/payment-callback" element={<PaymentCallBack />} />

        <Route path="/success-payment" element={<SuccessPayment />} />

        <Route path="/hotel-policy" element={<HotelPolicy />} />


      </Routes>
    </div>
  );
}

export default App;

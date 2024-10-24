import logo from './logo.svg';
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import SuccessRegister from './components/authentication/SuccessRegister';
import PaymentCallBack from './components/payments/PaymentCallBack';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        {/* success register */}
        <Route path="/success-register" element={<SuccessRegister />} />

        <Route path="/payment-callback" element={<PaymentCallBack />} />
      </Routes>
    </div>
  );
}

export default App;

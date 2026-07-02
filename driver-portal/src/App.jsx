import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import Lookup from './pages/Lookup';
import Payment from './pages/Payment';
import Success from './pages/Success';
import Login from './pages/Login';
import Register from './pages/Register';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white p-4 shadow-xl flex justify-between items-center px-10">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-yellow-400" size={32} />
        <div>
          <h1 className="font-bold text-lg leading-tight">Sri Lanka Police</h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Traffic Fine Portal</p>
        </div>
      </div>
      <div className="flex gap-6 items-center font-medium">
        <Link to="/" className="hover:text-yellow-400 transition">Pay Fine</Link>
        {token ? (
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition">
            <LogOut size={18}/> Logout
          </button>
        ) : (
          <Link to="/login" className="bg-yellow-500 text-slate-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <div className="container mx-auto py-12 px-4">
          <Routes>
            <Route path="/" element={<Lookup />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/success" element={<Success />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
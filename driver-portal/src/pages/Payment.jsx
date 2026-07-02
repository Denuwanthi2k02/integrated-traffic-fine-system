import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import API from '../services/api';

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!state?.fine) return <div className="text-center py-20 font-bold">Session expired. Please search again.</div>;

  const handlePay = async () => {
    setLoading(true);
    try {
      await API.post('/payments/pay', { fineId: state.fine.id });
      navigate('/success');
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Fine Receipt Look */}
      <div className="lg:col-span-1 bg-white border-2 border-dashed border-slate-300 p-6 rounded-3xl h-fit">
        <h3 className="text-center font-bold text-slate-400 uppercase tracking-widest mb-4">Fine Invoice</h3>
        <div className="space-y-4 border-b pb-4">
            <p className="flex justify-between text-sm text-slate-600 font-medium">Ref: <span className="text-slate-900">#{state.fine.referenceNumber}</span></p>
            <p className="flex justify-between text-sm text-slate-600 font-medium">Violation: <span className="text-slate-900">{state.fine.category}</span></p>
            <p className="flex justify-between text-sm text-slate-600 font-medium">District: <span className="text-slate-900">{state.fine.district}</span></p>
        </div>
        <div className="pt-4 text-center">
            <p className="text-slate-400 text-xs uppercase mb-1 font-bold">Total to Pay</p>
            <h4 className="text-4xl font-black text-slate-900">Rs. {state.fine.amount}</h4>
        </div>
      </div>

      {/* Modern Card Form */}
      <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-green-100 p-3 rounded-full text-green-600"><Lock size={24}/></div>
            <div>
                <h3 className="text-xl font-bold">Secure Checkout</h3>
                <p className="text-xs text-slate-400">All transactions are encrypted and monitored.</p>
            </div>
        </div>

        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Cardholder Name" className="col-span-2 w-full p-4 border rounded-2xl outline-none focus:border-blue-600" />
                <input type="text" placeholder="Card Number" className="col-span-2 w-full p-4 border rounded-2xl outline-none focus:border-blue-600" />
                <input type="text" placeholder="MM/YY" className="w-full p-4 border rounded-2xl outline-none focus:border-blue-600" />
                <input type="text" placeholder="CVC" className="w-full p-4 border rounded-2xl outline-none focus:border-blue-600" />
            </div>
            <button onClick={handlePay} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl hover:bg-blue-700 transition shadow-xl flex justify-center items-center gap-3">
                {loading ? "Authorizing..." : <><CheckCircle /> Authorize Payment</>}
            </button>
            <div className="flex justify-center gap-4 grayscale opacity-50 pt-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-6" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" />
            </div>
        </div>
      </div>
    </div>
  );
}
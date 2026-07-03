import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, Lock, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";
import API from "../services/api";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Card States
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  if (!state?.fine)
    return (
      <div className="text-center py-20 font-bold text-slate-500">
        <p>Session expired or invalid access.</p>
        <button 
          onClick={() => navigate("/")} 
          className="mt-4 text-blue-600 underline"
        >
          Return to Home
        </button>
      </div>
    );

  const handlePay = async () => {
    // 1. Basic Validation
    if (!cardholderName.trim() || !cardNumber.trim() || !expiry.trim() || !cvc.trim()) {
      alert("Please complete all payment fields before authorizing.");
      return;
    }

    setLoading(true);

    // 2. Simulate Payment Gateway Handshake (Excellent for Demos/Viva)
    // This makes the UI feel like a real banking system
    setTimeout(async () => {
      try {
        // 3. Call your updated backend (This triggers the SMS on the server)
        const response = await API.post(`/driver/fines/${state.fine.id}/pay`, {
          method: "CREDIT_CARD_GATEWAY",
          amount: state.fine.amount,
          cardholderName: cardholderName.trim(),
          // We only send the last 4 digits for security simulation
          last4: cardNumber.slice(-4), 
        });

        // 4. On Success: Navigate to the Success Page
        navigate("/success", {
          state: {
            fine: state.fine,
            payment: response.data,
            transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
          },
        });
      } catch (err) {
        const message = err.response?.data?.message || "Bank Gateway Timeout. Please try again.";
        alert(message);
        setLoading(false);
      }
    }, 2500); // 2.5 second delay for "Realism"
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: The Fine Receipt */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-8 rounded-3xl sticky top-10">
            <div className="flex justify-center mb-6">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg">
                <CreditCard size={32} />
              </div>
            </div>
            
            <h3 className="text-center font-bold text-slate-500 uppercase tracking-widest text-xs mb-6">
              Official Fine Invoice
            </h3>

            <div className="space-y-4 border-b border-slate-200 pb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Reference No</span>
                <span className="font-mono font-bold text-slate-900">{state.fine.referenceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Violation</span>
                <span className="font-bold text-slate-900">{state.fine.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">District</span>
                <span className="font-semibold text-slate-700">{state.fine.district}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Officer</span>
                <span className="text-slate-700 italic">{state.fine.officer || "Reporting Officer"}</span>
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-slate-400 text-xs uppercase mb-1 font-bold">Total Amount Due</p>
              <h4 className="text-4xl font-black text-blue-600">
                Rs. {Number(state.fine.amount).toLocaleString()}
              </h4>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-bold">
              <ShieldCheck size={14} className="text-green-500" />
              Verified by Sri Lanka Police Dept.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Modern Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                  <Lock size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Secure Payment</h3>
                  <p className="text-sm text-slate-400">Encrypted via 256-bit SSL Connection</p>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex gap-2">
                  <div className="w-10 h-6 bg-slate-100 rounded-md"></div>
                  <div className="w-10 h-6 bg-slate-100 rounded-md"></div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. ARUNA PERERA"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-medium"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="xxxx xxxx xxxx xxxx"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all font-mono text-lg"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19))}
                  />
                  <CreditCard className="absolute right-4 top-4 text-slate-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-center"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">CVC</label>
                  <input
                    type="password"
                    placeholder="***"
                    maxLength="3"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-600 focus:bg-white transition-all text-center"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handlePay}
                  disabled={loading}
                  className={`w-full py-5 rounded-2xl font-bold text-xl transition-all shadow-xl flex justify-center items-center gap-3 ${
                    loading 
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" /> Verifying with Bank...
                    </>
                  ) : (
                    <>
                      <CheckCircle /> Confirm Payment
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col items-center gap-4 pt-6 border-t border-slate-50">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supported Payment Methods</p>
                <div className="flex justify-center gap-6 grayscale opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4" alt="Paypal" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
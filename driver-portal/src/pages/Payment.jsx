import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, ShieldCheck, Loader2, CreditCard, FileText, ArrowRight } from "lucide-react";
import API from "../services/api";

export default function Payment() {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [viewState, setViewState] = useState("checkout"); 
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  if (!state?.fine) return <div className="text-center py-20 font-bold">Invalid Session.</div>;

  // Check if the fine is already paid based on the database status passed in state
  const isAlreadyPaid = state.fine.status && state.fine.status.toLowerCase() === "paid";

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Prepare Data
      const amount = Number(state.fine.amount).toFixed(2);
      const refNo = state.fine.referenceNumber; 

      // 2. Fetch Security Hash from Backend
      const hashRes = await API.get(`/payments/hash/${amount}/${refNo}`);

      // 3. Dynamically get logged-in user details from localStorage (falls back to generic if not found)
      const driverName = localStorage.getItem("userName") || "Driver";
      const driverEmail = localStorage.getItem("userEmail") || "driver@system.com";

      // 4. Setup PayHere Payment Object (with your specific ngrok URLs)
      const payment = {
        sandbox: true,
        merchant_id: "1236691", 
        return_url: "https://starring-wrecker-debit.ngrok-free.dev/success",
        cancel_url: "https://starring-wrecker-debit.ngrok-free.dev/payment",
        notify_url: "https://starring-wrecker-debit.ngrok-free.dev/api/payments/notify", 
        order_id: refNo,
        items: `Traffic Fine: ${refNo}`,
        amount: amount,
        currency: "LKR",
        hash: hashRes.data, 
        first_name: driverName,
        last_name: "",
        email: driverEmail,
        phone: "0000000000",
        address: "Sri Lanka",
        city: "Colombo",
        country: "Sri Lanka",
      };

      // 5. PayHere Callbacks
      window.payhere.onCompleted = async function (id) {
        try {
          await API.post(`/payments/pay/${refNo}`);
          setOrderId(id);
          setViewState("success");
        } catch (e) {
          console.error("DB Update Failed", e);
        } finally {
          setLoading(false);
        }
      };

      window.payhere.onDismissed = function () {
        setLoading(false);
      };

      window.payhere.onError = function (error) {
        alert("Payment Error: " + error);
        setLoading(false);
      };

      // 6. Trigger Popup
      window.payhere.startPayment(payment);

    } catch (error) {
      console.log("Payment Error Object:", error);
      console.log("Error Message:", error.message);

      if (error.response) {
          console.log("Response Status:", error.response.status);
          console.log("Response Data:", error.response.data);
      }

      alert("Payment failed. Check console.");
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const text = `SRI LANKA POLICE - PAYMENT RECEIPT\nReference: ${state.fine.referenceNumber}\nAmount: Rs.${state.fine.amount}\nStatus: PAID ONLINE\nDate: ${new Date().toLocaleString()}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${state.fine.referenceNumber}.txt`;
    link.click();
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center">
        
        {viewState === "checkout" && (
          <div className="animate-in fade-in zoom-in duration-300">
            <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
              <CreditCard size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Secure Checkout</h2>
            <p className="text-slate-500 text-sm mb-6">Ref: #{state.fine.referenceNumber}</p>
            
            <div className="text-4xl font-black text-slate-900 mb-8">
              {Number(state.fine.amount).toLocaleString()} <span className="text-sm text-slate-400 font-bold tracking-widest">LKR</span>
            </div>

            {isAlreadyPaid ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="bg-green-50 border border-green-200 text-green-700 py-4 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-sm">
                  <CheckCircle2 size={24} />
                  This fine is already paid
                </div>
                <button 
                  onClick={() => navigate("/")}
                  className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition"
                >
                  Return Home <ArrowRight size={20}/>
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex justify-center items-center gap-3 disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <> <Loader2 className="animate-spin" /> Processing... </>
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                  <ShieldCheck size={14} className="text-green-500" /> Powered by PayHere
                </div>
              </>
            )}
          </div>
        )}

        {viewState === "success" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <CheckCircle2 size={48} strokeWidth={3} />
            </div>
            <h2 className="text-2xl font-black text-slate-800">Payment Successful!</h2>
            <p className="text-slate-500 text-sm mt-2">Thank you. Your fine record has been updated.</p>
            
            <div className="mt-6 bg-slate-50 inline-block px-4 py-2 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
              PayID: <span className="text-slate-900">{orderId || "N/A"}</span>
            </div>

            <div className="mt-10 space-y-3">
              <button 
                onClick={handleDownload}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
              >
                <FileText size={20}/> Download Receipt
              </button>
              <button 
                onClick={() => navigate("/")}
                className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition"
              >
                Return Home <ArrowRight size={20}/>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
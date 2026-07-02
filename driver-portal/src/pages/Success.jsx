import { CheckCircle2, FileText, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Success() {
  const { state } = useLocation();
  const fine = state?.fine;
  const payment = state?.payment;

  return (
    <div className="max-w-md mx-auto text-center py-10">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-50">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-6 rounded-full text-green-600 animate-bounce">
            <CheckCircle2 size={60} strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-2">
          Payment Confirmed
        </h2>
        <p className="text-slate-500 mb-4 text-lg">
          Your fine has been successfully settled.
        </p>

        {fine ? (
          <div className="bg-slate-50 rounded-3xl p-6 text-left mb-8">
            <div className="flex justify-between text-sm text-slate-600 mb-3">
              <span>Reference</span>
              <span className="font-semibold text-slate-900">
                #{fine.referenceNumber}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-3">
              <span>Amount Paid</span>
              <span className="font-semibold text-slate-900">
                Rs. {fine.amount}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-600 mb-3">
              <span>Violation</span>
              <span className="font-semibold text-slate-900">
                {fine.category}
              </span>
            </div>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Status</span>
              <span className="font-semibold text-green-600">
                {payment?.status || "PAID"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-500 mb-8">
            No payment details available. Please return home and restart the
            payment process.
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={() => window.print()}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
          >
            <FileText size={20} /> Download Digital Receipt
          </button>
          <Link
            to="/"
            className="w-full border-2 border-slate-100 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 transition"
          >
            Return Home <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

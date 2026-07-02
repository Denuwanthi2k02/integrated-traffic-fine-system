import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Info } from 'lucide-react';
import API from '../services/api';

export default function Lookup() {
  const [ref, setRef] = useState('');
  const [cat, setCat] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await API.get(`/driver/fines/search?ref=${ref}&cat=${cat}`);
      navigate('/payment', { state: { fine: res.data } });
    } catch (err) {
      alert("Fine not found. Check reference number and category.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-black text-slate-900 mb-2">Settle Your Fine Online</h2>
        <p className="text-slate-500">Fast, secure, and direct payment to the Sri Lanka Police Department.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-700 mb-2">
            <Info size={24} />
            <p className="text-sm">Please check the top-right corner of your physical fine sheet for the Reference Number.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fine Reference No.</label>
            <input required type="text" placeholder="e.g. SLP-882291" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setRef(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Fine Category</label>
            <select required className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-600" onChange={e => setCat(e.target.value)}>
              <option value="">Select Category</option>
              <option value="SPEED">Speeding</option>
              <option value="DRUNK">Drunk Driving</option>
              <option value="LICENSE">Invalid License</option>
            </select>
          </div>
          <button className="md:col-span-2 bg-slate-900 text-white py-5 rounded-2xl font-bold text-xl flex justify-center gap-3 hover:bg-slate-800 transition shadow-lg">
            <Search /> Search My Fine
          </button>
        </form>
      </div>
    </div>
  );
}
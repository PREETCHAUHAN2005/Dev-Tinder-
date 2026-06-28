import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Base_Url } from "../utils/constants";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(Base_Url + "/premium/verify", {
        withCredentials: true,
      });
      if (res.data.isUserPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error("Verification failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      const order = await axios.post(
        Base_Url + "/payment/create",
        { type },
        { withCredentials: true }
      );
      
      const { amount, currency, id: orderId } = order.data.order;
      const keyId = order.data.keyId;

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: "DevTinder",
        description: `${type.toUpperCase()} Membership Payment`,
        image: "https://th.bing.com/th/id/OIP.AUXJMk0cIxLoEeaAeRLlPgHaHa?rs=1&pid=ImgDetMain",
        order_id: orderId,
        theme: {
          color: type === "gold" ? "#F59E0B" : "#6B7280",
        },
        handler: async (response) => {
          // After successful payment, verify status
          await verifyPremiumUser();
        },
        modal: {
          ondismiss: function () {
            console.log("Checkout form closed");
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay order creation failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-ring loading-lg text-pink-500"></span>
      </div>
    );
  }

  if (isUserPremium) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass-panel text-center rounded-3xl border border-slate-700/50 shadow-2xl bg-[#121620]/80">
        <span className="text-6xl">👑</span>
        <h1 className="text-3xl font-extrabold text-amber-400 mt-4 font-Outfit">Premium Active</h1>
        <p className="text-slate-300 mt-2 text-sm leading-relaxed">
          You are currently a premium subscriber. Enjoy unlimited swiping, custom badges, and exclusive features!
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 font-Outfit">
          Upgrade to <span className="bg-tinder-gradient bg-clip-text text-transparent">DevTinder Premium</span>
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
          Unlock the full power of networking and matching with elite developer profiles.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        {/* Silver Card */}
        <div className="flex flex-col justify-between p-8 rounded-3xl glass-panel border border-slate-700/40 bg-[#151924]/80 hover:border-slate-600/60 transition-all duration-300 relative overflow-hidden group shadow-xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-500/5 rounded-full blur-xl group-hover:bg-slate-500/10 transition-all"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-300 font-Outfit">Silver Tier</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">3 Months</span>
            </div>
            
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-100 font-Outfit">₹500</span>
              <span className="text-slate-400 text-sm">/ total</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Chat with matches instantly</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>100 connections / day</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusive profile badge</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleBuyClick("silver")}
            className="w-full py-3 rounded-xl font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 hover:text-white hover:bg-slate-750 transition-all duration-200 cursor-pointer shadow-md"
          >
            Buy Silver
          </button>
        </div>

        {/* Gold Card */}
        <div className="flex flex-col justify-between p-8 rounded-3xl glass-panel border border-amber-500/30 bg-[#1c1a1e]/80 hover:border-amber-500/60 transition-all duration-300 relative overflow-hidden group shadow-2xl">
          <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Best Value
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400 font-Outfit">Gold Tier</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/30 text-amber-300 border border-amber-800/40">1 Year</span>
            </div>

            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-100 font-Outfit">₹1,000</span>
              <span className="text-slate-400 text-sm">/ total</span>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Chat with matches instantly</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>1,000 connections / day</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Exclusive profile gold badge</span>
              </li>
              <li className="flex items-center gap-3 text-slate-300 text-sm">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority view on developer feeds</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleBuyClick("gold")}
            className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-350 hover:to-yellow-450 transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.98]"
          >
            Upgrade to Gold
          </button>
        </div>

      </div>
    </div>
  );
};

export default Premium;

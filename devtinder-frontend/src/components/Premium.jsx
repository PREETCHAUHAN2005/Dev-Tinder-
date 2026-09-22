import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Base_Url } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const formatRupees = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const Check = () => (
  <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
  </svg>
);

const Premium = () => {
  const dispatch = useDispatch();
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [membershipType, setMembershipType] = useState(null);
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutError, setCheckoutError] = useState("");
  const [buying, setBuying] = useState("");

  const verifyPremiumUser = async () => {
    try {
      const res = await axios.get(Base_Url + "/premium/verify", {
        withCredentials: true,
      });
      setPlans(res.data.plans || null);
      setMembershipType(res.data.membershipType || null);
      if (res.data.isUserPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error("Verification failed:", err);
      setCheckoutError("Could not load membership details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const handleBuyClick = async (type) => {
    setCheckoutError("");
    setBuying(type);
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
        description: `${type.toUpperCase()} membership`,
        order_id: orderId,
        theme: {
          color: type === "gold" ? "#F59E0B" : "#3444DA",
        },
        handler: async (response) => {
          try {
            const verified = await axios.post(
              Base_Url + "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { withCredentials: true }
            );
            if (verified.data.user) {
              dispatch(addUser(verified.data.user));
            }
            setIsUserPremium(true);
            setMembershipType(verified.data.membershipType || type);
          } catch (verifyError) {
            const message =
              verifyError.response?.data?.error ||
              "Payment could not be verified. If you were charged, refresh this page.";
            setCheckoutError(message);
          }
        },
        modal: {
          ondismiss: function () {
            setBuying("");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setCheckoutError(response?.error?.description || "Payment was not completed.");
        setBuying("");
      });
      rzp.open();
    } catch (err) {
      const message =
        err.response?.data?.error ||
        err.response?.data ||
        "Could not start checkout.";
      setCheckoutError(typeof message === "string" ? message : "Could not start checkout.");
    } finally {
      setBuying("");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-ring loading-lg text-[#3444DA]"></span>
      </div>
    );
  }

  if (isUserPremium) {
    const planName = membershipType === "gold" ? "Gold" : "Silver";
    return (
      <div className="max-w-md mx-auto my-16 p-8 glass-panel text-center rounded-3xl border border-slate-700/50 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-amber-300 mt-2 font-Outfit">{planName} is active</h1>
        <p className="text-slate-300 mt-3 text-sm leading-relaxed">
          Your optional {planName} membership is saved on your profile. Feed, matching, and chat stay available either way.
        </p>
      </div>
    );
  }

  const silverPrice = plans?.silver != null ? formatRupees(plans.silver) : "";
  const goldPrice = plans?.gold != null ? formatRupees(plans.gold) : "";

  return (
    <div className="max-w-4xl mx-auto my-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 font-Outfit">
          Upgrade to <span className="bg-tinder-gradient bg-clip-text text-transparent">DevTinder Premium</span>
        </h1>
        <p className="text-slate-400 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
          DevTinder is free. Feed, matching, and chat do not require a plan. Premium is optional and saves a Silver or Gold membership on your profile through Razorpay.
        </p>
      </div>

      {checkoutError && (
        <p className="mb-6 text-center text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
          {checkoutError}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <div className="flex flex-col justify-between p-8 rounded-3xl glass-panel border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 relative overflow-hidden shadow-xl">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-300 font-Outfit">Silver</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">Optional</span>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-100 font-Outfit">{silverPrice}</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Silver badge on your profile</span></li>
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Membership saved for later premium features</span></li>
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Feed, matching, and chat stay free</span></li>
            </ul>
          </div>
          <button
            onClick={() => handleBuyClick("silver")}
            disabled={Boolean(buying)}
            className="w-full py-3 rounded-xl font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-500 hover:text-white hover:bg-slate-750 transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50"
            type="button"
          >
            {buying === "silver" ? "Opening checkout..." : "Choose Silver"}
          </button>
        </div>

        <div className="flex flex-col justify-between p-8 rounded-3xl glass-panel border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">
            Best Value
          </div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-amber-400 font-Outfit">Gold</h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/30 text-amber-300 border border-amber-800/40">Optional</span>
            </div>
            <div className="flex items-baseline gap-1 mb-8">
              <span className="text-4xl font-black text-slate-100 font-Outfit">{goldPrice}</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Gold badge on your profile</span></li>
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Membership saved for later premium features</span></li>
              <li className="flex items-center gap-3 text-slate-300 text-sm"><Check /><span>Feed, matching, and chat stay free</span></li>
            </ul>
          </div>
          <button
            onClick={() => handleBuyClick("gold")}
            disabled={Boolean(buying)}
            className="w-full py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-350 hover:to-yellow-400 transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10 active:scale-[0.98] disabled:opacity-50"
            type="button"
          >
            {buying === "gold" ? "Opening checkout..." : "Choose Gold"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;

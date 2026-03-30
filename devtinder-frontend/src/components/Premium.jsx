import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Base_Url } from "../utils/constants";
import user from "../../../backend/src/models/user";
// import payment from "../../../backend/src/models/payment";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  
  useEffect(() => {
    verifyPremiumUser();
  },[]);

  const verifyPremiumUser = async () => {
    const res = await axios.get(Base_Url + "/premium/verify", {
      withCredentials: true,
    });


  
    if (res.data.isUserPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      Base_Url + "/payment/create",
      { type },
      { withCredentials: true }
    );
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.data.order.amount,
      currency: order.data.order.currency,
      name: "DevTinder",
      description: "Membership Payment",
      image: "/logo.png",
      order_id: order.data.order.id,

      // prefill: {
      //   name: notes.firstName + " " + notes.lastName,
      //   email: notes.emailId,
      //   contact: notes.contact,
      // },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      handler: verifyPremiumUser,
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  return isUserPremium ? (
    "You are already a premium user"
  ) : (
    <div className="m-10">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid h-70 grow place-items-center">
          <h1 className="text-bold text-3xl">Silver Membership</h1>
          <ul>
            <li>- Chat with Other people</li>
            <li>- 100 conection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 3 Months</li>
          </ul>
          <button
            className="btn btn-secondary"
            onClick={() => handleBuyClick("silver")}
          >
            Buy Silver
          </button>
        </div>
        <div className="divider lg:divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-70 grow place-items-center">
          <h1 className="text-bold text-3xl">Gold Membership</h1>
          <ul>
            <li>- Chat with Other people</li>
            <li>- 1000 conection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 1 year</li>
          </ul>
          <button
            className="btn btn-primary"
            onClick={() => handleBuyClick("gold")}
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;

import React from "react";
import axios from "axios";
import { Base_Url } from "../utils/constants";

const Premium = () => {
  const handleBuyClick = async (type) => {
    const order = await axios.post(
      Base_Url + "/payment/create",
      { type },
      { withCredentials: true }
    );
  };
  return (
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

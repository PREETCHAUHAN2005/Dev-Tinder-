import { Link } from "react-router-dom";
import PageHeading from "./ui/PageHeading";
import StatePanel from "./ui/StatePanel";
import Icon from "./ui/Icon";
import { useEffect, useState } from "react";
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

  if (loading) return <section className="dt-page"><StatePanel loading title="Loading memberships" description="Checking your membership details." icon="star" /></section>;

  if (isUserPremium) {
    const planName = membershipType === "gold" ? "Gold" : "Silver";
    return <section className="dt-page dt-membership-active"><div className="dt-panel"><span className="dt-active-plan-icon"><Icon name="star" /></span><h1>{planName} membership is active.</h1><p>Your {planName} badge is saved on your profile.</p><Link className="dt-button dt-button-primary" to="/">Back to Discover<Icon name="arrow" /></Link></div></section>;
  }

  const silverPrice = plans?.silver != null ? formatRupees(plans.silver) : "";
  const goldPrice = plans?.gold != null ? formatRupees(plans.gold) : "";

  return (
    <section className="dt-page dt-membership-page">
      <PageHeading title="Membership" description="Discovery, connections, and chat are free. An optional membership adds a badge to your profile." />
      {checkoutError && <p className="dt-alert dt-alert-error" role="alert"><Icon name="alert" />{checkoutError}{!plans && <button type="button" onClick={() => { setCheckoutError(""); setLoading(true); verifyPremiumUser(); }}>Try again</button>}</p>}
      <div className="dt-membership-grid">
        {[
          { type: "silver", name: "Silver", price: silverPrice },
          { type: "gold", name: "Gold", price: goldPrice },
        ].map((plan) => <article className={`dt-plan-card dt-panel dt-plan-${plan.type}`} key={plan.type}>
          <div className="dt-plan-top"><span className="dt-plan-symbol"><Icon name="star" /></span></div>
          <h2>{plan.name}</h2>
          <p className="dt-plan-price">{plan.price || <span>Price unavailable</span>}</p>
          <div className="dt-plan-rule" />
          <ul><li><Icon name="check" /><span>{plan.name} badge on your profile</span></li></ul>
          <button type="button" className={`dt-button ${plan.type === "gold" ? "dt-button-gold" : "dt-button-secondary"} dt-button-full`} onClick={() => handleBuyClick(plan.type)} disabled={Boolean(buying) || !plan.price}>{buying === plan.type ? "Opening checkout..." : `Choose ${plan.name}`}<Icon name="arrow" /></button>
        </article>)}
      </div>
      <p className="dt-payment-caption"><Icon name="shield" />Checkout is handled by Razorpay.</p>
    </section>
  );
};

export default Premium;

import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./SubscriptionForm.css"; // Import CSS

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionForm = () => {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedFeeType, setSelectedFeeType] = useState(""); // New state for fee type
  const [error, setError] = useState(null);

  const handleAmountChange = (event) => {
    const { value, dataset } = event.target;
    setSelectedAmount(value);
    setSelectedFeeType(dataset.feetype); // Set fee type based on data attribute
    setError(null); // Clear error on new selection
  };

  const handleCheckout = async () => {
    if (!selectedAmount || !selectedFeeType) {
      setError("Please select an amount and fee type.");
      return;
    }

    try {
      const stripe = await stripePromise;

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: parseInt(selectedAmount, 10), // Ensure amount is an integer
            feeType: selectedFeeType, // Send fee type to backend
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const session = await response.json();

      if (session.error) {
        setError(session.error);
        return;
      }

      // Redirect to Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (stripeError) {
        setError(stripeError.message);
      }
    } catch (err) {
      console.error("Error during checkout:", err); // Log the full error for debugging
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="subscription-form">
      <h2>Select Payment Amount</h2>
      <form>
        <label>
          <input
            type="radio"
            name="amount"
            value="200"
            data-feetype="Consulting Fee"
            onChange={handleAmountChange}
            checked={
              selectedAmount === "200" && selectedFeeType === "Consulting Fee"
            }
          />
          2 Euros - <strong>Consulting Fee</strong>
        </label>
        <label>
          <input
            type="radio"
            name="amount"
            value="200"
            data-feetype="Documentation Fee"
            onChange={handleAmountChange}
            checked={
              selectedAmount === "200" &&
              selectedFeeType === "Documentation Fee"
            }
          />
          2 Euros - <strong>Documentation Fee</strong>
        </label>
        {error && <p className="error-message">{error}</p>}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!selectedAmount || !selectedFeeType}
        >
          Go to Checkout
        </button>
      </form>
    </div>
  );
};

export default SubscriptionForm;

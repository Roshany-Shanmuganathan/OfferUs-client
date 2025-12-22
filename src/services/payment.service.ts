import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export const paymentService = {
  /**
   * Create a checkout session and redirect to Stripe
   */
  async createCheckoutSession(planName: string, price: number) {
    try {
      const response = await axios.post(
        `${API_URL}/payment/create-checkout-session`,
        { planName, price },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { url } = response.data.data;
        // Redirect to Stripe Checkout page
        window.location.href = url;
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Verify a completed checkout session
   */
  async verifyPayment(sessionId: string) {
    try {
      const response = await axios.post(
        `${API_URL}/payment/verify-payment`,
        { sessionId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
};

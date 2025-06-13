import Stripe from "stripe";
import type { Stripe as StripeJs } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Client-side Stripe instance
let stripePromise: Promise<StripeJs | null> | null = null;
export const getStripe = (): Promise<StripeJs | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

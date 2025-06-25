import Stripe from "stripe";
import type { Stripe as StripeJs } from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY)
  throw new Error("Stripe secret key is not defined in environment variables");

const NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  throw new Error(
    "Stripe publishable key is not defined in environment variables"
  );

// Server-side Stripe instance
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

// Client-side Stripe instance
let stripePromise: Promise<StripeJs | null> | null = null;
export const getStripe = (): Promise<StripeJs | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

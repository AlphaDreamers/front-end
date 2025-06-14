"use server";

import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function createStripeCheckoutSession(
  orderId: string,
  price: number
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    // Get the order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        package: {
          include: {
            gig: true,
          },
        },
        buyer: true,
        seller: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.buyerId !== session.user.id) {
      throw new Error("Unauthorized");
    }

    if (order.status !== "PENDING_PAYMENT") {
      throw new Error("Order is not pending payment");
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: order.package.gig.title,
              description: order.package.title,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders/${orderId}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/orders`,
      metadata: {
        orderId: orderId,
        buyerId: session.user.id,
        sellerId: order.sellerId,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: orderId },
      data: {
        stripePaymentIntent: checkoutSession.id,
        paymentMethod: "STRIPE",
      },
    });

    return { checkoutUrl: checkoutSession.url };
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

export async function handleStripeWebhook(body: string, signature: string) {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.error("Order ID not found in session metadata");
          return { received: true };
        }
        if (!session.metadata?.buyerId || !session.metadata?.sellerId) {
          console.error("Buyer or Seller ID not found in session metadata");
          return { received: true };
        }

        // Update order status to PAID
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            updatedAt: new Date(),
          },
        });

        break;

      case "payment_intent.payment_failed":
        // Handle failed payment
        const paymentIntent = event.data.object;
        console.log("Payment failed:", paymentIntent.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error("Error handling Stripe webhook:", error);
    throw error;
  }
}

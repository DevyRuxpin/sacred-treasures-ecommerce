import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: unknown) {
    console.error(`Webhook signature verification failed:`, err instanceof Error ? err.message : String(err))
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const metadata = session.metadata

        if (!metadata) {
          console.error("No metadata found in checkout session")
          break
        }

        // Create order in database
        const order = await prisma.order.create({
          data: {
            orderNumber: `ST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            status: "CONFIRMED",
            subtotal: parseFloat(metadata.subtotal),
            taxAmount: parseFloat(metadata.taxAmount),
            shippingAmount: parseFloat(metadata.shippingAmount),
            discountAmount: 0,
            total: parseFloat(metadata.total),
            paymentStatus: "PAID",
            paymentMethod: "stripe",
            paymentIntentId: session.payment_intent as string,
            shippingAddress: (session as any).shipping_details?.address as any || {},
            billingAddress: session.customer_details?.address as any || {},
            userId: metadata.userId,
            items: {
              create: JSON.parse(metadata.items).map((item: { productId: string; variantId?: string; quantity: number; price: number }) => ({
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                price: item.price,
                total: item.price * item.quantity,
              })),
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })

        // Update product quantities
        for (const item of JSON.parse(metadata.items)) {
          await prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: {
                decrement: item.quantity,
              },
            },
          })
        }

        console.log(`Order created: ${order.orderNumber}`)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.log(`Payment failed: ${paymentIntent.id}`)
        break
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        console.log(`Payment succeeded: ${paymentIntent.id}`)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

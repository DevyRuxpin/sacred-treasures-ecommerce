import { NextRequest, NextResponse } from "next/server"
import { stripe, formatAmountForStripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Stripe from "stripe"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "No items in cart" },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          variants: item.variantId ? {
            where: { id: item.variantId }
          } : false,
        },
      })

      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      const price = item.variantId && product.variants?.[0]?.price
        ? product.variants[0].price
        : product.price

      const itemTotal = Number(price) * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: product.shortDescription || undefined,
            images: product.images ? [product.images] : [],
          },
          unit_amount: formatAmountForStripe(Number(price), 'usd'),
        },
        quantity: item.quantity,
      })
    }

    // Calculate shipping and tax
    const shippingAmount = subtotal > 50 ? 0 : 10
    const taxAmount = subtotal * 0.08
    const total = subtotal + shippingAmount + taxAmount

    // Add shipping as line item if applicable
    if (shippingAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
            description: 'Standard shipping',
          },
          unit_amount: formatAmountForStripe(shippingAmount, 'usd'),
        },
        quantity: 1,
      })
    }

    // Add tax as line item
    if (taxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
            description: 'Sales tax',
          },
          unit_amount: formatAmountForStripe(taxAmount, 'usd'),
        },
        quantity: 1,
      })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'afterpay_clearpay'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
      customer_email: session.user.email || undefined,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU'],
      },
      billing_address_collection: 'required',
      metadata: {
        userId: session.user.id,
        items: JSON.stringify(items),
        subtotal: subtotal.toString(),
        shippingAmount: shippingAmount.toString(),
        taxAmount: taxAmount.toString(),
        total: total.toString(),
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: checkoutSession.id,
        url: checkoutSession.url,
      },
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create payment session" },
      { status: 500 }
    )
  }
}

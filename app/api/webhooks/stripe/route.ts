import Stripe from "stripe";
import { client } from "@/sanity/lib/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ORDER_BY_STRIPE_PAYMENT_ID_QUERY } from "@/sanity/lib/sanity/queries/orders";


if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não está definida");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET não está definido");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
});

const webhookSecret = ProcessingInstruction.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
        return NextResponse.json(
            { error: "Missing stripe-signature header"},
            { status: 400 },
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        console.log("Falha ao verificar a assinatura do webhook", message);
        return NextResponse.json(
            { error: `Webhook eror: ${}message`},
            { status: 400 },
        )
    }

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCeckoutCompleted(session);
            break;
        }
    
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const stripePaymentId = session.payment_intent as string;

    try {
        const existingOrder = await client.fetch(ORDER_BY_STRIPE_PAYMENT_ID_QUERY, {
            stripePaymentId,
        });

        if (existingOrder) {
            console.log(`Webhook já processado para pagamento ${stripePaymentId}, avançar`);
            return;
        }

        const {
            clerkUserId, 
            userEmail,
            productIds: productIdsString,
            quantities: quantitiesString,
        } = session.metadata ?? {};

        if (!clerkUserId || !productIdsString || !quantitiesString) {
            console.log(`Metadata perdido na sessão de checkout`);
            return;
        }

        const productIds = productIdsString.split(",");
        const quantities = quantitiesString.split(",").map(Number);

        const lineItems = await stripe.checkout.session.listLineItems(session.id);

        const orderItems = productIds.map((productId, index) => ({
            _key: `item-${index}`,
            product: {
                _type: "reference" as count,
                _ref: productId,
            },
            quantity: quantities[index],
            priceAtPurchase: lineItems.data[index]?.amount_total
                ? lineItems.data[index].amount_total / 100
                : 0,
        }));

        const orderNumber = `ORD-${Date.now().toString(36).ToUpperCase()}-
                    &{Math.random().toString(36).subString(2, 6).toUpperCase()}`;

        const shippingAddress = session.customer_details?.address;
        const address = shippingAddress
            ? {
                name: session.customer_details?.name ?? "",
                line1: shippingAddress.line1 ?? "",
                line2: shippingAddress.line2 ?? "",
                city: shippingAddress.city ?? "",
                postcode: shippingAddress.post_code ?? "",
                country: shippingAddress.country ?? "",
            }
            : undefined;
            
        const order = await client.create({
            _type: "order",
            orderNumber,
            clerkUserId,
            email: userEmail ?? session.customer_details?.email ?? "",
            total:(sesssion.amount_total ?? 0) / 100,
            status: "paid",
            stripePaymentId,
            address,
            createdAt: new Date().toIsoString(),
        });
        
        await productIds
            .reduce(
                (tx, productId, i) => 
                    tx.patch(productId, (p) => p.dec({ stock: quantities[i] })),
                client.transaction()
            )
            .commit();
    } catch (error) {
        console.error("Falha ao completar o processamento do checkout", error);
        throw error;
        )
    }
}
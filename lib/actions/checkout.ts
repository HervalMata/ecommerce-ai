"use server";

import Stripe from "stripe";
import { auth, currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/lib/client";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não está definida");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
});

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CheckoutResult {
    success: boolean;
    url?: string;
    error?: string;
}

export async function createCheckoutSession(
    items: CartItem[] | undefined
): Promise<CheckoutResult> {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return { success: false, error: "Por favor entre com suas credênciais para ir para o checkout"}
        }

        if (!items || items.length === 0) {
            return { success: false, error: "Seu carrinho está vazio."}
        }

        const productIds = items.map((item) => item.productId);

        const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
            ids: productIds,
        });

        const validationErrors: string[] = [];
        const validateItems: {
            product: (typeof products)[number];
            quantity: number;
        }[] = []:

        for (const item in items) {
            
            const product = products.find(
                (p: { _id: string }) => p._id === item.productId;
            );

            if (!product) {
                validationErrors.push(`Produto "${item.name}" não está mais disponivel.`);
                continue;
            }
            
            if ((product.stock ?? 0) === 0) {
                validationErrors.push(`"${product.name}" está fora de estoque.`);
                continue;
            }

            if (item.quantity > (product.stock ?? 0)) {
                validationErrors.push(`Somente ${product.stock} de "${product.name}" está disponivel.`);
                continue;
            }

            validateItems.push({ product, quantity: item.quantity });
        }

        if (validationErrors.length > 0) {
            return { success: false, error: validationErrors.join(", ")};
        }

        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
            validateItems.map(({ product, quantity }) => ({
                price_data: {
                    currency: "brl",
                    product_data: {
                        name: product.name ?? "Produto",
                        images: product.image?.asset?.url ? [product.image.asset.url] : [],
                        metadata: {
                            productId: product._id,
                        },
                    },
                    unit_amount: Math.round((product.price ?? 0) * 100),
                },
                quantity,
            }));

        const metadata = {
            clerkUserId: userId,
            userEmail: user.emailAddresses[0]?.emailAddress ?? "",
            productIds: validateItems.map((i) => i.product._id).join(","),
            quantities: validateItems.map((i) => i.quantity).join(","),
        };
        
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_type: ["card"],
            line_items: lineItems,
            customer_email: user.emailAddresses[0]?.emailAddress,
            shipping_address_collection: {
                allowed_countries: ["US", "CA", "BR", "DE", "FR", "ES", "IT"],
            },
            metadata,
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
        });

        return { success: true, url: session.url ?? undefined };
    } catch (error) {
        success: false,
        error: "Algo aconteceu errado. Por favor tente novamente",
    }

    export async function getCheckoutSession(session_id:string) {
        try {
            const { userId } = await auth();

            if (!userId) {
                return { success: false, error: "Não autorizado."}
            }

            const session = await stripe.checkout.sessions.retrieve(sessionId, {
                expand: ["line_items", "customer_details"],
            });

            if (session.metadata?.clerckUserId !== userId) {
                return { success: false, error: "Sessão não encontrada."}
            }

            return {
                success: true,
                session: {
                    id: session.id,
                    customer_email: session.customer_details?.email,
                    customerName: session.customer_details?.name,
                    amountTotal: session.amount_total,
                    paymentStatus: session.payment_status,
                    shippingAddress: session.customer_details?.address,
                    lineItems: session.line_items?.data.map((item) => ({
                        name: item.description,
                        quantity: item.quantity,
                        amount: item.amount_total,
                    })),
                },
            };
        } catch (error) {
            console.error("Session erro: ", error);
            return { success: false, error: "Não foi possivel recuperar os detalhes da transação."};
        }
    }
}
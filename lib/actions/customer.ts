"use server";

import Stripe from "stripe";
import { client, writeClient } from "@/sanity/lib/client";
import { CUSTOMER_BY_EMAIL_QUERY } from "@/sanity/lib/sanity/queries/customers";

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY não está definida");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover",
});

export async function getOrCreateStripeustomer(
    email: string,
    name: string,
    clerkUserId: string
): Promise<{ stripeCustomerId: string; sanityCustomerId: string } | undefined> {
    const existingCustomer = await client.fetch(CUSTOMER_BY_EMAIL_QUERY, {
        email,
    });

    if (existingCustomer?.stripeCustomerId) {
        return {
            stripeCustomerId: existingCustomer.stripeCustomerId,
            sanityCustomerId: existingCustomer._id,
        };
    }

    const existingStripeCustomers = await stripe.customers.list({
        email,
        limit: 1,
    });

    let stripeCustomerId: string;

    if (existingStripeCustomers.data.length > 0) {
        stripeCustomerId = existingStripeCustomers.data[0].id;
    } else {
        const newStripeCustomer = await stripe.customers.create({
            email,
            name,
            metadata: {
                clerkUserId,
            },
        });
        stripeCustomerId = newStripeCustomer.id;
    }

    if (existingCustomer) {
        await writeClient
            .patch(existingCustomer._id)
            .set({ stripeCustomerId, clerkUserId, name })
            .commit();
        return {
            stripeCustomerId,
            sanityCustomerId: existingCustomer._id,
        };    
    }

    const newSanityCustomer = await writeClient.create({
        _type: "customer",
        email,
        name,
        clerkUserId,
        stripeCustomerId,
        createdAt: new Date().toISOString(),
    });

    return {
        stripeCustomerId,
        sanityCustomerId: newSanityCustomer._id,
    };
}
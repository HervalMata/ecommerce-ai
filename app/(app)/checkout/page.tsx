import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CheckoutClient } from "./CheckoutClient";

export const metadata = {
    title: "Checkout | Loja de Laços",
    description: "Complete sua compra",
};

export default async function CheckoutPage() {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/checkout");
    }

    return <CheckoutClient />
}

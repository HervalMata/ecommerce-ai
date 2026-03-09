import { CheckoutClient } from "./CheckoutClient";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Checkout | Loja de Laços",
    description: "Complete sua compra",
};

export default async function CheckoutPage() {
    return <CheckoutClient />
}

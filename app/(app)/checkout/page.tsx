import { CheckoutClient } from "./CheckoutClient";

export const metadata = {
    title: "Checkout | Loja de Laços",
    description: "Complete sua compra",
};

export default async function CheckoutPage() {
    return <CheckoutClient />
}

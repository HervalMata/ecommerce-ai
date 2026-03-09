import { redirect } from "next/navigation";
import SuccessClient from "@/app/(app)/checkout/success/SuccessClient";
import {getCheckoutSession} from "@/lib/actions/checkout";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: "Comfirmação de Ordem | Loja de Laços",
    description: "sua ordem da sua compra foi processada com sucesso",
};

interface SuccessPageProps {
    searchParams: Promise<{ session_id?: string}>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
    const params = await searchParams;
    const sessionId = params.session_id;

    if (!sessionId) {
        redirect("/");
    }

    const result = await getCheckoutSession(sessionId);

    if (!result.success || !result.session) {
        redirect("/");
    }

    // @ts-ignore
    return <SuccessClient session={result.session} />
}

"use client";

import { useCartActions } from "@/lib/store/cart-store-provider";
import { useEffect } from "react";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SuccessClientProps {
    session: {
        id: string;
        customerEmail?: string | null;
        customerName?: string | null;
        amountTotal?: number | null;
        paymentStatus: string;
        shippingAddress?: {
            line1?: string | null;
            line2?: string | null;
            city?: string | null;
            state?: string | null;
            postal_code?: string | null;
            country?: string | null;
        } | null;
        lineItems?: {
            name?: string | null;
            quantity?: string | null;
            amount: number;
        }
    }
}

export default async function SuccessClient({ session }:SuccessClientProps) {
    const { clearCart } = useCartActions();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    const address = session.shippingAddress;

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Ordem Comfirmada!
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Obrigado a você pela sua compra. Nós&pos; lhe enviaremos uma confirmação{" "}
                    <span className="font-medium">
                        {session.customerEmail}
                    </span>
                </p>
            </div>

            {/* Order Details */}
            <div className="mt-10 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                        Detalhes da Ordem
                    </h2>
                </div>

                <div className="px-6 py-4">
                    {/* Items */}
                    {
                        // @ts-ignore
                        session.lineItems && session.lineItems.length > 0 && (
                        <div className="space-y-3">
                            {
                                // @ts-ignore
                                session.lineItems.map((item: any) => (
                                <div
                                    key={`${item.name}-${item.quantity}-${item.amount}`}
                                    className="flex justify-between text-sm"
                                >
                                    <span className="text-zinc-600 dark:text-zinc-400">
                                        {item.name} * {item.quantity}
                                    </span>
                                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                        R$ {item.amount.toLocaleString("pt-BR")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Total */}
                    <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                        <div className="flex justify-between text-base font-semibold">
                            <span className="text-zinc-900 dark:text-zinc-100">
                                Total
                            </span>
                            <span className="text-zinc-900 dark:text-zinc-100">
                                R$ {((session.amountTotal ?? 0) / 100).toLocaleString("pt-BR")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Shipping Address */}
                {address && (
                    <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                        <h3 className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Entrga Para
                        </h3>
                        <div>
                            {session.customerName && <p>{session.customerName}</p>}
                            {address.line1 && <p>{address.line1}</p>}
                            {address.line2 && <p>{address.line2}</p>}
                            <p>
                                {[address.city, address.state, address.postal_code]
                                    .filter(Boolean)
                                    .join(", ")}
                            </p>
                            {address.country && <p>{address.country}</p>}
                        </div>
                    </div>
                )}

                {/* Payment Status */}
                <div className="border-t border-zinc-200 px-6 py-4 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-zinc-400" />
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            Status do Pagamento:{" "}
                            <span className="font-medium capitalize text-green-600">
                                {session.paymentStatus}
                            </span>
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild variant="outline">
                    <Link href="/orders">
                        Veja Suas Ordens
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/">
                        Continue Comprando
                    </Link>
                </Button>
            </div>
        </div>
    );
}

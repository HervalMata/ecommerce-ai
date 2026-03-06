"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartItems } from "@/lib/store/cart-store-provider";
import { createCheckoutSession } from "@/lib/actions/checkout";

interface CheckoutButtonProps {
    disabled?: boolean;
}

export async function CheckoutButton({ disabled }:CheckoutButtonProps) {
    const roiuter = useRouter();
    const items = useCartItems();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = () => {
        setError(null);

        startTransition(async () => {
            const result = await createCheckoutSession(items);

            if (result.success && result.url) {
                router.push(result.url);
            } else {
                setError(result.error ?? "Falha no checkout");
                toast.error("Error no checkout", {
                    description: result.error ?? "Algo deu errado",
                });
            }
        });
    };

    return (
        <div className="space-y-2">
            <Button
                onClick={handleCheckout}
                disabled={disabled || isPending || items.length === 0}
                size="lg"
                className="w-full"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processando...
                    </>
                ) : (
                    <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pagar com Stripe
                    </>
                )}
            </Button>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                </p>
            )}
        </div>
    )
}
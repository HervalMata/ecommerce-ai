"use client"

import {useTotalItems, useTotalPrice} from "@/lib/store/cart-store-provider";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface CartSummaryProps {
    hasStockIssues?: boolean;
}

export function CartSummary({ hasStockIssues }: CartSummaryProps) {
    const totalPrice = useTotalPrice();
    const totalItems = useTotalItems();

    if (totalItems === 0) return null;

    return (
        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex justify-between text-base font-medium text-zinc-900 dark:text-zinc-100">
                <span>Subtotal</span>
                <span>R$ {totalPrice.toLocaleString("pt-BR")}</span>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Taxa de Entrega será calculada no checkout
            </p>
            <div className="mr-4">
                {hasStockIssues ? (
                    <Button disabled className="w-full">
                        Resolva erros de estoque para ir para o checkout
                    </Button>
                ) : (
                    <Button asChild className="w-full">
                        <Link href="/checkout">Checkout</Link>
                    </Button>
                )}
            </div>
            <div className="mt-3 text-center">
                <Link
                    href="/"
                    className="text-sm font-medium text-zinc-700 hover:text-zinc-900 
                    dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                    Continue Comprando →
                </Link>    
                
            </div>
        </div>
    )
}

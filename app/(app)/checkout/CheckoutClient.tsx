"use client";

import { useCartStock } from "@/lib/hooks/useCartStock";
import {
    useCartItems,
    useTotalItems,
    useTotalPrice
} from "@/lib/store/cart-store-provider";
import { ArrowLeft, ShoppingBag, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { CheckoutButton } from "@/components/app/CheckoutButton";

export function CheckoutClient() {
    const items = useCartItems();
    const totalPrice = useTotalPrice();
    const totalItems = useTotalItems();
    const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <ShoppingBag className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                    <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        Seu carrinho está vazio.
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Adicione alguns itens para seu carrinho antes de ir para o checkout.
                    </p>
                    <Button
                        asChild
                        className="mt-8"
                    >
                        <Link href="/">
                            Continue comprando
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue comprando
                </Link>
                <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Checkout
                </h1>
            </div>

            <div className="grid gap-8 lg:grid-cols-5">
                {/* Cart Items */}
                <div className="lg:col-span-3">
                    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Resumo da compra ({totalItems} itens)
                            </h2>
                        </div>

                        {/* Stock Issues Warning */}
                        {hasStockIssues && !isLoading && (
                            <div className="mx-6 nt-4 flex items-center gap-2 rounded-lg border
                                border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800
                                dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                                <AlertTriangle className="h-5 w-5 shirink-0" />
                                <span>
                                    Alguns itens tem problemas de estoque. Por favor atualize seu carrinho antes de continuar.
                                </span>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                                <span className="ml-2 text-sm text-zinc-500">
                                    Verificando estoque...
                                </span>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {items.map((item) => {
                                const stockInfo = stockMap.get(item.productId);
                                const hasIssue = stockInfo?.isOutOfStock || stockInfo?.exceedStock;

                                return (
                                    <div
                                        key={item.productId}
                                        className={
                                            `flex gap-4 px-6 py-4 ${
                                                hasIssue ? "bg-red-50 dark:bg-red-950/20"
                                                : ""
                                            }`
                                        }
                                    >
                                        {/* Image */}
                                        <div className="relative h-20 w-20 shirink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                                            {item.image ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                                                    Nenhuma Imagem
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                                                <h3>
                                                    {item.name}
                                                </h3>
                                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                                    Quantidade: {item.quantity}
                                                </p>
                                                {stockInfo?.isOutOfStock && (
                                                    <p className="mt-1 text-sm font-medium text-red-600">
                                                        Fora de Estoque
                                                    </p>
                                                )}
                                                {stockInfo?.exceedStock && !stockInfo.isOutOfStock && (
                                                    <p className="mt-1 text-sm font-medium text-amber-600">
                                                        Somente {stockInfo.currentStock} disponivel.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                Rs {(item.price * item.quantity).toLocaleString("pt-BR")}
                                            </p>
                                            {item.quantity > 1 && (
                                                <p className="text-sm text-zinc-500">
                                                    Rs {item.price.toLocaleString("pt-BR")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Order Total & Checkout */}
                <div className="lg:col-span-2">
                    <div className="sticky top-24 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
                        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Resumo do Pagamento
                        </h2>

                        <div className="mt-6 space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Subtotal
                                </span>
                                <span className="text-zinc-900 dark:text-zinc-100">
                                    R$ {totalPrice.toLocaleString("pt-BR")}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Entrega
                                </span>
                                <span className="text-zinc-900 dark:text-zinc-100">
                                    Caculado no checkout
                                </span>
                            </div>
                            <div className="border-t border-zinc-200 pt-4 dark:border-zinc-800">
                                <div className="flex justify-between text-base font-semibold">
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        Total
                                    </span>
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        R$ {totalPrice.toLocaleString("pt-BR")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <CheckoutButton disabled={hasStockIssues || isLoading} />
                        </div>

                        <p className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                            Você&apos;ll será redirecionado para o stripe checkout seguro
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

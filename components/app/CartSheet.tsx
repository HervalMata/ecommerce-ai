"use client"

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {AlertTriangle, Loader2, ShoppingBag} from "lucide-react";
import {useCartActions, useCartIsOpen, useCartItems, useTotalItems} from "@/lib/store/cart-store-provider";
import {CartSummary} from "@/components/app/CartSummary";
import {CartItem} from "@/components/app/CartItem";
import { useCartStock } from "@/lib/hooks/useCartStock";

export function CartSheet() {
    const items = useCartItems();
    const isOpen = useCartIsOpen();
    const totalItems = useTotalItems();
    const { closeCart } = useCartActions();
    const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

    return (
        <Sheet 
            open={isOpen} 
            onOpenChange={(open) => {
                if (!open) closeCart();
            }}
        >
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Carrinho de Compras ({totalItems})
                        {isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
                        )}
                    </SheetTitle>

                    {items.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center text-center">
                            <ShoppingBag className="h-12 w-12 text-zinc-300 dark:text-zinc-600" />
                            <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                Seu carrinho está vazio
                            </h3>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Adicione alguns itens para começar
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Stock Issues Banner */}
                            {hasStockIssues && !isLoading && (
                                <div className="flex items-center gap-2 rounded-lg border border-amber-200 
                                    bg-amber-50 px-3 py-2 text-sm text-amber-800 
                                    dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
                                    <AlertTriangle className="h-4 w-4 shrink-0" />
                                    <span>
                                        Alguns itens tem erros com o estoque. Por favor reveja antes do checkout.
                                    </span>
                                </div>
                            )}

                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="space-y-2 px-2">
                                    {items.map((item) => (
                                        <CartItem 
                                            key={item.productId} 
                                            item={item} 
                                            stockInfo={stockMap.get(item.productId)}
                                        />
                                    ))}
                                </div>
                            </div>
                            {/* Summary */}
                            <CartSummary hasStockIssues={hasStockIssues} />
                        </>
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

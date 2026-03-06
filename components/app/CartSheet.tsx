"use client"

import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {ShoppingBag} from "lucide-react";
import {useCartActions, useCartIsOpen, useCartItems, useTotalItems} from "@/lib/store/cart-store-provider";
import {CartSummary} from "@/components/app/CartSummary";
import {CartItem} from "@/components/app/CartItem";

export function CartSheet() {
    const items = useCartItems();
    const isOpen = useCartIsOpen();
    const totalItems = useTotalItems();
    const { clearCart } = useCartActions();

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && clearCart()}>
            <SheetContent className="flex w-full flex-col sm:max-w-lg">
                <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Carrinho de Compras ({totalItems})
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
                            {/* Cart Items */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {items.map((item) => (
                                        <CartItem key={item.productId} item={item} />
                                    ))}
                                </div>
                            </div>
                            {/* Summary */}
                            <CartSummary />
                        </>
                    )}
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

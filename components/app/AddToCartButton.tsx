"use client";

import { useCartActions, useCartItem } from "@/lib/store/cart-store-provider";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Minus, Plus, ShoppingBag } from "lucide-react";

interface AddToCardButtonProps {
    productId: string;
    name: string;
    price: number;
    image?: string;
    stock: number;
    className?: string;
}

export function AddToCardButton({
    productId,
    name,
    price,
    image,
    stock,
    className,
}:AddToCardButtonProps) {
    const { addItem, updateQuantity } = useCartActions();
    const cartItem = useCartItem(productId);

    const quantityInCart = cartItem?.quantity ?? 0;
    const isAtMax = quantityInCart >= stock && stock > 0;
    const isOutStock = stock <= 0;

    const handleAdd = () => {
        if (quantityInCart < stock) {
            addItem({ productId, name, price, image }, 1);
            toast.success(`Adicionado ${name}`);
        }
    }

    const handleDecrement = () => {
        if (quantityInCart > 0) {
            updateQuantity(productId, quantityInCart -1);
        }
    }

    if (isOutStock) {
        return (
            <Button disabled variant="secondary" className={cn("w-full", className)}>
                Fora de Estoque
            </Button>
        )
    }

    if (quantityInCart === 0) {
        return (
            <Button onClick={handleAdd} className={cn("w-full", className)}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Adicionar para o carrinho
            </Button>
        )
    }

    return (
        <div className={cn(
            "flex w-full items-center rounded-md border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-white-900"
        )}>
            <Button
                variant="ghost"
                size="icon"
                className="h-10 flex-1 rounded-r-none"
                onClick={handleDecrement}
            >
                <Minus className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center text-sm font-semibold">
                {quantityInCart}
            </span>
            <Button
                variant="ghost"
                size="icon"
                className="h-10 flex-1 rounded-r-none disabled:opacity-20"
                onClick={handleAdd}
                disabled={isAtMax}
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}
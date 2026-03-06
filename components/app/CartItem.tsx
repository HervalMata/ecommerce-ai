"use client"

import type { CartItem as CartItemType } from "@/lib/store/cart-store";
import {useCartActions} from "@/lib/store/cart-store-provider";
import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Minus, Plus, Trash2} from "lucide-react";

interface CartItemProps {
    item: CartItemType;
}

export function CartItem(
    { item }: CartItemProps
) {
    const { updateQuantity, removeItem } = useCartActions();

    return (
        <div className="flex gap-4 py-4">
            {/* Image */}
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
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
            <div className="flex h-full justify-center items-center text-xs text-zinc-400">
                <div className="flex justify-between">
                    <Link
                        href={`/products/${item.productId}`}
                        className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                        {item.name}
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-zinc-400 hover:text-red-500"
                        onClick={() => removeItem(item.productId)}
                    >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remover {item.name}</span>
                    </Button>
                </div>

                <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    R$ {item.price.toLocaleString("pt-BR")}
                </p>

                {/* Quantity Controls */}
                <div className="mt-2 flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Diminiuir Quantidade</span>
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Aumentar Quantidade</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

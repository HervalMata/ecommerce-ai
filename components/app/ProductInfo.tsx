"use client"

import {PRODUCT_BY_SLUG_QUERYResult} from "@/sanity.types";
import {useState} from "react";
import {useCartActions} from "@/lib/store/cart-store-provider";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Check, Minus, Plus, ShoppingBag} from "lucide-react";
import {Button} from "@/components/ui/button";

interface ProductInfoProps {
    product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

export function ProductInfo(
    { product }: ProductInfoProps
) {
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const { addItem, openCart } = useCartActions();

    const isOutOfStock = (product.stock ?? 0) <= 0;
    const imageUrl = product.images?.[0]?.asset?.url;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        for (let i = 0; i < quantity; i++) {
            addItem({
                productId: product._id,
                name: product.name ?? "Produto Desconhecido",
                price: product.price ?? 0,
                image: imageUrl ?? undefined,
            });
        }

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        openCart();
    };

    const incrementQuantity = () => {
        if (quantity < (product.stock ?? 1)) {
            setQuantity((q) => q + 1)
        }
    }

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((q) => q - 1)
        }
    }

    return (
        <div className="flex flex-col">
            {/* Category */}
            {product.category && (
                <Link
                    href={`/?category=${product.category.slug}`}
                    className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                >
                    {product.category.title}
                </Link>
            )}

            {/* Title */}
            <h1 className="mt-2 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {product.name}
            </h1>

            {/* Price */}
            <p className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                R$ {product.price?.toLocaleString("pt-BR")}
            </p>

            {/* Stock Status */}
            <div className="mt-4">
                {isOutOfStock ? (
                    <Badge
                        variant="destructive"
                    >
                        Fora de Estoque
                    </Badge>
                ) : (product.stock ?? 0) <= 5 ? (
                    <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800"
                    >
                        Somente {product.stock} restando
                    </Badge>
                ) : (
                   <Badge
                       variant="secondary"
                       className="bg-green-100 text-amber-800"
                   >
                        Em Estoque
                   </Badge>
                )}
            </div>

            {/* Description */}
            {product.description && (
                <p className="mt-6 text-zinc-600 dark:text-zinc-400">
                    {product.description}
                </p>
            )}

            {/* Metadata */}
            <div className="mt-6 space-y-2 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                {product.material && (
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                            Material
                        </span>
                        <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                            {product.material}
                        </span>
                    </div>
                )}
                {product.color && (
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                            Cor
                        </span>
                        <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                            {product.color}
                        </span>
                    </div>
                )}
                {product.dimensions && (
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                            Dimensões
                        </span>
                        <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                            {product.dimensions}
                        </span>
                    </div>
                )}
                {product.assemblyRequired !== null && (
                    <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400">
                            Assembly
                        </span>
                        <span className="font-medium capitalize text-zinc-900 dark:text-zinc-100">
                            {product.assemblyRequired ? "Requerido": "Não Requerido"}
                        </span>
                    </div>
                )}
            </div>

            {/* Quantity Selector & Add To Cart */}
            <div className="mt-8 space-y-4">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Quantidade
                    </span>
                    <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <button
                            onClick={decrementQuantity}
                            disabled={quantity <= 1 || isOutOfStock}
                            className="p-2 text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span>
                            {quantity}
                        </span>
                        <button
                            onClick={incrementQuantity}
                            disabled={quantity >= (product.stock ?? 1) || isOutOfStock}
                            className="p-2 text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded}
                size="lg"
                className="w-full"
            >
                {isAdded ? (
                    <>
                        <Check className="mr-2 h-5 w-5" />
                        Adicionado ao carrinho
                    </>
                ) : (
                    <>
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        {isOutOfStock ? "Fora de Estoque" : "Adicionar para o carrinho"}
                    </>
                )}
            </Button>
        </div>
    )
}

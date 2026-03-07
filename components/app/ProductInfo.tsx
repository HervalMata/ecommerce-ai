"use client"

import {PRODUCT_BY_SLUG_QUERYResult} from "@/sanity.types";
import {useState, useEffect} from "react";
import {useCartActions, useCartItem} from "@/lib/store/cart-store-provider";
import Link from "next/link";
import {Badge} from "@/components/ui/badge";
import {Check, Minus, Plus, ShoppingBag, ShoppingCart} from "lucide-react";
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
    const cartItem = useCartItem(product._id);
    const totalStock = product.stock ?? 0;
    const quantityInCart = cartItem?.quantity ?? 0;
    const remainingStock = totalStock - quantityInCart;

    const isOutOfStock = totalStock <= 0;
    const allInCart = remainingStock <= 0 && !isOutOfStock;
    const imageUrl = product.images?.[0]?.asset?.url;

    useEffect(() => {
        if (quantity > remainingStock && remainingStock > 0) {
            setQuantity(remainingStock);
        } else if (remainingStock <= 0 && quantity !== 1) {
            setQuantity(1);
        }
    }, [remainingStock, quantity]);

    const handleAddToCart = () => {
        if (isOutOfStock || allInCart) return;

        const quanttyToAdd = Math.min(quantity, remainingStock);

        addItem({
            productId: product._id,
            name: product.name ?? "Produto Desconhecido",
            price: product.price ?? 0,
            image: imageUrl ?? undefined,
        },
            quanttyToAdd
        );
        

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
        setQuantity(1);
        openCart();
    };

    const incrementQuantity = () => {
        if (quantity < remainingStock) {
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
            <div className="mt-4 flex flex-wrap items-center gap-2">
                {isOutOfStock ? (
                    <Badge
                        variant="destructive"
                    >
                        Fora de Estoque
                    </Badge>
                ) : allInCart ? (
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800"
                    >
                        Todos os {totalStock} produtos no seu  
carrinho
                    </Badge>
                ) : remainingStock <= 5 ? (
                    <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-800"
                    >
                        {remainingStock === 1
                            ? "Somente 1 restando"
                            : `Somente ${remainingStock} restando`
                        }
                        
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

            {/* InCart Indicator */}
            {quantityInCart > 0 && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
                    <ShoppingCart className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {quantityInCart} já em seu carrinho
                    </span>
                    <button
                        type="button"
                        onClick={openCart}
                        className="ml-auto text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100"
                    >
                        Ir Para o Carrinho
                    </button>
                </div>

            )}

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
                {!allInCart && !isOutOfStock && (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        Quantidade
                    </span>
                    <div className="flex items-center rounded-lg border border-zinc-200 dark:border-zinc-700">
                        <button
                            type="button"
                            aria-label="Diminuir Quantidade"
                            onClick={decrementQuantity}
                            disabled={quantity <= 1}
                            className="p-2 text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-medium">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            aria-label="Aumentar Quantidade"
                            onClick={incrementQuantity}
                            disabled={quantity >= remainingStock}
                            className="p-2 text-zinc-500 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    </div>
                    {quantity >= remainingStock && remainingStock > 0 && (
                        <span className="text-xs text-zinc-500">Máximo disponível</span>
                    )}
                </div>
                )}
            </div>

            {/* Add to Cart Button */}
            <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdded || allInCart}
                size="lg"
                className="w-full"
            >
                {isAdded ? (
                    <>
                        <Check className="mr-2 h-5 w-5" />
                        Adicionado ao carrinho
                    </>
                ) : allInCart ? (
                    <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Todos no carrinho
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

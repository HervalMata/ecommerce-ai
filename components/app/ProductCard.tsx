"use client"

import type { FILTER_PRODUCTS_BY_NAME_QUERYResult} from "@/sanity.types";
import {useCartActions} from "@/lib/store/cart-store-provider";
import {Card, CardContent, CardFooter} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";

type Product = FILTER_PRODUCTS_BY_NAME_QUERYResult[number];

interface ProductCardProps {
    product: Product;
}

export function ProductCard(
    { product }: ProductCardProps
) {
    const { addItem, openCart } = useCartActions();

    const imageUrl = product.image?.asset?.url;
    const isOutOfStock = (product.stock ?? 0) <= 0;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        addItem({
            productId: product._id,
            name: product.name ?? "Produto desconhecido",
            price: product.price ?? 0,
            image: imageUrl ?? undefined,
        });

        openCart();
    };

    return (
        <Card className="group overflow-hidden border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <Link href={`/products/${product.slug}`}>
                <div className="relative aspect-square overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name ?? "Imagem do Produto"}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-zinc-400">
                            Nenhuma Imagem
                        </div>
                    )}
                    {isOutOfStock && (
                        <Badge
                            variant="destructive"
                            className="absolute right-2 top-2"
                        >
                            Fora de Estoque
                        </Badge>
                    )}
                </div>
            </Link>

            <CardContent className="p-4">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="line-clamp-1 font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300">
                        {product.name}
                    </h3>
                </Link>
                {product.category && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {product.category.title}
                    </p>
                )}
                <p className="mt-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    R$ {product.price?.toLocaleString("pt-BR")}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full"
                    variant={isOutOfStock ? "secondary" : "default"}
                >
                    {isOutOfStock ? "Fora de Estoque" : "Adicionar para o Carrinho"}
                </Button>
            </CardFooter>
        </Card>
    );
}

"use client";

import {DocumentHandle, useDocumentProjection} from "@sanity/sdk-react";
import {TableCell, TableRow} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import {ExternalLink} from "lucide-react";
import {Suspense} from "react";
import {Skeleton} from "@/components/ui/skeleton";
import {Badge} from "@/components/ui/badge";
import {StockInput} from "@/components/admin/StockInput";
import {FeaturedToggle} from "@/components/admin/FeaturedToggle";
import {PublishButton, RevertButton} from "@/components/admin/PublishButton";
import {PriceInput} from "@/components/admin/PriceInput";

interface ProductProjection {
    name: string;
    slug: string;
    price: number;
    stock: number;
    featured: boolean;
    category: {
        title: string;
    } | null;
    image: {
        asset: {
            url: string;
        } | null;
    } | null;
}

export function ProductRowContent(handle: DocumentHandle) {
    const { data } = useDocumentProjection<ProductProjection>({
        ...handle,
        projection: `{
            name,
            "slug": slug.current,
            stock,
            price,
            featured,
            category->{
                title,
            },
            "image": images[0]{
                asset->{
                    url,
                }
            },
        }`,
    });

    if (!data) return null;

    const isLowStock = data.stock > 0 && data.stock <= 5;
    const isOutOfStock = data.stock === 0;

    return (
        <TableRow className="group">
            {/* Image */}
            <TableCell>
                <div className="relative h-12 w-12 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    {data.image?.asset?.url ? (
                        <Image
                            src={data.image.asset.url}
                            alt={data.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                        />
                    ) : (
                        <div className="flex w-full items-center justify-center text-xs text-zinc-400">
                            ?
                        </div>
                    )}
                </div>
            </TableCell>

            {/* Name */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/inventory/${handle.documentId}`}
                        className="font-medium text-zinc-900 hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                    >
                        {data.name || "Produto Sem Titulo"}
                    </Link>
                    {data.slug && (
                        <Link
                            href={`/products/${data.slug}`}
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <ExternalLink className="h-3.5 w-3.5 text-zinc-400 hover:text-zinc-600" />
                        </Link>
                    )}
                </div>
                {data.category && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {data.category.title}
                    </p>
                )}
            </TableCell>

            {/* Price */}
            <TableCell>
                    <Suspense fallback={<Skeleton className="h-8 w-24" />}>
                        <PriceInput {...handle} />
                    </Suspense>
            </TableCell>

            {/* Stock */}
            <TableCell>
                <div className="flex items-center gap-2">
                    <Suspense fallback={<Skeleton className="h-8 w-20" />}>
                        <StockInput {...handle} />
                    </Suspense>
                    {isOutOfStock && (
                        <Badge
                            variant="destructive"
                            className="text-sm"
                        >
                            Sem Estoque
                        </Badge>
                    )}
                    {isLowStock && (
                        <Badge
                            variant="secondary"
                            className="bg-amber-100 text-amber-800 dark:bg-amber-900/10 dark:text-amber-400"
                        >
                            Baixo Estoque
                        </Badge>
                    )}
                </div>
            </TableCell>

            {/* Featured */}
            <TableCell>
                <Suspense fallback={<Skeleton className="h-8 w-8" />}>
                    <FeaturedToggle {...handle} />
                </Suspense>
            </TableCell>

            {/* Actions - Fixed Width to prevent layout shift */}
            <TableCell className="w-25">
                <div className="flex h-8 w-25 items-center justify-end gap-2">
                    <Suspense fallback={null}>
                        <RevertButton {...handle} size="sm" />
                    </Suspense>
                    <Suspense fallback={null}>
                        <PublishButton {...handle} size="sm" variant="outline" />
                    </Suspense>
                </div>
            </TableCell>
        </TableRow>
    );
}

function ProductRowSkeleton() {
    return (
        <TableRow>
            <TableCell>
                <Skeleton className="h-12 w-12 rounded-md" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1 h-3 w-20" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-8 w-20" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-8 w-20"  />
            </TableCell>
            <TableCell>
                <Skeleton className="h-8 w-8" />
            </TableCell>
            <TableCell>
                <Skeleton className="h-8 w-25" />
            </TableCell>
        </TableRow>
    );
}

export function ProductRow(props: DocumentHandle) {
    return (
        <Suspense fallback={<ProductRowSkeleton />}>
            <ProductRowContent {...props} />
        </Suspense>
    );
}

export { ProductRowSkeleton };

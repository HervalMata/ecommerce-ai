"use client";

import Link from "next/link";
import {ArrowLeft, CreditCard, Edit2, ExternalLink, MapPin} from "lucide-react";
import {Suspense, use} from "react";
import {DocumentHandle, useDocumentProjection} from "@sanity/sdk-react";
import {Skeleton} from "@/components/ui/skeleton";
import {PublishButton, RevertButton} from "@/components/admin";
import Image from "next/image";
import {AddressEditor} from "@/components/admin/AddressEditor";
import {StatusSelect} from "@/components/admin/StatusSelect";

interface OrderDetailProjection {
    orderNumber: string;
    email: string;
    total: number;
    status: string;
    createdAt: string;
    stripePaymentId: string | null;
    address: {
        name: string;
        line1: string;
        line2: string;
        city: string;
        postcode: string;
        country: string;
    } | null;
    items: Array<{
        _key: string;
        quantity: number;
        priceATPurchase: number;
        product: {
            _id: string;
            name: string;
            slug: string;
            image: {
                asset: {
                    url: string;
                } | null;
            }  | null;
        } | null;
    }>;
}

function OrderDetailContent({handle}: {handle: DocumentHandle}) {
    const { data } = useDocumentProjection<OrderDetailProjection>({
        ...handle,
        projection: `{
            orderNumber,
            email,
            total,
            status,
            createdAt,
            stripePaymentId,
            address: {
                name,
                line1,
                line2,
                city,
                postcode,
                country,
            },
            items[]{
                _key,
                quantity,
                priceATPurchase,
                product->{
                    _id,
                    name,
                    "slug": slug.current,
                    "image": images[0]{
                        asset->{
                            url,
                        }
                    },
                },
            },
        }`
    });

    if (!data) {
        return (
            <div className="py-18 text-center">
                <p className="text-zinc-500">
                    Ordem não encontrada
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-x-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                        Ordem {data.orderNumber}
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {data.createdAt
                            ? new Date(data.createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }) : "Data Desconhecida"}
                    </p>
                </div>

                {/* Status And Actions */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            Status:
                        </span>
                        <Suspense fallback={<Skeleton className="h-10 w-35" />}>
                            <StatusSelect {...handle} />
                        </Suspense>
                    </div>
                    <div className="flex items-center gap-2">
                        <Suspense fallback={null}>
                            <RevertButton {...handle} />
                        </Suspense>
                        <Suspense fallback={null}>
                            <PublishButton {...handle} />
                        </Suspense>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
                {/* Order Items */}
                <div className="space-y-6 lg:col-span-3">
                    <div className="rounded-xl border border-zinc-200 bg-white
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <div className='border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6 sm:py-4'>
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Itens {(data.items?.length ?? 0)}
                            </h2>
                        </div>
                        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {data.items?.map((item) => (
                                <div key={item._key} className="flex gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
                                    {/* Image */}
                                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md
                                                bg-zinc-800 sm:h-20 sm:w-20">
                                        {item.product?.image?.asset?.url ? (
                                            <Image
                                                src={item.product.image.asset.url}
                                                alt={item.product.name ?? "Produto"}
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
                                        <div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-base">
                                                    {item.product?.name ?? "Produto Desconhecido"}
                                                </span>
                                                {item.product?.slug && (
                                                    <Link
                                                        href={`/product/${item.product.slug}`}
                                                        target="_blank"
                                                        className="shrink-0 text-zinc-400 hover:text-zinc-600"
                                                    >
                                                        <ExternalLink className="h-3.5 w-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                                                Quantidade: {item.quantity} x R$
                                                {(item.priceATPurchase ?? 0).toLocaleString("pt-BR", {})}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 sm:text-base">
                                            R$
                                            {((item.priceATPurchase ?? 0) * (item.quantity)).toLocaleString("pt-BR", {})}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-xl border border-zinc-200 bg-white
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            Resumo da Ordem
                        </h2>
                        <div className="mt-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-zinc-500 dark:text-zinc-400">
                                    Subtotal
                                </span>
                                <span className="text-zinc-900 dark:text-zinc-100">
                                    R$ {(data.total ?? 0).toLocaleString("pt-BR", {})}
                                </span>
                            </div>
                            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800">
                                <div className="flex justify-between font-semibold">
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        Total
                                    </span>
                                    <span className="text-zinc-900 dark:text-zinc-100">
                                        R$ {(data.total ?? 0).toLocaleString("pt-BR", {})}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 lg:col-span-2">
                    {/* Customer Info */}
                    <div className="rounded-xl border border-zinc-200 bg-white
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-zinc-400" />
                            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                Comprador
                            </h2>
                        </div>
                        <div className="mt-4 space-y-2 text-sm">
                            <p className="break-all text-zinc-900 dark:text-zinc-100">
                                {data.email}
                            </p>
                            {data.stripePaymentId && (
                                <p className="break-all text-xs text-zinc-500 dark:text-zinc-400">
                                    Pagamento: {data.stripePaymentId}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Editable Shipping Address */}
                    <div className="rounded-xl border border-zinc-200 bg-white
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-zinc-400" />
                                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
                                    Endereço de Entrega
                                </h2>
                            </div>
                            <Edit2 className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                            <Suspense fallback={
                                <div className="space-y-3">
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                    <Skeleton className="h-16" />
                                </div>
                            }>
                                <AddressEditor {...handle} />
                            </Suspense>
                        </div>
                    </div>

                    {/* Studio Link */}
                    <div className="rounded-xl border border-zinc-200 bg-white p-4
                                    dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-100">
                            Edições Avançadas
                        </h2>
                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                            Para alterações adicionais, edite esta ordem no Sanity Studio
                        </p>
                        <Link
                            href={`/studio/structure/order:${handle.documentId}`}
                            target="_blank"
                            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-900
                                        hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-300"
                        >
                            Abrir no Studio
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrderDetailSkeleton() {
    return (
        <div className="space-y-4 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <Skeleton className="h-7 w-40 sm:h-8 sm:w-48" />
                    <Skeleton className="mt-2 h-4 w-32" />
                </div>
                <Skeleton className="h-10 w-full sm:w-45" />
            </div>
            <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
                <div className="space-y-6 lg:col-span-3">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
                <div className="space-y-6 lg:col-span-2">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        </div>
    )
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailPage({params}: PageProps) {
    const { id } = use(params);
    const handle: DocumentHandle = {
        documentId: id,
        documentType: "order",
    }
    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/orders"
                className="inline-flex items-center text-sm text-zinc-500
                        hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Ordens
            </Link>

            {/* Order Detail */}
            <Suspense fallback={<OrderDetailSkeleton />}>
                <OrderDetailContent handle={handle} />
            </Suspense>
        </div>
    );
}

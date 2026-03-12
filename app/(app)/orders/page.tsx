import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_USER_QUERY } from "@/sanity/lib/sanity/queries/orders";
import { getOrderStatus } from "@/lib/constants/orderStatus";
import {Metadata} from "next";
import { StackedProductImages } from "@/components/app/StackedProductImages";

export const metadata: Metadata = {
    title: "Minhas Ordens | Loja de Laços",
    description: "Veja suas ordens",
};

export default async function OrdersPage() {
    const { userId } = await auth();

    const { data: orders } = await sanityFetch({
        query: ORDERS_BY_USER_QUERY,
        params: { clerkUserId: userId ?? "" }
    });


    if (orders.length === 0) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="text-center">
                    <Package className="mx-auto h-16 w-16 text-zinc-300 dark:text-zinc-600" />
                    <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        Nenhuma Ordem ainda.
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Quando você tiver ordens. Elas aparecerão aqui.                    </p>
                    <Button
                        asChild
                        className="mt-8"
                    >
                        <Link href="/">
                            Começe a comprar
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
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Minhas Ordens
                </h1>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                    Acompanhe e Gerencie suas ordens
                </p>
            </div>

            <div className="space-y-4">
                {orders.map((order: any) => {
                    const status = getOrderStatus(order.status);
                    const StatusIcon = status.icon;
                    const images = (order.itemImages ?? []).filter(
                        (url): url is string => url !== null,
                    );
                    
                    return (
                        <Link
                            key={order._id}
                            href={`/orders/&{order._id}`}
                            className="group block rounded-lg border border-zinc-200 bg-white p-6
                            transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
                        >
                            <div className="flex gap-5 p-5">
                                {/* Left: Product Images Stack */}
                                <StackedProductImages 
                                    images={images}
                                    totalCount={order.itemCount ?? 0}
                                    size="lg"
                                />

                                {/* Right Order Details */}
                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                    {/* Top Order Info + Status */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                                Ordem #{order.orderNumber?.split("-").pop()}
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                {order.createdAt
                                                    ? new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })
                                                    : "Data Desconhecida"
                                                }
                                            </p>
                                        </div>
                                        <Badge className={`${status.color} shrink-0 flex items-center gap-1`}>
                                            <StatusIcon className="h-3 w-3" />
                                        </Badge>
                                    </div>

                                    {/* Bottom: Items + Total */}
                                    <div className="mt-2 flex items-end justify-between">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            {order.itemCount}{" "}
                                            {order.itemCount === 1 ? "item" : "itens"}
                                        </p>
                                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                                            R$ {order.total ?? 0}.toLocaleString("pt-BR")
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: View Details */}
                            <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
                                <p className="truncate">
                                    {order.itemNames?.slice(0, 2).filter(Boolean).join(",")}
                                    {(order.itemNames.length ?? 0) > 2 && "..."}
                                </p>
                                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-zinc-500 transition-colors group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100">
                                    Veja Ordem
                                    <ArrowRight className="h-5 w-5 text-zinc-400" />
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

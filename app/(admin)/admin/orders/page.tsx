"use client";

import {Suspense, useState} from "react";
import {useDocuments} from "@sanity/sdk-react";
import {ShoppingCart} from "lucide-react";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {OrderRow, OrderRowSkeleton} from "@/components/admin/OrderRow";
import {Button} from "@/components/ui/button";
import {AdminSearch, useOrderSearchFilter} from "@/components/admin";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";

const STATUS_TABS = [
    { value: "all", label: "Todas" },
    { value: "paid", label: "Pagas" },
    { value: "shipped", label: "Enviadas" },
    { value: "delivered", label: "Entregues" },
    { value: "cancelled", label: "Canceladas" },
];

interface OrderListContentProps {
    statusFilter: string;
    searchFilter?: string;
}

function OrderListContent(
    {
        statusFilter,
        searchFilter,
    }: OrderListContentProps
) {
    const filters: string[] = [];

    if (statusFilter !== "all") {
        filters.push(`status === "${statusFilter}" `);
    }

    if (searchFilter) {
        filters.push(`${searchFilter}`)
    }

    const filter = filters.length > 0 ? filters.join(" && ") : undefined;

    const { data: orders, hasMore, loadMore, isPending } = useDocuments({
        documentType: "order",
        filter,
        orderings: [{ field: "_createdAt", direction: "desc" }],
        batchSize: 20,
    });

    if (!orders || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <ShoppingCart className="h-8 w-8 text-zinc-400" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Nenhuma Ordens Encontrada
                </h2>
                <p className="mt-1 text-am text-zinc-500 dark:text-zinc-400">
                    {searchFilter
                        ? "Tente ajustar seus termos da pesquisa."
                        : statusFilter === "all"
                            ? "Ordens aparecerão aqui quando os compradores as realizarem"
                            : `Nenhuma ${statusFilter} ordens no momento`}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-25">Ordem</TableHead>
                                <TableHead className="min-w-37.5">Comprador</TableHead>
                                <TableHead className="hidden text-center sm:table-cell">Itens</TableHead>
                                <TableHead className="min-w-20">Total</TableHead>
                                <TableHead className="min-w-25">Status</TableHead>
                                <TableHead className="min-w-25 md:table-cell">Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map(handle => (
                                <OrderRow key={handle.documentId} {...handle} />
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {hasMore && (
                <div className="mt-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => loadMore()}
                        disabled={isPending}
                    >
                        {isPending ? "Carregando..." : "Mostrar mais"}
                    </Button>
                </div>
            )}
        </>
    );
}

function OrderListSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-25">Ordem</TableHead>
                            <TableHead className="min-w-37.5">Comprador</TableHead>
                            <TableHead className="hidden text-center sm:table-cell">Itens</TableHead>
                            <TableHead className="min-w-20">Total</TableHead>
                            <TableHead className="min-w-25">Status</TableHead>
                            <TableHead className="min-w-25 md:table-cell">Data</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map(i => (
                            <OrderRowSkeleton key={i} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default function OrdersPage() {
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const { filter: searchFilter, isSearching } = useOrderSearchFilter(searchQuery);


    return (
        <div className="space-y-4 sm:space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                    Ordens
                </h1>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Gerencie e rastrei as ordens dos compradores da loja
                </p>
            </div>

            {/* Search and Tabs */}
            <div className="flex flex-col gap-4">
                <AdminSearch
                    placeholder="Procurando por ordem..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                    className="w-full sm:max-w-xs"
                />

                <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                    <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                        <TabsList className="w-max">
                            {STATUS_TABS.map((tab) => (
                                <TabsTrigger
                                    key={tab.value}
                                    value={tab.value}
                                    className="text-xs sm:text-sm"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            {/* Order List */}
            {isSearching ? (
                <OrderListSkeleton />
            ) : (
                <Suspense
                    key={`${statusFilter}-${searchFilter ?? ""}`}
                    fallback={<OrderListSkeleton />}
                >
                    <OrderListContent
                        statusFilter={statusFilter}
                        searchFilter={searchFilter}
                    />
                </Suspense>
            )}
        </div>
    );
}

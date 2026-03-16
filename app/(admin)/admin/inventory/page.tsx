"use client";

import {createDocument, createDocumentHandle, useApplyDocumentActions, useDocuments} from "@sanity/sdk-react";
import {Loader2, Package, Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ProductRow, ProductRowSkeleton} from "@/components/admin/ProductRow";
import {useRouter} from "next/navigation";
import {Suspense, useState, useTransition} from "react";
import {AdminSearch, useProductSearchFilter} from "@/components/admin/AdminSearch";

interface ProductListContentProps {
    filter?: string;
    onCreateProduct: () => void;
    isCreating: boolean;
}

function ProductListContent(
    {
        filter,
        onCreateProduct,
        isCreating,
    }: ProductListContentProps,
) {
    const { data: products, hasMore, loadMore, isPending } = useDocuments({
        documentType: "product",
        filter,
        orderings: [
            { field: "stock", direction: "asc" },
            { field: "name", direction: "asc" },
        ],
        batchSize: 20,
    });
    if (!products || products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <Package className="h-8 w-8 text-zinc-400" />
                </div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {filter ? "Nenhum Produto encontrado" : "Nenhum produto ainda"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {filter
                        ? "Tente ajustar seus termos de pesquisa"
                        : "Começe adicionando seu primeiro produto"
                    }
                </p>
                {!filter && (
                    <Button
                        onClick={onCreateProduct}
                        disabled={isCreating}
                        className="mt-4"
                    >
                        {isCreating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="mr- h-4 w-4" />
                        )}
                        Adicionar Produto
                    </Button>
                )}
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
                                <TableHead className="w-16">Imagem</TableHead>
                                <TableHead className="min-w-37.5">Produto</TableHead>
                                <TableHead className="w-28">Preço</TableHead>
                                <TableHead className="w-28">Estoque</TableHead>
                                <TableHead className="hidden w-16 sm:table-cell">Destaque?</TableHead>
                                <TableHead className="w-45">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((handle) => (
                                <ProductRow
                                    key={handle.documentId}
                                    {...handle}
                                />
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
                        {isPending ? "Carregando..." : "Mostrar Mais"}
                    </Button>
                </div>
            )}
        </>
    );
}

function ProductListSkeleton() {
    return (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-16">Imagem</TableHead>
                            <TableHead className="min-w-37.5">Produto</TableHead>
                            <TableHead className="w-28">Preço</TableHead>
                            <TableHead className="w-28">Estoque</TableHead>
                            <TableHead className="hidden w-16 sm:table-cell">Novidade?</TableHead>
                            <TableHead className="w-45">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i: number) => (
                            <ProductRowSkeleton key={i} />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

function InventoryContent() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const { filter, isSearching } = useProductSearchFilter(searchQuery);
    const apply = useApplyDocumentActions();

    const handleCreateProduct = () => {
        try {
            startTransition(async () => {
                const newDocHandle = createDocumentHandle({
                    documentId: crypto.randomUUID(),
                    documentType: "product",
                });
                await apply(createDocument(newDocHandle));
                router.push(`/admin/inventory/${newDocHandle.documentId}`);
            });
        } catch (error) {
            console.error("Falha ao criar produto", error);
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                        Estoque
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                        Gerencie seu estoque de produtos e preços
                    </p>
                </div>
                <Button
                    onClick={handleCreateProduct}
                    disabled={isPending}
                    className="w-full sm:w-auto"
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Plus className="mr- h-4 w-4" />
                    )}
                    Novo Produto
                </Button>
            </div>

            {/* Search */}
            <AdminSearch
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:max-w-sm"
            />

            {/* Product List */}
            {isSearching ? (
                <ProductListSkeleton />
            ) : (
                <Suspense fallback={<ProductListSkeleton />}>
                    <ProductListContent
                        onCreateProduct={handleCreateProduct}
                        isCreating={isPending}
                        filter={filter}
                    />
                </Suspense>
            )}
        </div>
    );
}

export default function InventoryPage() {
    return (<InventoryContent />)
}

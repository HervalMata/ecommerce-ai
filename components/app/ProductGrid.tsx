import {FILTER_PRODUCTS_BY_NAME_QUERYResult} from "@/sanity.types";
import {ProductCard} from "@/components/app/ProductCard";

interface ProductGridProps {
    products: FILTER_PRODUCTS_BY_NAME_QUERYResult;
}

export function ProductGrid(
    { products }: ProductGridProps
) {
    if (products.length === 0) {
        return (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
                    Nenhum Produto encontrado.
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                    Tente Ajustar sua pesquisa ou filtros
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    )
}

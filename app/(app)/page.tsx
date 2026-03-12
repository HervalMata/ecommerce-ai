import {
    FILTER_PRODUCTS_BY_NAME_QUERY,
    FILTER_PRODUCTS_BY_PRICE_ASC_QUERY, FILTER_PRODUCTS_BY_PRICE_DESC_QUERY,
    FILTER_PRODUCTS_BY_RELEVANCE_QUERY
} from "@/sanity/lib/sanity/queries/products";
import {sanityFetch} from "@/sanity/lib/live";
import {ALL_CATEGORIES_QUERY} from "@/sanity/lib/sanity/queries/categories";
import {ProductGrid} from "@/components/app/ProductGrid";
import {ProductGridSkeleton} from "@/components/app/ProductGridSkeleton";
import {Suspense} from "react";
import {ProductFilters} from "@/components/app/ProductFilters";

interface PageProps {
    searchParams: Promise<{
      q?: string;
      category?: string;
      color?: string;
      material?: string;
      minPrice?: string;
      maxPrice?: string;
      price?: string;
      sort?: string;
      inStock?: string;
    }>;
}

export default async function HomePage(
    { searchParams }: PageProps,
) {
  const params = await searchParams;
  const searchQuery = params.q ?? "";
  const categorySlug = params.category ?? "";
  const category = params.category ?? "";
  const color = params.color ?? "";
  const material = params.material ?? "";
  const minPrice = Number(params.minPrice) || 0;
  const maxPrice = Number(params.maxPrice) || 0;
  const price = Number(params.price) || 0;
  const sort = params.sort ?? "";
  const inStock = params.inStock === "true";

  const getQuery = () => {
      if (searchQuery && sort === "relevance") {
          return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
      }

      switch (sort) {
          case "price_asc":
            return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
        case "price_desc":
          return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
        case "relevance":
          return FILTER_PRODUCTS_BY_RELEVANCE_QUERY;
        default:
          return FILTER_PRODUCTS_BY_NAME_QUERY;
      }
  }

  const { data: products } = await sanityFetch({
      query: getQuery(),
      params: {
          searchQuery,
          categorySlug,
          category,
          color,
          material,
          minPrice,
          price,
          maxPrice,
          inStock,
      }
  });

  const { data: categories } = await sanityFetch({
      query: ALL_CATEGORIES_QUERY,
  })

  return (
    <div className="">
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
            {/* Page Banner */}
            <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Todos os Produtos
                    </h1>
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Laços Maravilhosos para a sua cabeça
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Sidebar Filters */}
                    <aside className="w-full shrink-0 lg:w-72">
                        <ProductFilters categories={categories} />
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {/* Results Count */}
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {products.length}{" "}
                                {products.length === 1 ? "produto" : "produtos"}
                                {searchQuery && (
                                    <span>
                                        {" "}
                                        para &quot;<span className="font-medium">{searchQuery}</span>
                                        &quot;
                                    </span>
                                )}
                            </p>
                        </div>

                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid products={products} />
                        </Suspense>
                    </main>
                </div>
            </div>
        </div>
      {/* Featured Products Carousel */}

      {/* Page Banner */}

      {/* Category Tiles */}

      {/* Products Section */}
    </div>
  );
}

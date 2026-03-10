import { z } from "zod";
import { tool } from "ai";
import { sanityFetch } from "@/sanity/lib/live";
import { AI_SEARCH_PRODUCTS_QUERY } from "@/sanity/lib/sanity/queries/products";
import { SearchProduct } from "../types";
import { AI_SEARCH_PRODUCTS_QUERYResult } from "@/sanity.types";

const productSearchSchema = z.object({
    query: z.string()
        .optional()
        .default("")
        ,describe("Procurar termos para encontrar produtos por nome, descrição ou categoria (e.x. 'laço', 'tiara')"),
    category: z.string()
        .optional()
        .default("")
        ,describe("Filtrar produtos por categoria(e.x. 'laço', 'tiara')"),
    material: z
        .enum(["", "Lonita", "Gorgurão", "Seda"])
        .optional()
        .default("")
        ,describe("Filtrar produtos por material"),
    color: z
        .enum(["", "Rosa", "Azul", "Amarelo", "Cinza", "Natural"])
        .optional()
        .default("")
        ,describe("Filtrar produtos pelas cores"),
    minPrice: z
        .number()
        .optional()
        .default(0)
        ,describe("Preço minino em Reais (e.x., 100)"),
    maxPrice: z
        .number()
        .optional()
        .default(0)
        ,describe("Preço maximo em Reais (e.x., 500). Use 0 para todos")                        
});

export const searchProductsTool = tool({
    description:
        "Procurar por produtos na loja de laços. Pode procurar por nome, descrição ou categoria "
          + "  e filtrar por material, cores faixa de preços, Retorna detalhes dos produtos incluindo disponibilidade de estoque.",
    inputSchema: productSearchSchema,
    execute: async ({ query, category, material, color, minPrice, maxPrice }) => {
        console.log("[SearchProducts] Query received: ", {
            query, category, material, color, minPrice, maxPrice,
        });

        try {
            const { data: products } = await sanityFetch({
                query: AI_SEARCH_PRODUCTS_QUERY,
                params: {
                    searchQuery: query || "",
                    categorySlug: category || "",
                    material: material || "",
                    color: color || "",
                    minPrice: minPrice || 0,
                    maxPrice: maxPrice || 0,
                },
            });

            console.log("[SearchProducts] Products found: ", products.length);

            if (products.length === 0) {
                return {
                    found: false,
                    message: "Nenhum produto encontado para esses critérios de pesquisa. Tente pesquisar com termos ou filtros diferentes.",
                    products: [],
                    filters: {
                        query, category, material, color, minPrice, maxPrice,
                    },
                };
            }

            const formattedProducts: SearchProduct[] = (
                products as AI_SEARCH_PRODUCTS_QUERYResult
            ).map((product) => {
                const stockStatus: SearchProduct["stockStatus"] =
                    product.stock === null || product.stock === undefined
                        ? "unknown"
                        : product.stock === 0
                            ? "out_of_stock"
                            : product.stock <= 5
                                ? "low_stock"
                                : "in_stock";

                return {
                    id: product._id,
                    name: product.name ?? null,
                    slug: product.slug ?? null,
                    description: product.description ?? null,
                    price: product.price ?? null,
                    priceFormatted: product.price ? `RS ${product.price.toLocaleString("pt-BR")}` : null,
                    category: product.category?.title ?? null,
                    categorySlug: product.category?.slug ?? null,
                    material: product.material ?? null,
                    color: product.color ?? null,
                    dimensions: product.dimensions ?? null,
                    stockCount: product.stock ?? null,
                    stockStatus,
                    stockMessage:
                        stockStatus === "out_of_stock"
                            ? "Fora de Estoque - Sem disponibilidade"
                            : stockStatus === "low_stock"
                                ? `Baixo Estoque - Somente ${product.stock} restantes`
                                : stockStatus === "in_stock"
                                    ? `Em Estoque (${product.stock} disponivel)`
                                    : "Status do estoque desconhecido",
                    featured: product.featured ?? null,
                    assemblyRequired: product.assemblyRequired ?? null,
                    imageUrl: product.image?.asset?.url ?? null,
                    productUrl: product.slug ? `/products/${product.slug}` : null,                
                };                
            });

            return {
                found: true,
                message: `Encontrad ${products.length} produto${products.length === 1 ? "" : "s"} para esses critérios de pesquisa.`,
                totalResults: products.length,
                products: formattedProducts,
                filters: {
                    query, category, material, color, minPrice, maxPrice,
                },
            };
        } catch (error) {
            return {
                found: false,
                message: "Um erro ocorreu enquanto estavamos pesquisando os produtos.",
                products: [],
                erropr: error instanceof Error ? error.message : "Erro desconhecido",
                filters: {
                    query, category, material, color, minPrice, maxPrice,
                },
            };
        }
    }      
});
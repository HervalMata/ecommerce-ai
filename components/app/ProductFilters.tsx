"use client"

import {ALL_CATEGORIES_QUERYResult} from "@/sanity.types";
import {useRouter, useSearchParams} from "next/navigation";
import React, {ReactNode, useCallback, useEffect, useState} from "react";
import {Badge} from "@/components/ui/badge";
import {X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {COLORS, MATERIALS, SORT_OPTIONS} from "@/lib/constants/filters";
import {Slider} from "@/components/ui/slider";

interface ProductFiltersProps {
    categories: ALL_CATEGORIES_QUERYResult;
}

export function ProductFilters(
    { categories }: ProductFiltersProps
) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get("q") ?? "";
    const currentCategory = searchParams.get("category") ?? "";
    const currentColor = searchParams.get("color") ?? "";
    const currentMaterial = searchParams.get("material") ?? "";
    const currentSort = searchParams.get("sort") ?? "";
    const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
    const urlMaxPrice = Number(searchParams.get("MaxPrice")) || 0;

    const [priceRange, setPriceRange] = useState<[number, number]>([
        urlMaxPrice, urlMinPrice
    ]);

    useEffect(() => {
        setPriceRange([urlMinPrice, urlMaxPrice]);
    }, [urlMinPrice, urlMaxPrice]);

    const isSearchActive = !!currentSearch;
    const isCategoryActive = !!currentCategory;
    const isColorActive = !!currentColor;
    const isMaterialActive = !!currentMaterial;
    const isPriceActive = urlMinPrice > 0 || urlMaxPrice < 5000;

    const hasActiveFilters =
        isSearchActive ||
        isCategoryActive ||
        isColorActive ||
        isMaterialActive ||
        isPriceActive;

    const activeFilterCount = [
        isSearchActive,
        isCategoryActive,
        isColorActive,
        isMaterialActive,
        isPriceActive,
    ].filter(Boolean).length;

    const updateParams = useCallback((
        updates: Record<string, string | number | null>
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "" || value === 0) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        router.push(`?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const searchQuery = formData.get("search") as string;
        updateParams({ q: searchQuery || null });
    }

    const handleClearFilters = () => {
        router.push("/", { scroll: false });
    }

    const clearSingleFilter = (key: string) => {
      if (key === "price") {
          updateParams({ minPrice: null, maxPrice: null });
      } else {
          updateParams({ [key]: null });
      }
    };

    const FilterLabel = (
        {
            children,
            isActive,
            filterKey,
        }: {
            children: ReactNode;
            isActive: boolean;
            filterKey: string;
        }
    ) => (
        <div className="mb-2 flex items-center justify-between">
            <span
                className={`block text-sm font-medium ${
                    isActive
                        ? "text-zinc-900 dark:text-zinc-100"
                        : "text-zinc-700 dark:text-zinc-300"
                }`}
            >
                {children}
                {isActive && (
                    <Badge className="ml-2 h-5 bg-amber-500 px-1.5 text-xs text-white hover:bg-amber-500">
                        Ativo
                    </Badge>
                )}
            </span>
            {isActive && (
                <button
                    type="button"
                    onClick={() => clearSingleFilter(filterKey)}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                    aria-label={`Climpar filtro de ${filterKey}`}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );

    return (
        <div className="space-y-6 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            {/* Clear Filters */}
            {hasActiveFilters && (
                <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-950">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            {activeFilterCount}{" "}
                            {activeFilterCount === 1 ? "Filtro" : "Filtros"}
                        </span>
                    </div>
                    <Button
                        size="sm"
                        onClick={handleClearFilters}
                        className="w-full bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Limpar todos os filtros
                    </Button>
                </div>
            )}

            {/* Search */}
            <div>
                <FilterLabel isActive={isSearchActive} filterKey="q">
                    Pesquisar
                </FilterLabel>
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                    <Input
                        name="search"
                        placeholder="Pesquisar produtos..."
                        defaultValue={currentSearch}
                        className={`flex-1 ${
                            isSearchActive
                                ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                                : ""
                        }`}
                    />
                    <Button
                        type="submit"
                        size="sm"
                    >
                        Pesquisar
                    </Button>
                </form>
            </div>

            {/* Category */}
            <div>
                <FilterLabel isActive={isCategoryActive} filterKey="category">
                    Categoria
                </FilterLabel>
                <Select
                    value={currentCategory || "all"}
                    onValueChange={(value) => updateParams({ category: value === "all" ? null : value })}
                >
                    <SelectTrigger
                        className={
                            isCategoryActive
                                ? "border-amber-500 ring-1 ring-amber-500 dark:border-amber-400 dark:ring-amber-400"
                                : ""
                        }
                    >
                        <SelectValue placeholder="Pesquisar todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Categorias</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category._id} value={category.slug ?? ""}>
                                {category.title}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Color */}
            <div>
                <FilterLabel isActive={isColorActive} filterKey="color">
                    Cor
                </FilterLabel>
                <Select
                    value={currentColor || "all"}
                    onValueChange={(value) => updateParams({ color: value === "all" ? null : value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pesquisar todas as cores" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as Cores</SelectItem>
                        {COLORS.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                                {color.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Material */}
            <div>
                <FilterLabel isActive={isMaterialActive} filterKey="material">
                    Material
                </FilterLabel>
                <Select
                    value={currentMaterial || "all"}
                    onValueChange={(value) => updateParams({ material: value === "all" ? null : value })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Pesquisar todas as materiais" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas os Materiais</SelectItem>
                        {MATERIALS.map((material) => (
                            <SelectItem key={material.value} value={material.value}>
                                {material.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Price Range */}
            <div>
                <FilterLabel isActive={isPriceActive} filterKey="price">
                    Faixa de Preço R$ {priceRange[0]} - R$ {priceRange[1]}
                </FilterLabel>
                <Slider
                    min={0}
                    max={5000}
                    step={100}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    onValueCommit={([min, max]) =>
                        updateParams({
                            minPrice: min > 0 ? min : null,
                            maxPrice: max < 5000 ? max : null,
                        })
                    }
                    className={`mt-4 ${isPriceActive ? "[&_[role=slider]]:border-amber-500 [&_[role=slider]]:ring-amber-500" : ""}`}
                />
            </div>

            {/* Sort */}
            <div>
                <span className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Classificar Por
                </span>
                <Select
                    value={currentSort || "all"}
                    onValueChange={(value) => updateParams({ sort: value === "all" ? null : value })}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Padrão</SelectItem>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}

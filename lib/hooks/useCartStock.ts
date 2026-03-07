"use client";

import { client } from "@/sanity/lib/client";
import { CartItem } from "../store/cart-store";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/lib/sanity/queries/products";

export interface StockInfo {
    productId: string;
    currentStock: number;
    isOutOfStock: boolean;
    exceedStock: boolean;
    availableQuantity: number;
}

export type StockMap = Map<string, StockInfo>;

interface UseCartStockReturn {
    stockMap: StockMap;
    isLoading: boolean;
    hasStockIssues: boolean;
    refetch: () => void;
}

export function useCartStock(items: CartItem[]): UseCartStockReturn {
    const [stockMap, setStockMap] = useState<StockMap>(new Map());
    const [isLoading, setIsLoading] = useState(false);
    const requestIdRef = useRef(0);

    const productIds = useMemo(
        () => items.map((item) => item.productId),
        [items]
    );

    const fetchStock = useCallback(async () => {
        const requestId = ++requestIdRef.current;
        if (items.length === 0) {
            setStockMap(new Map());
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try {
            const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
                ids: productIds,
            });

            if (requestId !== requestIdRef.current) return;

            const newStockMap = new Map<string, StockInfo>();

            for (const item of items) {
                const product = products.find(
                    (p: { _id: string }) => p._id === item.productId
                );
                
                const currentStock = product?.stock ?? 0;

                newStockMap.set(item.productId, {
                    productId: item.productId,
                    currentStock,
                    isOutOfStock: currentStock === 0,
                    exceedStock: item.quantity > currentStock,
                    availableQuantity: Math.min(item.quantity, currentStock),
                });
            }

            setStockMap(newStockMap);
        } catch (error) {
            console.error("Falha ao careegar o estoque: ", error);
        } finally {
            if (requestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, [items, productIds]);

    useEffect(() => {
        fetchStock();
    }, [fetchStock]);

    const hasStockIssues = Array.from(stockMap.values()).some(
        (info) => info.isOutOfStock || info.exceedStock
    );

    return {
        stockMap,
        isLoading,
        hasStockIssues,
        refetch: fetchStock,
    };
}
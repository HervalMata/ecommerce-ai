"use client"

import {createContext, ReactNode, useContext, useRef} from "react";
import {CartState, CartStore, createCartStore, defaultInitState} from "@/lib/store/cart-store";

export type CartStoreApi = ReturnType<typeof createCartStore>;

const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

interface CartStoreProviderProps {
    children: ReactNode;
    initialState?: CartState
}

export const CartStoreProvider = (
    {children, initialState}: CartStoreProviderProps
) => {
    const storeRef = useRef<CartStoreApi | null>(null);

    if (storeRef.current === null) {
        storeRef.current = createCartStore(initialState ?? defaultInitState);
    }

    return (
        <CartStoreContext.Provider value={storeRef.current}>
            {children}
        </CartStoreContext.Provider>
    )
}

export const useCartStore = <T,>(selector: (store: CartStore) => T): T => {
    const cartStoreContext = useContext(CartStoreContext);

    if (!cartStoreContext) {
        throw new Error("useCartStore must be used within CartStoreProvider");
    }

    // @ts-ignore
    return useStore(cartStoreContext, selector);
};

export const useCartIsOpen = () => useCartStore((state) => state.isOpen);

export const useTotalItems = () => useCartStore((state) =>
    state.items.reduce((sum: any, item: any) => sum + item.quantity, 0));

export const useTotalPrice = () => useCartStore((state) =>
    state.items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0));

export const useCartItem = (productId: string) =>
    useCartStore((state) =>
        state.items.find((item: any) => item.productId === productId)
    );

export const useCartActions = () =>
    useCartStore((state) => ({
        addItem: state.addItem,
        removeItem: state.removeItem,
        updateQuantity: state.updateQuantity,
        clearCart: state.clearCart,
        toggleCart: state.toggleCart,
        openCart: state.openCart,
        closeCart: state.closeCart,
    }))

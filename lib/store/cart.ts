import {create} from "zustand";
import {persist} from "zustand/middleware/persist";
import {createSelectors} from "@/lib/store/createSelectors";
import useStore from "@/lib/store/useStore";


export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    totalItems: number;
    totalPrice: number;
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

const useCartStoreBase = create<CartState>()(
    persist(
        (set,get) => ({
            items: [],
            isOpen: false,

            get totalItems() {
                return get().items.reduce((sum, item) => sum + item.quantity, 0);
            },

            get totalPrice() {
                return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            },

            addItem: (item) =>
                set((state) => {
                    const existingItem = state.items.find(
                        (i) => i.productId === item.productId
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.productId === item.productId
                                ? { ...i, quantity: i.quantity + 1 }
                                    : i
                            ),
                        }
                    }

                    return {
                        items: [ ...state.items, { ...item, quantity: 1 }],
                    };
                }),

            removeItem: (productId) =>
                set((state) => ({
                    items: state.items.filter((i) => i.productId !== productId)
                })),

            updateQuantity: (productId: string, quantity: number) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((i) => i.productId !== productId),
                        };
                    }

                    return {
                        items: state.items.map((i) =>
                            i.productId === productId ? { ...i, quantity } : i
                        ),
                    };
                }),

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            openCart: () => set({ isOpen: true }),

            closeCart: () => set({ isOpen: false }),
        }),
        {
            name: "cart-storage",
            partialize: (state) => ({ items: state.items }),
        }
    )
);

export const useCartStore = createSelectors(useCartStoreBase);

export const useCartItems = () => {
    useStore(useCartStore, (state) => state.items);
}

export const useTotalItems = () => {
    useStore(useCartStore, (state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0));
}

export const useTotalPrice = () =>
    useStore(useCartStore, (state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0));

export const useCartOpen = () => useStore(useCartStore, (state) => state.isOpen);

export const useCartItem = (productId: string) =>
    useStore(useCartStore, (state) =>
    state.items.find((i) => i.productId === productId));

export const usecartActions = () => ({
    addItem: useCartStore.use.addItem(),
    removeItem: useCartStore.use.removeItem(),
    updateQuantity: useCartStore.use.updateQuantity(),
    clearCart: useCartStore.use.clearCart(),
    toggleCart: useCartStore.use.toggleCart(),
    openCart: useCartStore.use.openCart(),
    closeCart: useCartStore.use.closeCart(),
});


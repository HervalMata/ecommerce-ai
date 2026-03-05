import {createStore} from "zustand/vanilla";

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

export interface CartActions {
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;
}

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
    items: [],
    isOpen: false,
}

export const createCartStore = (
    initState: CartState = defaultInitState,
) => {
    return createStore<CartStore>()(
            (set,get) => ({
                ...initState,

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
        )
}

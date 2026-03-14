import { createStore } from "zustand/vanilla";

export interface ChatState {
    isOpen: boolean;
    pendingMessage: string | null;
}

export interface ChatActions {
    openChat: () => void;
    openChatWithMessage: (message: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
    clearPendingMessage: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
    isOpen: false,
    pendingMessage: null,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
    return createStore<ChatStore>()((set: any) => ({
        ...initState,

        openChat: () => set({ isOpen: true, pendingMessage: null }),
        openChatWithMessage: (message: string) =>
            set({ isOpen: true, pendingMessage: message }),
        closeChat: () => set({ isOpen: false }),
        toggleChat: () => set((state: any) => ({ isOpen:  !state.isOpen })),
        clearPendingMessage: () => set({ pendingMessage: null }),
    }));
}

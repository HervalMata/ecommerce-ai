import { createStore } from "zustand/vanilla";

export interface ChatState {
    isOpen: boolean;
}

export interface ChatActions {
    openChat: () => void;
    closeChat: () => void;
    toggleChat: () => void;
}

export type ChatStore = ChatState & ChatActions;

export const defaultInitState: ChatState = {
    isOpen: false,
};

export const createChatStore = (initState: ChatState = defaultInitState) => {
    return createStore<ChatStore>()((set: any) => ({
        ...initState,

        openChat: () => set({ isOpen: true }),
        closeChat: () => set({ isOpen: false }),
        toggleChat: () => set((state: any) => ({ isOpen: true })),
    }));
}
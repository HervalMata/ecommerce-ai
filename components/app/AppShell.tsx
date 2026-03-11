"use client";

import { ReactNode } from "react";
import { useIsChatOpen } from "@/lib/store/chat-store-provider";

export function AppShell({ children }:{ children: ReactNode}) {
    const isChatOpen = useIsChatOpen();

    return (
        <div
            className={`min-h-screen transition-all duration-300 ease-in-out ${
                isChatOpen ? "xl:mr-[448px] max-xl:overflow-hidden max-xl:h-screen" : ""
            }`}
        >
            {children}
        </div>
    );
    
}
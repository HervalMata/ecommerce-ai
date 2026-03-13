"use client";

import {Button} from "@/components/ui/button";
import {Sparkles} from "lucide-react";
import {useChatActions} from "@/lib/store/chat-store-provider";

interface AskAIASimilarButtonProps {
    productName: string;
}

export function AskAIASimilarButton({ productName }: AskAIASimilarButtonProps) {
    const { openChatWithMessage } = useChatActions();

    const handClick = () => {
        openChatWithMessage(`Mostre me produtos similares a ${productName}`);
    }

    return (
        <Button
            onClick={handClick}
            className="w-full gap-2 bg-gradient-to-r from-smber-500 to-orange-600 text-white shadow-lg
            hover:from-amber-600 hover:to-orange-700 hover:shadow-xl dark:from-amber-600 dark:to-orange-700
            dark:hover:from-amber-700 dark:hover:to-orange-800"
        >
            <Sparkles className="w-4 h-4" />
            Pergunte A IA por produtos similares
        </Button>
    )
}

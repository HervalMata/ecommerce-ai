import { Bot } from "lucide-react";

export function LoadingIndicator() {
    return (
        <div classname="flex gap-3">
            <div classname="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                <Bot classname="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div classname="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
                <div classname="flex gap-1">
                    <span classname="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0.3s]" />
                    <span classname="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0.15s]" />
                    <span classname="h-2 w-2 animate-bounce rounded-full bg-amber-400" />
                </div>
            </div>
        </div>
    )
}
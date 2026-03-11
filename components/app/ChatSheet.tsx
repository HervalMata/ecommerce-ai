"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useChatActions, useIsChatOpen } from "@/lib/store/chat-store-provider";
import { Sparkles, Send, Loader2, X, Bot } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { Button } from "../ui/button";
import { getMessageText, getToolParts, MessageBubble, ToolCallUI, WelcomeScreen } from "./chat";
import { Input } from "../ui/input";

export function ChatSheet() {
    const isOpen = useIsChatOpen();
    const { closeChat } = useChatActions();
    const [input, setInput] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    const { messages, sendMessage, status } = useChat();
    const isLoading = status === "streaming" || status === "submitted";

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubimt = (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        sendMessage({ text: input });
        setInput("");
    }

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop - only visible on mobile/tablet (< xl) */}
            <div 
                className="fixed inset-0 z-40 bg-black/50 xl:hidden"
                onClick={closeChat}
                aria-hidden="true"
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 z-50 flex h-full w-full flex-col border-1 border-zinc-200
             bg-white overscroll-contain dark:border-zinc-800 dark:bg-zinc-950 sm:w-[448px]
              animate-in slide-in-from-right duration--300">
                {/* Header */}
                <header className="shrink-0 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex h-16 items-center justify-between px-6">
                        <div className="flex items-center gap-2 font-semibold">
                            <Sparkles className="h-5 w-5 text-amber-500" />
                            Assistente de Vendas
                        </div>
                        <Button variant="ghost" size="icon" onClick={closeChat}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </header>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
                    {messages.length === 0 ? (
                        <WelcomeScreen onSuggestionClick={sendMessage} />
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => {
                                const content = getMessageText(message);
                                const toolParts = getToolParts(message);
                                const hasContent = content.length > 0;
                                const hasTools = toolParts.length > 0;

                                if (!hasContent && !hasTools) return null;

                                return (
                                    <div key={message.id} className="space-y-3">
                                        {/* Tool call indicators */}
                                        {hasTools && toolParts.map((toolPart) => (
                                            <ToolCallUI 
                                                key={`tool-${message.id}-${toolPart.toolCallId}`}
                                                toolPart={toolPart}
                                                closeChat={closeChat}
                                            />
                                        ))}

                                        {/* Message Content */}
                                        {hasContent && (
                                            <MessageBubble 
                                                role={message.role}
                                                content={content}
                                                closeChat={closeChat}
                                            />
                                        )}
                                    </div>
                                );
                            })}

                            {/* Loading Indicator */}
                            {isLoading && messages[messages.length - 1].role === "user" && (
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center
                                     rounded-full bg-amber-100 dark:bg-amber-900/30">
                                        <Bot className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-2 dark:bg-zinc-800">
                                        <div className="flex gap-1">
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:-0,3s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:-0,15s]" />
                                            <span className="h-2 w-2 animate-bounce rounded-full bg-amber-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Scroll Anchor */}
                            <div ref={messageEndRef} />
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800">
                    <form onSubmit={handleSubimt} className="flex gap-2">
                        <Input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pergunte algo sobre nossos laços..."
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!input.trim() || isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Send className="h-4 w-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </>
    );
}
import type { UIMessage } from "ai";
import { ToolCallPart } from "./types";

export function getMessageText(message: UIMessage): string {
    if (!message.parts || message.parts.length === 0) {
        return "";
    }

    return message.parts
        .filter((part: any) => part.type === "text")
        .map((part: any) => (part as { type: "text"; text: string }).text)
        .join("\n");
}

export function getToolParts(message: UIMessage): ToolCallPart[] {
    if (!message.parts || message.parts.length === 0) {
        return [];
    }

    return message.parts
        .filter((part: any) => part.type.startsWith("tool-"))
        .map((part: any) => part as unknown as ToolCallPart);
}

export function getToolDisplayName(toolName: string): string {
    const toolNames: Record<string, string> = {
        searchProducts: "Pesquisando Produtos",
        getMyOrders: "Obtenha Suas Ordens",
    };

    return toolNames[toolName] || toolName;
}
import { auth } from "@clerk/nextjs/server";
import { createAgentUISreamResponse, type UIMessage } from "ai";
import { shoppingAgent } from "@/lib/ai/shopping-agent";

export async function POST(request:Request) {
    const { userId } = await auth();

    if (!userId) {
        return new Response("Não Autorizado", { status: 401 });
    }

    const { messages }: { messages: UIMessage[] } = await request.json();

    return createAgentUISreamResponse({
        agent: shoppingAgent,
        messages,
    });
}
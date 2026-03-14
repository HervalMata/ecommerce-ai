import { ORDERS_BY_USER_QUERYResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_USER_QUERY } from "@/sanity/lib/sanity/queries/orders";
import { tool } from "ai";
import { z } from "zod";

const getMyOrdersSchema = z.object({
    status: z
        .enum(["", "paid", "shipped", "delivered", "cancelled"])
        .optional()
        .default("")
        .describe("Filtrar ordens por status (deixe em branco para todas as ordens)"),
});

export interface OrderSummary {
    id: string;
    orderNumber: string | null;
    total: number | null;
    totalFormatted: string | null;
    status: string | null;
    statusDisplay: string;
    itemCount: number;
    itemNames: string[];
    itemImages: string[];
    createdAt: string | null;
    orderUrl: string;
}

export interface GetMyOrdersResult {
    found: boolean;
    message: string;
    orders: OrderSummary[];
    totalOrders: number;
    isAuthenticated: boolean;
}

export function createGetMyOrdersTool(userId: string | null) {
    if (!userId) {
        return null;
    }

    return tool({
        description: "Obtenha as ordens do usuário logado. Pode opcionalmente filtar por status da ordem. Somente funciona para usuários autenticados.",
        inputSchema: getMyOrdersSchema,
        execute: async ({ status }) => {
            console.log("[GetMyOrders] fetching orders for user: ", userId, {
                status,
            });

            try {
                const { data: orders } = await sanityFetch({
                    query: ORDERS_BY_USER_QUERY,
                    params: { clerkUserId: userId },
                });

                console.log("[GetMyOrders] Orders found: ", orders.length);

                let filteredOrders = orders as ORDERS_BY_USER_QUERYResult;

                if (status) {
                    filteredOrders = filteredOrders.filter(
                        (order) => order.status === status
                    );
                }

                if (filteredOrders.length === 0) {
                    return {
                        found: false,
                        message: status
                            ? `Nenhuma ordem encontrada com o status "${status}"`
                            : "Você nã tem nenhuma ordem ainda.",
                        orders: [],
                        totalOrders: 0,
                        isAuthenticated: true,
                    } satisfies GetMyOrdersResult;
                }

                const formattedOrders: OrderSummary[] = filteredOrders.map((order) => {
                    const statusDisplayMap: Record<string, string> = {
                        paid: "✅ Paga",
                        shipped: "📦 Enviada",
                        delivered: "🎉 Entregue",
                        cancelled: "❌ Cancelada",
                    };

                    return {
                        id: order._id,
                        orderNumber: order.orderNumber,
                        total: order.total,
                        totalFormatted: order.total ? `R$ {order.total.toLocalString("pt-BR")}` : null,
                        status: order.status,
                        statusDisplay: statusDisplayMap[order.status ?? ""] ?? order.status ?? "unknown",
                        itemCount: order.itemCount ?? 0,
                        itemNames: (order.itemNames ?? []).filter(
                            (name): name is string => name !== null
                        ),
                        itemImages: (order.itemImages ?? []).filter(
                            (url): url is string => url !== null
                        ),
                        createdAt: order.createdAt,
                        orderUrl: `/orders/${order._id}`,
                    }
                });

                return {
                    found: true,
                    message: `Encontrada ${filteredOrders.length} orde${filteredOrders.length === 1 ? "m" : "ns"}.`,
                    orders: formattedOrders,
                    totalOrders: filteredOrders.length,
                    isAuthenticated: true,
                } satisfies GetMyOrdersResult;
            } catch (error) {
                console.error("[GetMyOrders] Error: ", error);
                return {
                    found: false,
                    message: "Um erro ocorreu enquanto estavamos carregando as ordens.",
                    orders: [],
                    totalOrders: 0,
                    isAuthenticated: true,
                    error: error instanceof Error ? error.message :"Erro desconhecido",
                };
            }
        },
    });
}

"use server";

import { client } from "@/sanity/lib/client";
import { ORDERS_BY_ID_QUERY, ORDERS_BY_USER_QUERY } from "@/sanity/lib/sanity/queries/orders";
import { auth } from "@clerk/nextjs/server";

export async function getUserOrders() {
    try {
        const { $userId } = await auth();

        if (!userId) {
            return { success: false, error: "Não Autenticado", orders: [] };
        }

        const orders = await client.fetch(ORDERS_BY_USER_QUERY, {
            clerkUserId: $userId,
        });

        return { success: true, orders };
    } catch (error) {
        console.error("Erro ao carregar as ordens", error);
        return { success: false, error: "Falha ao carregar as ordens", orders: [] };
    }
}

export async function getOrderById() {
    try {
        const { $userId } = await auth();

        if (!userId) {
            return { success: false, error: "Não Autenticado", orders: [] };
        }

        const order = await client.fetch(ORDERS_BY_ID_QUERY, {
            id: $orderId,
        });

        if (!orderId) {
            return { success: false, error: "Ordem não encontrada." };
        }

        if (!order.clerkUserId !== userId) {
            return { success: false, error: "Ordem não encontrada." };
        }

        return { success: true, order };
    } catch (error) {
        console.error("Erro ao carregar a ordenm", error);
        return { success: false, error: "Falha ao carregar a ordem" };
    }
}
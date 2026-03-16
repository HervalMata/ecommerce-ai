"use client";

import React, {useTransition} from 'react'
import {useRouter} from "next/navigation";
import {createDocument, createDocumentHandle, useApplyDocumentActions} from "@sanity/sdk-react";
import {Button} from "@/components/ui/button";
import {Loader2, Package, Plus, ShoppingCart, TrendingUp} from "lucide-react";
import {LowStockAlert} from "@/components/admin/LowStockAlert";
import {RecentOrders} from "@/components/admin/RecentOrders";
import {StatsCard} from "@/components/admin/StatsCard";

function AdminDashboard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const apply = useApplyDocumentActions();

  const handleCreateProduct = () => {
      startTransition(async () => {
        const newDocHandle = createDocumentHandle({
            documentId: crypto.randomUUID(),
            documentType: "product",
        });
        await apply(createDocument(newDocHandle));
        router.push(`/admin/inventory/${newDocHandle.documentId}`);
      });
  };


  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:itens-center sm:justify-between">
          <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
                AdminDashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 sm:text-base">
                Resumo da sua loja
              </p>
          </div>
          <Button
            onClick={handleCreateProduct}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Plus className="mr-2 h-4 w-4" />
            )}
            Novo Produto
          </Button>
      </div>

      {/* Stats Card */}
        <div className="grid gap-4 sm:grid-cols-2 lg:gap-3">
            <StatsCard
                title="Total de Produtos"
                icon={Package}
                documentType="product"
                href="/admin/inventory"
            />

            <StatsCard
                title="Total de Ordens"
                icon={ShoppingCart}
                documentType="order"
                href="/admin/orders"
            />

            <StatsCard
                title="Estoque Baixo de Itens"
                icon={TrendingUp}
                documentType="product"
                filter="stock <= 5"
                href="/admin/inventory"
            />
        </div>

      {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
              <LowStockAlert />
              <RecentOrders />
          </div>
    </div>
  )
}

export default AdminDashboard

"use client";

import { Providers } from '@/components/providers/Providers'
import React, {ReactNode, useState} from 'react'
import {ExternalLink, LayoutDashboard, Menu, Package, ShoppingCart, X} from "lucide-react";
import {usePathname} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

const navItems = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
    },
    {
        label: "Estoque",
        href: "/admin/inventory",
        icon: Package,
    },
    {
        label: "Ordens",
        href: "/admin/orders",
        icon: ShoppingCart,
    },
]


function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Providers>
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Mobile Header */}
            <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b
                            border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900 sm:hidden">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
                        <span className="text-sm font-bold text-white dark:text-zinc-900">
                            A
                        </span>
                    </div>
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                        Admin
                    </span>
                </Link>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </Button>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close Sidebar"
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen border-r border-zinc-200 bg-white transition-transform dark:border-zinc-800 dark:bg-zinc-900",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-14 items-center border-b border-zinc-200 px-6 dark:border-zinc-800">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100">
                                <span className="text-sm font-bold text-white dark:text-zinc-900">
                                    A
                                </span>
                            </div>
                            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                Admin
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-1 px-3 py-4">
                        {navItems.map((item) => {
                            const isActive =
                                item.href === "/admin"
                                    ? pathname === '/admin'
                                    : pathname.startsWith(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                            : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100",
                                    )}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="space-y-3 border-t border-zinc-200 px-3 py-4 dark:border-zinc-800">
                        <Link
                            href="/studio"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center justify-between gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                        >
                            Abrir Studio
                            <ExternalLink />
                        </Link>
                        <Link
                            href="/"
                            onClick={() => setSidebarOpen(false)}
                            className="block px-3 text-sm text-zinc-500 hover:text-zinc-400 dark:hover:text-zinc-200"
                        >
                            ← Voltar para a loja
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    </Providers>
  )
}

export default AdminLayout

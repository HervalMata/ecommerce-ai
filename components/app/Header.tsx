"use client"

import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ShoppingBag, User} from "lucide-react";
import {useCartActions, useTotalItems} from "@/lib/store/cart-store-provider";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";

export function Header() {
    const { openCart } = useCartActions();
    const totalItems = useTotalItems();

    return (
        <header className="sticky to-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        Loja de Laços
                    </span>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Cart Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={openCart}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                        <span className="sr-only">Abrir Carrinho {totalItems} itens</span>
                    </Button>

                    {/* User */}
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "h-9 w-9"
                                }
                            }}
                        />
                    </SignedIn>
                    <SignedOut>
                        <Button
                            variant="ghost"
                            size="icon"
                            asChild
                        >
                            <Link href="/sign-in">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Entrar</span>
                            </Link>
                        </Button>
                    </SignedOut>
                </div>
            </div>
        </header>
    )
}

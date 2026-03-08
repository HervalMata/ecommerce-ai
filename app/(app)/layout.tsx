import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import {CartStoreProvider} from "@/lib/store/cart-store-provider";
import {SanityLive} from "@/sanity/lib/live";
import {Header} from "@/components/app/Header";
import {CartSheet} from "@/components/app/CartSheet";
import { Toaster } from '@/components/ui/sonner';

function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <CartStoreProvider>
            <Header />
            <main>{children}</main>
            <CartSheet />
            <Toaster position="bottom-left" />
            <SanityLive />
        </CartStoreProvider>
    </ClerkProvider>
  )
}

export default Layout

import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import {CartStoreProvider} from "@/lib/store/cart-store-provider";
import {SanityLive} from "@/sanity/lib/live";
import {Header} from "@/components/app/Header";
import {CartSheet} from "@/components/app/CartSheet";
import { Toaster } from '@/components/ui/sonner';
import { AppShell } from '@/components/app/AppShell';
import { ChatSheet } from '@/components/app/ChatSheet';

function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <CartStoreProvider>
          <AppShell>
            <Header />
            <main>{children}</main>
          </AppShell>
          <CartSheet />
          <ChatSheet />
          <Toaster position="bottom-left" />
          <SanityLive />
        </CartStoreProvider>
    </ClerkProvider>
  )
}

export default Layout

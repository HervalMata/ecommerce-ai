import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'
import {CartStoreProvider} from "@/lib/store/cart-store-provider";

function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <CartStoreProvider>
            <main>{children}</main>
        </CartStoreProvider>
    </ClerkProvider>
  )
}

export default Layout

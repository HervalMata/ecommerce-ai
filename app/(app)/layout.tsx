import { ClerkProvider } from '@clerk/nextjs'
import React, { ReactNode } from 'react'

function Layout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
        <main>{children}</main>
    </ClerkProvider>
  )
}

export default Layout
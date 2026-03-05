import { Providers } from '@/components/providers/Providers'
import React, { ReactNode } from 'react'

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
        <main>
            {children}
        </main>
    </Providers>
  )
}

export default AdminLayout
"use client"

import dynamic from 'next/dynamic'
import React, { ReactNode } from 'react'
import LoadingSpinner from '../loaders/LoadingSpinner'

const SanityAppProvider = dynamic(
    () => import("@/components/providers/SanityApProvider"),
    {
        ssr: false,
            loading: () => (
                <LoadingSpinner text="Carregando Sanity App SDK..." isFullScreen size="lg" />
        )
    }
);

export function Providers({ children }: { children: ReactNode }) {
    return <SanityAppProvider>{children}</SanityAppProvider>
}

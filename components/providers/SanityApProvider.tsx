"use client"

import React, { ReactNode } from 'react'
import { SanityApp } from "@sanity/sdk-react"
import { projectId, dataset } from "@/sanity/env"

function SanityAPpProvider({ children }: { children: ReactNode }) {
  return (
    <SanityApp
        config={[
            {
                projectId,
                dataset,
            }
        ]}
        fallback={<div />}
    >{children}</SanityApp>
  )
}

export default SanityAPpProvider
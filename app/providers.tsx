'use client'

import { Amplify } from 'aws-amplify'
import { useState, useEffect } from 'react'
import awsconfig from '@/lib/aws-exports'

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Configure Amplify on client-side only
    Amplify.configure({ ...awsconfig, ssr: true })
    setIsClient(true)
  }, [])

  if (!isClient) {
    // Return a simple loading state or skeleton UI
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return <>{children}</>
}

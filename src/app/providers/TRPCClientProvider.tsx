'use client'

import { getQueryClient } from '@/trpc/client'
import { QueryClientProvider } from '@tanstack/react-query'

export function TRPCClientProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

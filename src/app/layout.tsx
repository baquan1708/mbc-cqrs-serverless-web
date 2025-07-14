'use client'

import '../../dist/styles.css'
import './custom-style.css'
import { Inter as FontSans } from 'next/font/google'
import React, { Suspense, useMemo, useState } from 'react'
import axios from 'axios'

import { cn } from '../packages/master/lib/utils'
import { Toaster } from '../packages/master/components/ui/toaster'
import Loading from './loading'
import TestUrlProvider from './TestUrlProvider'

import { Input } from '../packages/master/components/ui/input'
import { Button } from '../packages/master/components/ui/button'
import { Label } from '../packages/master/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../packages/master/components/ui/select'
import dynamic from 'next/dynamic'

const AppProviders = dynamic(
  () => import('mbc-cqrs-serverless-web').then((mod) => mod.AppProviders),
  { ssr: false }
)

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
})

// Define your API URL constants. Replace with your actual URL.
const HEALTH_API_URL = '/health' // Example health check endpoint

type RootLayoutProps = Readonly<{
  children?: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  const [bearerToken, setBearerToken] = useState<string>('')
  const [segment, setSegment] = useState<'system_admin' | 'tenant' | ''>('')
  console.log('🚀 ~ RootLayout ~ segment:', segment)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const httpClient = useMemo(() => {
    if (!bearerToken) return null
    const instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_MASTER_API_BASE,
      timeout: 5000,
    })

    instance.interceptors.request.use((config) => {
      config.headers.Authorization = `Bearer ${bearerToken}`
      return config
    })

    return instance
  }, [bearerToken])

  // Memoize the urlProvider, re-creating it only when the segment changes.
  const urlProvider = useMemo(() => {
    if (!segment) return null
    return new TestUrlProvider(segment)
  }, [segment])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null) // Clear previous errors
    setIsLoading(true)

    if (!bearerToken || !segment) {
      setError('Please fill in all fields.')
      setIsLoading(false)
      return
    }

    // Create a temporary Axios instance for the validation call.
    // This ensures we use the token from the input field directly.
    const validationClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_MASTER_API_BASE,
      timeout: 5000,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    })

    try {
      // 1. Make the function async to use await.
      // 2. Call the health check endpoint.
      await validationClient.get('/')

      // 3. If the call succeeds (doesn't throw an error), the token is valid.
      setIsSubmitted(true)
    } catch (err) {
      // 4. If the call fails (e.g., 401, 403, or network error), handle the error.
      console.error('Token validation failed:', err)
      setError(
        'Invalid token or API is unreachable. Please check and try again.'
      )
      setIsSubmitted(false) // Ensure the app doesn't render
    } finally {
      // 5. Stop the loading indicator regardless of the outcome.
      setIsLoading(false)
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-[hsl(var(--background))] font-sans antialiased',
          fontSans.variable
        )}
      >
        <Suspense fallback={<Loading />}>
          {isSubmitted && httpClient && urlProvider ? (
            // If submitted and configured, render the main application.
            <AppProviders
              httpClient={httpClient}
              urlProvider={urlProvider}
              user={
                segment === 'system_admin'
                  ? {
                      tenantCode: '9999',
                      tenantRole: 'system_admin',
                    }
                  : {
                      tenantCode: '8888',
                      tenantRole: 'tenant',
                    }
              }
            >
              {children}
            </AppProviders>
          ) : (
            // Otherwise, display the entry form.
            <div className="flex h-screen items-center justify-center bg-gray-50">
              <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
                <div>
                  <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Access Configuration
                  </h2>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* Input fields remain the same */}
                  <div className="space-y-2">
                    <Label htmlFor="bearer-token">Bearer Token</Label>
                    <Input
                      id="bearer-token"
                      type="password"
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="segment">Segment</Label>
                    <Select
                      onValueChange={(value: 'system_admin' | 'tenant') =>
                        setSegment(value)
                      }
                      defaultValue={segment}
                    >
                      <SelectTrigger id="segment">
                        <SelectValue placeholder="Select a segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system_admin">
                          System Admin
                        </SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Display error message if one exists */}
                  {error && (
                    <div className="rounded-md bg-red-50 p-3">
                      <p className="text-sm font-medium text-red-800">
                        {error}
                      </p>
                    </div>
                  )}

                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Validating...' : 'Proceed'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Suspense>
        <Toaster />
      </body>
    </html>
  )
}

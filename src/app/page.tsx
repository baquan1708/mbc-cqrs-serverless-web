'use client'

import Link from 'next/link'
import { Button } from '../packages/master/components/ui/button'
import { useUrlProvider } from 'mbc-cqrs-serverless-web'

/**
 * The main page component displayed after successful login.
 */
export default function Page() {
  // Retrieve the urlProvider instance from the context.
  // This makes your links dynamic based on the segment ('system_admin' or 'tenant').
  const urlProvider = useUrlProvider()

  return (
    <main className="flex min-h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome Back!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          You have successfully logged in and can now manage your application.
        </p>

        {/* Use the Link component for fast, client-side navigation.
          The href is dynamically set using the urlProvider.
        */}
        <Link href={urlProvider.SETTINGS_PAGE_URL}>
          <Button size="lg">Manage Master Settings</Button>
        </Link>
      </div>
    </main>
  )
}

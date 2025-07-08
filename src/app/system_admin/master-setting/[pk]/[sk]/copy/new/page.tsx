'use client'

import { NewCopyMasterSettings, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <NewCopyMasterSettings />
      </MsLayout>
    </main>
  )
}

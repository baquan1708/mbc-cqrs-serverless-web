'use client'

import { CopyMasterSettings, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <CopyMasterSettings />
      </MsLayout>
    </main>
  )
}

'use client'

import { EditMasterSettings, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <EditMasterSettings />
      </MsLayout>
    </main>
  )
}

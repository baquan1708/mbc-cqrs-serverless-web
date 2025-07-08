'use client'

import { MasterData, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <MasterData />
      </MsLayout>
    </main>
  )
}

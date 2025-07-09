'use client'

import { DetailCopy, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <DetailCopy />
      </MsLayout>
    </main>
  )
}

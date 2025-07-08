'use client'

import Image from 'next/image'
import { MasterSetting, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <MasterSetting />
      </MsLayout>
    </main>
  )
}

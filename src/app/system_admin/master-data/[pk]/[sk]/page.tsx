import { EditMasterData, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading>
        <EditMasterData />
      </MsLayout>
    </main>
  )
}

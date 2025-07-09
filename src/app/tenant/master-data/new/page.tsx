import { EditMasterData, MsLayout } from 'mbc-cqrs-serverless-web'

export default function Home() {
  return (
    <main>
      <MsLayout useLoading={false}>
        <EditMasterData />
      </MsLayout>
    </main>
  )
}

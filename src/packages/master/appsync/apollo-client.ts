import { AuthOptions, createAuthLink } from 'aws-appsync-auth-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client/core'
interface AppSyncConfig {
  url: string
  apiKey: string
  region: string
}

const APPSYNC_CONFIG: AppSyncConfig = {
  url: process.env.NEXT_PUBLIC_MASTER_APPSYNC_URL,
  apiKey: process.env.NEXT_PUBLIC_MASTER_APPSYNC_APIKEY,
  region: process.env.NEXT_PUBLIC_MASTER_APPSYNC_REGION,
}

const url = APPSYNC_CONFIG.url
const region = APPSYNC_CONFIG.region
const auth: AuthOptions = {
  type: 'API_KEY',
  apiKey: APPSYNC_CONFIG.apiKey,
}

const httpLink = new HttpLink({ uri: url })

const links = ApolloLink.from([
  createAuthLink({ url, region, auth }),
  createSubscriptionHandshakeLink({ url, region, auth }, httpLink),
])

const apolloClient = new ApolloClient({
  link: links,
  cache: new InMemoryCache(),
})

export default apolloClient

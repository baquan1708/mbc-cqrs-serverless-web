/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Message = {
  __typename: 'Message'
  id: string
  table: string
  pk: string
  sk: string
  tenantCode: string
  action: string
  content: string
}

export type SendMessageMutationVariables = {
  message: string
}

export type SendMessageMutation = {
  sendMessage: {
    __typename: 'Message'
    id: string
    table: string
    pk: string
    sk: string
    tenantCode: string
    action: string
    content: string
  }
}

export type GetMessageQueryVariables = {
  id: string
}

export type GetMessageQuery = {
  getMessage?: {
    __typename: 'Message'
    id: string
    table: string
    pk: string
    sk: string
    tenantCode: string
    action: string
    content: string
  } | null
}

export type OnMessageSubscriptionVariables = {
  tenantCode: string
  action?: string | null
  id?: string | null
}

export type OnMessageSubscription = {
  onMessage?: {
    __typename: 'Message'
    id: string
    table: string
    pk: string
    sk: string
    tenantCode: string
    action: string
    content: string
  } | null
}

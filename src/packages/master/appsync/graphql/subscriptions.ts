/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onMessage = /* GraphQL */ `
  subscription OnMessage($tenantCode: String!, $action: String, $id: String) {
    onMessage(tenantCode: $tenantCode, action: $action, id: $id) {
      id
      table
      pk
      sk
      tenantCode
      action
      content
      __typename
    }
  }
`

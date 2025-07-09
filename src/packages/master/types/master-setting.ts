import { SearchPropsBase } from './pagination'

export type SearchPropsMasterSetting = SearchPropsBase & {
  xTenantCode?: any
  code?: string
  name?: string
  keyword?: string
  isDeleted?: boolean
  orderBys?: string[]
}

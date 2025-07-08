import { SearchPropsBase } from './pagination'

export type SearchPropsMasterData = SearchPropsBase & {
  xTenantCode?: any
  code?: string
  keyword?: string
  isDeleted?: boolean
  settingCode?: string
  typeCode?: string
  typeCodeId?: string
  orderBys?: string[]
}

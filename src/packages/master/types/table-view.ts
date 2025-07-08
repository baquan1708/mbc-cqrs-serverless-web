// /**
//  * テーブルビュー設定
//  */

// import { ReactNode } from 'react'
// import { Control } from 'react-hook-form'
import { TableViewType } from '../lib/constants/define'
// import { FieldType } from './form'

//export type TableView<TColumn> = {
export type TableView = {
  uuid: string
  name: string
  /** テーブルビュー種類。nullの場合はユーザービューとする */
  type?: TableViewType
  /** デフォルトのビュー。※システムビューの中で、更に既定のビューの場合にtrue */
  default?: boolean
  /**
   * 表示列一覧
   */
  columns?: Array<string>
  /** 並べ替え列 */
  order?: string
  /** 件数 */
  count?: number
  /**
   * フィルタ条件一覧
   */
  filter?: { [key: string]: any }
}

// /**
//  * フィルタのフィールド設定
//  */
// export type FilterFields = {
//   label: string | ReactNode
//   errorLabel?: string
//   name: string
//   fieldType?: FieldType
//   className?: string
//   options?: any
//   render?: (control: Control<any, any>, prefix?: string) => ReactNode
//   colSpan?: number
//   innerNames?: string[]
//   textAreaRows?: number
//   rules?: Array<Rule | RuleInterface>
//   checkLabel?: string | ReactNode
//   allowClear?: boolean
//   defaultValue?: any
// }

// /**
//  * 貿易登録審査のシステムテーブルビューの定義一覧
//  * @returns
//  */
// export const applicationIssueShinsaSystemTableViews: TableView[] = [
//   {
//     uuid: '06c2be76-6469-bffc-4f19-0d555fcd1944',
//     name: '既定のビュー',
//     type: TableViewType.System,
//     default: true,
//     columns: [
//       'syomei_syubetsu',
//       'country_name',
//       'uketsuke_no',
//       'hakkyu_shinsei_date',
//       'status',
//       'yusyutsu_j_syamei',
//       'daiko_company_name',
//       'tanto_name',
//       'invoice_no',
//     ],
//     order: '-hakkyu_shinsei_date',
//     count: countDefault,
//     filter: {},
//   },
//   {
//     uuid: '4131055f-e9ca-00ae-2c8d-0a1b41c48c4b',
//     name: '未入金一覧',
//     type: TableViewType.System,
//     default: true,
//     columns: [
//       'syomei_syubetsu',
//       'country_name',
//       'uketsuke_no',
//       'hakkyu_shinsei_date',
//       'status',
//       'yusyutsu_j_syamei',
//       'daiko_company_name',
//       'tanto_name',
//       'invoice_no',
//     ],
//     order: '-hakkyu_shinsei_date',
//     count: countDefault,
//     filter: {
//       unpaid_list: 1,
//     },
//   },
// ]

// /**
//  * 貿易登録審査のシステムテーブルビューの定義一覧
//  * @returns
//  */
// export const companySystemTableViews: TableView[] = [
//   {
//     uuid: '710d3bbe-512a-dab6-20b6-f780b66ab4e0',
//     name: '既定のビュー',
//     type: TableViewType.System,
//     default: true,
//     columns: [
//       'trade_company_code',
//       'old_trade_company_code',
//       'cci_member_type',
//       'is_warning',
//       'display_company_name',
//       'company_name_en',
//       'end_date',
//     ],
//     order: 'trade_company_code',
//     count: countDefault,
//     filter: {},
//   },
// ]

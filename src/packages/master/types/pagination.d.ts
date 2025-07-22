import * as React from 'react'

export type PaginateProps = {
  count?: number
  page?: number
  pageSize?: number
  ordering?: string
}

/**
 * 検索時のページネーションの型
 */
export type SearchPropsBase = {
  /**
   *  明示的に検索ボタンをクリックして検索を行ったかどうか
   */
  search?: boolean
  /**
   * 取得するデータの件数
   */
  count?: number
  /**
   * ページ番号
   */
  page?: number
  /**
   * 並べ替え対象の列。Djangoの仕様に合わせる
   */
  ordering?: string
  /**
   * テーブルビューのUUID
   */
  table_view?: string
  /**
   * ページネーションの検索条件を保存せずに検索する場合
   * ※具体的には、証明手数料修正画面から審査ページに遷移時
   */
  not_save_condition?: boolean
}

/**
 * ページネーションの要素のアイテム
 */
export type EditablePaginationItem = {
  /**
   * IDが採番されていない場合の一時的なキー（主に新規作成時）
   */
  tmp_key?: string
  /**
   * 編集したかどうか
   */
  is_edited?: boolean
  /**
   * 削除したかどうか
   */
  is_deleted?: boolean
}

/**
 * ページネーションの型
 */
export type PaginationProps<RecordType> = {
  columns: ColumnsType<RecordType>
  paginate: Paginate<RecordType>
  rowKey: string | GetRowKey<RecordType>
  onChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
    extra: TableCurrentDataSource<RecordType>
  ) => void
  count?: number
  page?: number
  headerColor?: string
  headerBgColor?: string
  className?: string
  rowClassName?:
    | string
    | ((record: RecordType, index: number, indent: number) => string)
  onClickRow?: (record: RecordType) => void
  ordering?: string
  scroll?: object
  size?: 'small' | 'middle' | 'large'
  paginationSize?: 'small' | 'default'
  bordered?: boolean
  summary?: () => React.ReactNode
  title?: () => React.ReactNode
  footer?: () => React.ReactNode
  rowSelection?: TableRowSelection<RecordType>
  showSizeChanger?: boolean
  hideOnSinglePage?: boolean
  onClickExpandButton?: (record: RecordType) => void
  expandedRowKeys?: Array<string>
  expandedRowRender?: (record: RecordType) => React.ReactNode
  showExpandColumn?: boolean
  /** ※使用する場合、親divにrelativeクラスを追加すること */
  menuButtons?: React.ReactNode
  pageSizeOptions?: number[]
  showSorterTooltip?: boolean
  enableResize?: boolean
  tableLayout?: 'fixed' | 'auto'
}

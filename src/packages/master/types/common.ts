/**
 * ページング(1～20件表示、次へ/前へのような表示を行うページ)の共通モデル
 * ※この共通モデルを使用する各種モデルで、結果を取得するためのresults(配列のモデル)を作成してください
 */
export type PaginateResponse = {
  /**
   * トータルの件数
   */
  count: number
  /**
   * 次ページURL
   */
  next?: string
  /**
   * 前ページURL
   */
  previous?: string
}

export enum CciMemberTypeEnum {
  Member = 1,
  NonMemberInProgressMember,
  NonMemberInThinking = 3,
  NonMemberNoPlan = 9,
}

/**
 * 発生エラーの詳細
 */
export type ErrorDetail = {
  error_code?: string
  error_detail_code?: string
  message?: string
  errors?: [key: string, errors: Array<string>]
}

/**
 * Paginate
 */
export type Paginate<T> = PaginateResponse & {
  results?: Array<T>
}

/**
 * Paginate(summaryも含む)
 */
export type PaginateSummary<T> = Paginate<T> & {
  summary?: T
}

/**
 * ログイン画面のProps
 * ※セッションにcci_codeを付与するためのものなので、IDやパスワードは定義しない
 */
export type LoginProps = {
  tenantCode: string
}

import { AxiosError } from 'axios'
import { ErrorDetail } from '../types/common'

/**
 * 独自のエラー定義
 */
export abstract class ExceptionBase extends Error {
  protected detail?: ErrorDetail
  protected axiosError?: AxiosError

  constructor(
    detail?: ErrorDetail,
    axiosError?: AxiosError,
    message?: string,
    options?: ErrorOptions
  ) {
    super(message, options)
    this.detail = detail
    this.axiosError = axiosError
  }

  /**
   * エラー詳細オブジェクト取得
   * @returns
   */
  public getDetail = (): ErrorDetail | null => {
    return this.detail
  }

  /**
   * エラーコード(ログインエラーなど)
   * @returns
   */
  public getErrorCode = (): string | null => {
    return this.detail?.error_code
  }

  /**
   * エラー詳細コード
   * 例：ログインエラーの場合、どのようなログインエラーかどうか。有効期限外など
   * @returns
   */
  public getErrorDetailCode = (): string | null => {
    return this.detail?.error_detail_code
  }

  /**
   * エラーメッセージ
   * @returns
   */
  public getErrorMessage = (): string | null => {
    return this.detail?.message
  }

  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return this.axiosError?.response?.status
  }
}

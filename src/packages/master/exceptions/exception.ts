import { ErrorCode } from '../lib/constants/define'
import { ExceptionBase } from './exception-base'

/**
 * Not found
 */
export class NotFoundException extends ExceptionBase {
  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return 404
  }
}

/**
 * Unauthorized
 */
export class UnauthorizedException extends ExceptionBase {
  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return 401
  }
}

/**
 * アクセス不可例外
 */
export class ForbiddenException extends ExceptionBase {
  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return 403
  }
}

/**
 * メンテナンス中
 */
export class MaintenanceException extends ExceptionBase {
  /**
   * エラーメッセージ
   * @returns
   */
  public getErrorMessage = (): string | null => {
    // 各種パラメータで返却
    let message = (this.detail as any)?.detail
    if (!!message) {
      return message
    }
    message = (this.detail as any)?.message
    if (!!message) {
      return message
    }
    return '現在システムはメンテナンス中です。'
  }

  /**
   * エラーコード(ログインエラーなど)
   * @returns
   */
  public getErrorCode = (): string | null => {
    return ErrorCode.MAINTENANCE
  }

  /**
   * エラー詳細コード
   * 例：ログインエラーの場合、どのようなログインエラーかどうか。有効期限外など
   * @returns
   */
  public getErrorDetailCode = (): string | null => {
    return null
  }
}

/**
 * ネットワークエラー
 */
export class NetworkException extends ExceptionBase {
  /**
   * エラーコード(ログインエラーなど)
   * @returns
   */
  public getErrorCode = (): string | null => {
    return ErrorCode.NETWORK_ERROR
  }

  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return 503
  }
}

/**
 * タイムアウト
 */
export class TimeoutException extends ExceptionBase {
  /**
   * エラーコード(ログインエラーなど)
   * @returns
   */
  public getErrorCode = (): string | null => {
    return ErrorCode.TIMEOUT
  }

  /**
   * HTTPステータスコード
   * @returns
   */
  public getHttpStatusCode = (): number | null => {
    return 504
  }
}

/**
 * 予期せぬエラー
 */
export class UnknownException extends ExceptionBase {}

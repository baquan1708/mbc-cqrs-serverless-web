export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LOGIN_VALIDATION_ERROR: 'LOGIN_VALIDATION_ERROR',
  SESSION_TIMEOUT: 'SESSION_TIMEOUT',
  MAINTENANCE: 'MAINTENANCE',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT',
} as const

/**
 * テーブルビューの種類
 */
export enum TableViewType {
  System = 1,
  User = 2,
}
/**
 * 一覧の件数の上限
 */
export const countDefault = 20

/**
 * API側のエラーコード
 */
export const ApiErrorCode = {
  ValidationError: 'VALIDATION_ERROR',
} as const

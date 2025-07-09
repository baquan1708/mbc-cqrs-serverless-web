import { SorterResult } from 'antd/lib/table/interface'
import { UseFormSetError } from 'react-hook-form'
import { TimeoutException, UnauthorizedException } from '../../exceptions/exception'
import { ExceptionBase } from '../../exceptions/exception-base'
import { ApiErrorCode } from '../constants/define'
import { required } from './validation'

/**
 * API実行結果
 */
export type ApiResult<T> = {
  result: boolean
  response?: T
}

/**
 * カンマを削除
 * @param value
 * @returns 第一引数：値があるかどうか。第二引数：カンマ文字列
 */
export function removeCommaString(value: any): [boolean, string | null] {
  if (!required(value)) {
    return [false, value]
  }
  // カンマがない場合はfalseで返却
  if (String(value).indexOf(',') === -1) {
    return [false, value]
  }
  value = String(value).replace(/,/g, '')
  return [true, value]
}

/**
 * 並べ替え用のカラム列を取得
 * @param sorter
 */
export function getOrderingString<T>(sorter: SorterResult<T>): string | null {
  if (!sorter || !sorter.columnKey) {
    return null
  }
  return `${sorter.order == 'descend' ? '-' : ''}${sorter.columnKey}`
}

/**
 * API送信と、そのエラーハンドリング
 * ※バリデーションエラーならsetError、それ以外はfalseを返却する
 *
 * @param apiFunc 実行するAPI関数（コールバック）
 * @param setError バリデーションエラー時にセットするエラー関数
 * @param isThrowError エラーをthrowするかどうか。trueの場合は、alertなどは実施せず、エラーをそのままthrowする。falseの場合は、alertなどを実施する
 */
export async function handleApi<T>(
  apiFunc: () => Promise<T>,
  params?: {
    /** 画面フォームに値をセットする場合  */
    setError?: UseFormSetError<T>
    /** 例外発生時にthrowするかどうか（呼び出し元でハンドリングするかどうか）  */
    isThrowError?: boolean
    /** タイムアウト発生時のエラーメッセージ  */
    timeoutMessage?: string
    /** それ以外のエラーメッセージ  */
    errorMessage?: string
  }
): Promise<ApiResult<T>> {
  params = Object.assign(
    {
      isThrowError: false,
      timeoutMessage: '通信がタイムアウトしました。通信環境をご確認の上、再度お試しください。',
      errorMessage: 'エラーが発生しました。何度もこのエラーが発生する場合、管理者にお問い合わせください。',
    },
    params ?? {}
  )

  const errorFunc = (e) => {
    console.error(e)
    if (params.isThrowError) {
      throw e
    }
    // 504エラーの場合、タイムアウトメッセージを表示
    if (e instanceof TimeoutException) {
      alert(params.timeoutMessage)
      return {
        result: false,
      }
    }

    alert(params.errorMessage)
    return {
      result: false,
    }
  }

  try {
    const result = await apiFunc()
    return {
      result: true,
      response: result,
    }
  } catch (e) {
    if (!(e instanceof ExceptionBase)) {
      return errorFunc(e)
    }

    const body = e?.getDetail()
    // バリデーションエラー発生時
    if (!!body && !!body.error_code && body.error_code == ApiErrorCode.ValidationError && !!body.errors) {
      for (const key in body.errors) {
        let error = body.errors[key]
        if (Array.isArray(error)) {
          error = error?.join(' ')
        }
        if (!!params?.setError) {
          params.setError(key as any, {
            message: error,
          })
        }
      }
      return {
        result: false,
      }
    }
    // 排他制御エラー時
    else if (e?.getHttpStatusCode() == 409) {
      alert('編集していたデータは、別の利用者によって変更されました。\r\nページを更新し、再度編集してください。')
      return {
        result: false,
      }
    }
    // 2重ログインエラー
    else if (e instanceof UnauthorizedException) {
      alert(
        'セッションが切れました。別の利用者にログインされたか、一定時間が経過した場合があります。\n一度ログアウトし、再度ログインを行ってください。'
      )
      return {
        result: false,
      }
    }
    // それ以外エラー
    else {
      return errorFunc(e)
    }
  }
}

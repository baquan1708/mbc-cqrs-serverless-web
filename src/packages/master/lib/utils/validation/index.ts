import React, { ReactNode } from 'react'
import { FieldErrors, FieldValues, RegisterOptions } from 'react-hook-form'
import { FieldPath } from 'react-hook-form/dist/types/path'

import { removeCommaString } from '../form'

// バリデーションルール
export enum Rule {
  /**
   * 全角
   */
  zenkaku = 0,
  /**
   * カタカナ
   */
  katakana = 1,
  /**
   * 半角数字
   */
  hankakuNum = 2,
  /**
   * 半角英数
   */
  hankakuEisu = 3,
  /**
   * 半角英数記号
   */
  hankakuEisuKigo = 4,
  /**
   * 電話番号
   */
  tel = 5,
  /**
   * メールアドレス
   */
  email = 6,
  /**
   * URL
   */
  url = 7,
  /**
   * 日付
   */
  date = 8,
  /**
   * パスワード
   */
  password = 9,
  /**
   * 全角スペース
   */
  //zenkakuSpace = 10,
  /**
   * IPアドレス
   */
  ip = 11,
  /**
   * メールアドレス(複数)
   */
  emailMultiple = 12,
  /**
   * json形式
   */
  json = 13,
}

/**
 * ルールインタフェース
 */
export interface RuleInterface {
  /**
   * バリデーション実施。エラーがあった場合にはエラーメッセージを返却する
   * @param value 対象の値
   * @param errorLabel エラーメッセージのラベル
   * @returns エラーメッセージ
   */
  validate: (value: any, errorLabel: string | ReactNode) => string | null
}

export type RequiredIfType = {
  /**
   * 比較対象の項目
   */
  name: string
  /**
   * formのwatch
   */
  watch: any
  /**
   * このcallbackの結果がtrueの場合、必須とする
   * ※ない場合はvalueによる判定を行う
   * @param watch
   * @returns
   */
  callback?: (watch: any) => boolean
  /**
   * nameの値がvalueの場合に必須とする
   * ※callbackの指定がない場合に使用
   */
  value?: any
}

// 比較の種類
export enum CompareType {
  /**
   * 同じ
   */
  eq = 0,
  /**
   * 異なる
   */
  ne = 1,
  /**
   * より小さい (基準値 < 比較対象)
   */
  lt = 2,
  /**
   * 以下 (基準値 <= 比較対象)
   */
  le = 3,
  /**
   * より大きい (基準値 > 比較対象)
   */
  gt = 4,
  /**
   * 以上 (基準値 >= 比較対象)
   */
  ge = 5,
}

export type Compare = {
  name: string
  label: string
  type: CompareType
  watch: any
  isDate?: boolean
}

export type ValidateRule = {
  label: ReactNode
  errorLabel?: string
  required?: boolean | RequiredIfType
  length?: number
  maxLength?: number
  compare?: Compare
  regex?: RegExp
  rules?: Array<Rule | RuleInterface>
  addComma?: boolean
  customRule?: (value: any, errorLabel: ReactNode) => string
}

/**
 * 独自ルールのバリデーションを返却
 * @param validateRule
 */
export function getValidateRules<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  validateRule: ValidateRule
): Omit<
  RegisterOptions<TFieldValues, TName>,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
> {
  // ルールの定義
  const rules = {}
  const errorLabel = validateRule.errorLabel ?? validateRule.label

  // 独自のルール
  const validate = (value: any) => {
    // 必須
    if (validateRule.required === true && !required(value)) {
      return `${errorLabel}の入力は必須です`
    }

    if (!!validateRule.rules) {
      for (const r of validateRule.rules) {
        // rがRuleInterfaceの場合、そのvalidateを実行
        if (typeof r === 'object' && 'validate' in r) {
          const message = r.validate(value, errorLabel)
          if (message != null) {
            return message
          }
        }
        // enumの場合
        else {
          switch (r) {
            case Rule.zenkaku:
              if (!zenkaku(value)) {
                return `${errorLabel}は全角で入力してください`
              }
              break
            case Rule.katakana:
              if (!katakana(value)) {
                return `${errorLabel}は全角カタカナで入力してください`
              }
              break
            case Rule.hankakuEisu:
              if (!hankakuEisu(value)) {
                return `${errorLabel}は半角英数で入力してください`
              }
              break
            case Rule.hankakuNum:
              if (!hankakuNum(value)) {
                return `${errorLabel}は半角数字で入力してください`
              }
              break
            case Rule.hankakuEisuKigo:
              if (!hankakuEisuKigo(value)) {
                return `${errorLabel}は半角英数記号で入力してください`
              }
              break
            case Rule.tel:
              if (!tel(value)) {
                return `${errorLabel}は電話番号形式(半角数字)で入力してください`
              }
              break
            case Rule.email:
              if (!email(value)) {
                return `${errorLabel}はメールアドレス形式(半角英数字)で入力してください`
              }
              break
            case Rule.emailMultiple:
              if (!emailMultiple(value)) {
                return `${errorLabel}はメールアドレス形式(半角英数字。複数の場合はカンマ区切り)で入力してください`
              }
              break
            case Rule.url:
              if (!url(value)) {
                return `${errorLabel}はURL形式(半角英数字)で入力してください`
              }
              break
            case Rule.date:
              if (!date(value)) {
                return `${errorLabel}は日付形式で入力してください`
              }
              break
            case Rule.password:
              if (!password(value)) {
                return `${errorLabel}は、8桁以上16桁以下で、アルファベット・数字を組み合わせた半角文字列で入力してください`
              }
              break
            // case Rule.zenkakuSpace:
            //   if (!zenkakuSpace(value)) {
            //     return `${errorLabel}は、全角1文字空けてください`
            //   }
            //   break
            case Rule.ip:
              if (!ip(value)) {
                return `${errorLabel}は、IPアドレス形式(123.456.789.0)で入力してください`
              }
              break
            case Rule.json:
              if (!json(value)) {
                return `${errorLabel}は、json形式で入力してください`
              }
              break
          }
        }
      }
    }

    // 条件付き必須
    if (!!validateRule.required && typeof validateRule.required != 'boolean') {
      const _reqIf = validateRule.required as RequiredIfType
      // callbackが指定されていれば、それによる判定を実施する
      if (!!_reqIf.callback) {
        const isRequired = _reqIf.callback(_reqIf.watch)
        // 必須とする判定の場合、!required(value)による判定
        if (isRequired && !required(value)) {
          return `${errorLabel}の入力は必須です`
        }
      }
      // callbackがない場合、nameの項目の値と、valueの値が一致している場合に必須とする
      else {
        if (!requiredIf(value, _reqIf.watch(_reqIf.name), _reqIf.value)) {
          return `${errorLabel}の入力は必須です`
        }
      }
    }

    // 長さ
    if (!!validateRule.length) {
      if (!length(value, validateRule.length, validateRule.addComma)) {
        return `${errorLabel}は${validateRule.length}文字で入力してください`
      }
    }

    // 最大文字数
    if (!!validateRule.maxLength) {
      if (!maxLength(value, validateRule.maxLength, validateRule.addComma)) {
        return `${errorLabel}は${validateRule.maxLength}文字以内で入力してください`
      }
    }

    // 値の大小
    if (!!validateRule.compare) {
      if (!compare(value, validateRule.compare)) {
        return getCompareMessage(errorLabel, validateRule.compare)
      }
    }

    // 正規表現
    if (!!validateRule.regex) {
      if (!regex(value, validateRule.regex)) {
        return `${errorLabel}の形式が異なります`
      }
    }

    // 独自ルールのバリデーション
    if (!!validateRule.customRule) {
      const message = validateRule.customRule(value, errorLabel)
      if (message != null) {
        return message
      }
    }

    // 何もなければnull
    return null
  }

  rules['validate'] = validate

  return rules
}

/**
 * 必須バリデーション
 * null, undefined, 空文字はNG
 * ※!!0がfalseになるのが結構厄介なので、可能な限りこちら使用する
 * @param val 入力値
 */
export function required(value: any): boolean {
  return (
    value !== null &&
    value !== undefined &&
    value !== '' &&
    (!Array.isArray(value) || value.length > 0)
  )
}

/**
 * 条件付き必須バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val 入力値
 * @param otherFieldValue 他のフィールドの値
 * @param otherFieldMatchedValue 他のフィールドの比較対象値
 */
export function requiredIf(
  value: any,
  otherFieldValue: any,
  otherFieldMatchedValue: any
): boolean {
  // requiredIfチェック対象が合致していなければtrue
  if (otherFieldValue != otherFieldMatchedValue) {
    return true
  }
  // valueがあればtrue
  return !!value
}

/**
 * 全角バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function zenkaku(value: any): boolean {
  return (
    !value || String(value).match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/)?.length > 0
  )
}

/**
 * 全角カタカナバリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function katakana(value: any): boolean {
  return !value || String(value).match(/^[・ァ-ヶー　]*$/)?.length > 0
}

/**
 * 数値ならびに数値系の文字列であればtrue
 * @param value
 * @returns
 */
export function isNumeric(value): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value)
}

/**
 * 半角数字バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * ※カンマは許可する。バリデーション後に変換する
 * @param val
 */
export function hankakuNum(value: any): boolean {
  return !value || String(value).match(/^[\d,]*$/)?.length > 0
}

/**
 * 半角英数バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function hankakuEisu(value: any): boolean {
  return !value || String(value).match(/^[a-zA-Z0-9 ]*$/)?.length > 0
}

/**
 * 半角英数記号バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function hankakuEisuKigo(value: any): boolean {
  return (
    !value || String(value).match(/^[a-zA-Z0-9!-/:-@\[-`{-~ ]*$/)?.length > 0
  )
}

/**
 * 電話番号バリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function tel(value: any): boolean {
  if (!value) {
    return true
  }
  // 数字の桁数が10文字未満の場合はfalse(数字以外の要素は取り除いて計算)
  if (value.replace(/[^0-9]/g, '').length < 10) {
    return false
  }
  return (
    String(value).match(
      /^[\(]{0,1}[0-9]{2,4}[\)\-\(]{0,1}[0-9]{2,4}[\)\-]{0,1}[0-9]{3,4}$/
    )?.length > 0
  )
}

/**
 * メールアドレスバリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function email(value: any): boolean {
  return (
    !value ||
    String(value).match(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/)
      ?.length > 0
  )
}

/**
 * メールアドレスバリデーション(複数。カンマ区切りは許容)
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function emailMultiple(value: any): boolean {
  if (!value) {
    return true
  }
  // カンマ区切りで分割して、それぞれのメールアドレスをチェック
  const emails = value.split(',')
  for (const e of emails) {
    if (!email(e)) {
      return false
    }
  }
  return true
}

/**
 * URLバリデーション
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function url(value: any): boolean {
  return (
    !value ||
    String(value).match(/^(https?:\/\/[\w\/:%#\$&\?\(\)~\.=\+\-]+)$/)?.length >
      0
  )
}

/**
 * 文字数・桁数
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function length(value: any, len: number, addComma?: boolean): boolean {
  if (!value) {
    return true
  }
  // カンマを使用する設定の場合、除去する
  if (addComma) {
    const comma = removeCommaString(value)
    if (comma[0]) {
      value = comma[1]
    }
  }
  return String(value).length == len
}

/**
 * 文字数・桁数 最長
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function maxLength(
  value: any,
  len: number,
  addComma?: boolean
): boolean {
  if (!value) {
    return true
  }
  // カンマを使用する設定の場合、除去する
  if (addComma) {
    const comma = removeCommaString(value)
    if (comma[0]) {
      value = comma[1]
    }
  }
  return String(value).length <= len
}

/**
 * 正規表現
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function regex(value: any, reg: RegExp): boolean {
  return !value || String(value).match(reg)?.length > 0
}

/**
 * 日付の判定
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function date(value): boolean {
  if (!value) {
    return true
  }

  if (!isNaN(Date.parse(value))) {
    return true
  }

  // YYYYMMDD形式の正規表現
  const regex = /^(1[0-9]{3}|2[0-9]{3})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/

  if (!regex.test(value)) {
    return false // 形式が正しくない場合、falseを返す
  }

  // 文字列から年、月、日を抽出
  const year = +value.slice(0, 4)
  const month = +value.slice(4, 6)
  const day = +value.slice(6, 8)

  // 月は0（1月）から11（12月）までの数値で表されるため、月 - 1をする
  const date = new Date(year, month - 1, day)

  // 日付の存在チェック
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

/**
 * 時間の判定(hhmmss)
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function time(value): boolean {
  if (!value) {
    return true
  }

  // hhmmss形式の正規表現
  const regex = /^([01][0-9]|2[0-3])[0-5][0-9][0-5][0-9]$/

  if (!regex.test(value)) {
    return false // 形式が正しくない場合、falseを返す
  }

  return true
}

/**
 * パスワード。8桁以上16桁以下、アルファベットと数字をそれぞれ含んでいる
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function password(value): boolean {
  if (!value) {
    return true
  }

  // 8桁以上16桁以下のチェック
  if (value.length < 8 || value.length > 16) {
    return false
  }

  // アルファベットと数字をそれぞれ含んでいるかのチェック
  const hasAlphabet = /[a-zA-Z]/.test(value)
  const hasDigit = /[0-9]/.test(value)
  // アルファベット・数字以外の文字が含まれていないかのチェック
  const hasInvalidCharacters = /[^a-zA-Z0-9]/.test(value)

  return hasAlphabet && hasDigit && !hasInvalidCharacters
}

/**
 * 全角スペースを1つ以上空ける
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function zenkakuSpace(value): boolean {
  if (!value) {
    return true
  }

  value = String(value).trim()
  return /.+　.+/.test(value)
}

/**
 * IPアドレス
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function ip(value): boolean {
  if (!value) {
    return true
  }

  value = String(value).trim()
  return /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    value
  )
}

/**
 * json形式
 * ※null系はtrue返却。必須チェックは別途行うこと
 * @param value
 * @returns
 */
export function json(value): boolean {
  if (!value) {
    return true
  }

  // objectの場合、json形式としてtrue
  if (typeof value === 'object') {
    return true
  }

  // JSON形式かどうかのチェック
  try {
    JSON.parse(value)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 値の大小
 * ※基準値、比較対象のともに、null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function compare(value: any, compare: Compare): boolean {
  const target = compare.watch(compare.name)
  return compareValue(value, target, compare.type)
}

/**
 * 値の大小
 * ※基準値、比較対象のともに、null系はtrue返却。必須チェックは別途行うこと
 * @param val
 */
export function compareValue(value, targetValue, compareType: CompareType) {
  if (value == null || targetValue == null) {
    return true
  }
  switch (compareType) {
    case CompareType.eq:
      return value == targetValue
    case CompareType.ne:
      return value != targetValue
    case CompareType.lt:
      return value < targetValue
    case CompareType.le:
      return value <= targetValue
    case CompareType.gt:
      return value > targetValue
    case CompareType.ge:
      return value >= targetValue
  }
}

/**
 * 比較エラーのメッセージ表示
 * @param errorLabel
 * @param compare
 */
function getCompareMessage(errorLabel: ReactNode, compare: Compare): string {
  const targetLabel = compare.label
  switch (compare.type) {
    case CompareType.eq:
      return `${errorLabel}は${targetLabel}と同じ${compare.isDate ? '日付' : '値'}である必要があります`
    case CompareType.ne:
      return `${errorLabel}は${targetLabel}と異なる${compare.isDate ? '日付' : '値'}である必要があります`
    case CompareType.lt:
      return `${errorLabel}は${targetLabel}${compare.isDate ? 'より過去の日付' : 'より小さい値'}である必要があります`
    case CompareType.le:
      return `${errorLabel}は${targetLabel}${compare.isDate ? '以前の日付' : '以下の値'}である必要があります`
    case CompareType.gt:
      return `${errorLabel}は${targetLabel}${compare.isDate ? 'より未来の日付' : 'より大きい値'}である必要があります`
    case CompareType.ge:
      return `${errorLabel}は${targetLabel}${compare.isDate ? '以降の日付' : '以上の値'}である必要があります`
  }
}

/**
 * エラー時のスクロール
 * @param errors
 */
export function scrollToError(errors: FieldErrors<any>) {
  const elements = Object.keys(errors)
    .map((name) => document.getElementsByName(name)[0])
    .filter((el) => !!el)
  elements.sort((a, b) => b.scrollHeight - a.scrollHeight)
  elements[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/**
 * nameを使用してスクロール
 * @param name
 */
export function scrollToName(name: string) {
  const elements = document.getElementsByName(name)
  elements[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/**
 * refへスクロール
 * @param errors
 */
export function scrollToRef(ref: React.MutableRefObject<any>) {
  ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

/**
 * nameを使用してエラーを取得
 * ※nameにドットを含む場合、errorsではオブジェクト化しているため、再帰的に取得する
 * @param errors
 * @param name
 */
export function getError<T>(errors: FieldErrors<T>, name: string) {
  if (!errors) {
    return null
  }
  const names = name.split('.')
  let error = errors[names[0]]
  for (let i = 1; i < names.length; i++) {
    if (error == null) {
      break
    }
    error = error[names[i]]
  }
  return error
}

///// RuleInterfaceを使用したバリデーション --------------------------------------------------------------------

/**
 * 固定の値との比較。例：指定のフィールドが0以上
 */
export class CompareValueRule implements RuleInterface {
  /**
   *
   */
  constructor(
    protected targetValue,
    protected compareType: CompareType
  ) {}

  // validate実施
  validate(value: any, errorLabel: string | ReactNode): string {
    if (!required(value)) {
      return null
    }
    // 数値でない場合もnull(別の箇所で判定するため)
    if (!isNumeric(value)) {
      return null
    }
    // 比較結果がtrueの場合は return null
    if (compareValue(value, this.targetValue, this.compareType)) {
      return null
    }
    // compareTypeとtargetValueを使用してエラーメッセージ表示
    switch (this.compareType) {
      case CompareType.eq:
        return `${errorLabel}は${this.targetValue}と同じ値を入力してください`
      case CompareType.ne:
        return `${errorLabel}は${this.targetValue}と異なる値を入力してください`
      case CompareType.lt:
        return `${errorLabel}は${this.targetValue}より小さい値を入力してください`
      case CompareType.le:
        return `${errorLabel}は${this.targetValue}以下の値を入力してください`
      case CompareType.gt:
        return `${errorLabel}は${this.targetValue}より大きい値を入力してください`
      case CompareType.ge:
        return `${errorLabel}は${this.targetValue}以上の値を入力してください`
    }
  }
}

/**
 * 改行ならびに数値であることのバリデーション
 * ※貿易登録番号・受付番号は改行区切りで検索するので、そのバリデーション
 */
export class BreakAndNumberRule implements RuleInterface {
  /**
   *
   * @param maxRows 最大行数
   */
  constructor(
    protected maxRows: number,
    protected params: {
      maxLength?: number
      isCheckNumber?: boolean
    } = null
  ) {}

  // validate関数の実装
  validate(value: any, errorLabel: string | ReactNode): string {
    if (!required(value)) {
      return null
    }
    // 改行で分割
    const lines = value.split(/\r?\n/)
    // 行数チェック
    if (lines.length > this.maxRows) {
      return `${errorLabel}は${this.maxRows}行まで入力可能です`
    }
    // 各行毎にバリデーション
    for (const line of lines) {
      // maxLengthが設定されている場合、各行の文字数チェック
      if (
        required(this.params?.maxLength) &&
        line.length > this.params.maxLength
      ) {
        return `${errorLabel}は1行あたり${this.params.maxLength}文字以内で入力してください`
      }
      // 数値チェック
      if (this.params?.isCheckNumber && !hankakuNum(line)) {
        return `${errorLabel}は半角数字で入力してください`
      }
    }
    return null
  }
}

/**
 * 末尾が「Japan」でないことの判定。新規申込用
 */
export class NotLastJapanRule implements RuleInterface {
  // validate関数の実装
  validate(value: any, errorLabel: string | ReactNode): string {
    if (!required(value)) {
      return null
    }
    if (value.toLowerCase().endsWith('japan')) {
      return `${errorLabel}の末尾には、国名を含めずに記入してください`
    }
    return null
  }
}

/**
 * 末尾が「Japan」であることの判定。変更更新申込用
 */
export class LastJapanRule implements RuleInterface {
  // validate関数の実装
  validate(value: any, errorLabel: string | ReactNode): string {
    if (!required(value)) {
      return null
    }
    if (!value.toLowerCase().endsWith('japan')) {
      return `${errorLabel}の末尾には、「Japan」で終了するように記入してください`
    }
    return null
  }
}

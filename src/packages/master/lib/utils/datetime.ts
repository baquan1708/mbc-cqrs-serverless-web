import { date as dateValidation, time as timeValidation } from './validation'

export function formatDate(
  date: Date | string | number | undefined,
  format: string = 'yyyy年mm月dd日',
  includeDayOfWeek?: boolean
) {
  if (!date) {
    return ''
  }
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  date = toJST(date)

  let str = format.replace(/yyyy/g, date.getFullYear().toString())
  str = str.replace(/mm/g, (date.getMonth() + 1).toString().padStart(2, '0'))
  str = str.replace(/m/g, (date.getMonth() + 1).toString())
  str = str.replace(/dd/g, date.getDate().toString().padStart(2, '0'))
  str = str.replace(/d/g, date.getDate().toString())
  str = str.replace(/HH/g, date.getHours().toString().padStart(2, '0'))
  str = str.replace(/H/g, date.getHours().toString())
  str = str.replace(/MM/g, date.getMinutes().toString().padStart(2, '0'))
  str = str.replace(/M/g, date.getMinutes().toString())
  str = str.replace(/SS/g, date.getSeconds().toString().padStart(2, '0'))
  str = str.replace(/S/g, date.getSeconds().toString())

  if (includeDayOfWeek) {
    str = `${str}（${getDayOfWeek(date)}）`
  }

  return str
}

export function getDayOfWeek(date: Date) {
  return ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
}

export function getCurrentYear() {
  const today = todayJST()
  let currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  if (currentMonth < 3) {
    currentYear = currentYear - 1
  }
  return currentYear
}

export function getCurrentFinancialYear(): {
  start: Date
  mid: Date
  end: Date
} {
  const currentYear = getCurrentYear()
  return getFinancialYearByYear(currentYear)
}

export function getNextFinancialYear(): {
  start: Date
  mid: Date
  end: Date
} {
  const today = todayJST()
  let currentYear = today.getFullYear()
  const currentMonth = today.getMonth()
  if (currentMonth < 3) {
    currentYear = currentYear - 1
  }
  return getFinancialYearByYear(currentYear + 1)
}

export function getFinancialYearByYear(year: number): {
  start: Date
  mid: Date
  end: Date
} {
  const start = toJST(new Date(`${year}-04-01`), true)

  const mid = new Date(start.getTime())
  mid.setMonth(start.getMonth() + 6)

  const end = toJST(new Date(`${year + 1}-04-01`), true)
  end.setDate(end.getDate() - 1)

  return { start, mid, end }
}

export function nowIsFirstHalfFinancialYear(): boolean {
  const { start, mid } = getCurrentFinancialYear()
  const month = todayJST().getMonth()
  return month >= start.getMonth() && month < mid.getMonth()
}

export function toJST(date: Date, isResetDate = false) {
  if (date.getTimezoneOffset() === -540) {
    // Asia/Tokyo
    return date
  }
  const ret = new Date(date.getTime() + (date.getTimezoneOffset() + 540) * 60 * 1000)
  if (isResetDate) {
    ret.setHours(0, 0, 0, 0)
  }

  return ret
}

export function todayJST() {
  const today = new Date()
  return toJST(today, true)
}

export function toUTC(date: Date) {
  return new Date(date.getTime() - (date.getTimezoneOffset() + 540) * 60 * 1000)
}

export function todayUTC() {
  return toUTC(todayJST())
}

export function toISOStringWithTimezone(date: Date) {
  if (!date) {
    return undefined
  }
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    getTimezoneOffset(date)
  )
}

function pad(n: number) {
  return `${Math.floor(Math.abs(n))}`.padStart(2, '0')
}

// Get timezone offset in ISO format (+hh:mm or -hh:mm)
function getTimezoneOffset(date: Date) {
  const tzOffset = -date.getTimezoneOffset()
  const diff = tzOffset >= 0 ? '+' : '-'
  return diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60)
}

/**
 * Date型をyyyy/mm/dd hh:mm:ss形式に変更
 * @param date
 * @param date
 * @returns
 */
export function getYYYYMMDD_HHMMSS(date: Date | string | null, time?: string | null): string {
  if (typeof date == 'string') {
    date = getDate(date as string, time)
  }
  if (date == null) {
    return null
  }
  const yy = ('' + date.getFullYear()).slice(-4)
  const mm = ('00' + (date.getMonth() + 1)).slice(-2)
  const dd = ('00' + date.getDate()).slice(-2)
  const hh = ('00' + date.getHours()).slice(-2)
  const MM = ('00' + date.getMinutes()).slice(-2)
  const SS = ('00' + date.getSeconds()).slice(-2)
  const result = `${yy}/${mm}/${dd} ${hh}:${MM}:${SS}`
  return result
}

/**
 * 文字列をDate形式に変更
 * @param date
 * @param time
 * @returns
 */
export function getDate(date: Date | string | null, time?: string | null): Date | null {
  if (date == null || date == '') {
    return null
  }
  if (Object.prototype.toString.call(date) === '[object Date]') {
    return date as Date
  }

  // "2023-06-20T15:00:00.000Z"の形式で日付に変換できればそれを変換
  if (!isNaN(new Date(date).getTime())) {
    const d = new Date(date)
    if (!!time && timeValidation(time)) {
      const hour = Number(time.substring(0, 2))
      const minute = Number(time.substring(2, 4))
      const second = Number(time.substring(4, 6))
      return new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, second)
    }
    return d
  }

  // yyyyMMdd文字列であれば、それを返却
  if (dateValidation(date)) {
    const year = Number((date as string).substring(0, 4))
    const month = Number((date as string).substring(4, 6))
    const day = Number((date as string).substring(6, 8))

    // timeがある場合、timeでバリデーション
    let hour = 0
    let minute = 0
    let second = 0
    if (!!time && timeValidation(time)) {
      hour = Number(time.substring(0, 2))
      minute = Number(time.substring(2, 4))
      second = Number(time.substring(4, 6))
    }

    // Dateオブジェクトの月は0から始まるため、1を減算します。
    return new Date(year, month - 1, day, hour, minute, second)
  }

  return null
}

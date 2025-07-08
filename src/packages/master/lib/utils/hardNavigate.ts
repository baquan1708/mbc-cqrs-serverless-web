import { redirect } from 'next/navigation'

export function hardNavigate(path: string) {
  if (isBrowser()) {
    window.location.href = path
  } else {
    redirect(path)
  }
}

export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined'
}

export function isServer() {
  return !isBrowser()
}

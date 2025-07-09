import React, { useEffect, useRef } from 'react'

export function useOutsideClick({
  handler,
  listenCapturing = true,
}: {
  handler: () => void
  listenCapturing?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(
    function () {
      function handleClick(e) {
        if (
          ref.current &&
          e.target.tagName !== 'A' &&
          !ref.current.contains(e.target)
        ) {
          handler()
        }
      }

      document.addEventListener('click', handleClick, listenCapturing)

      return () =>
        document.removeEventListener('click', handleClick, listenCapturing)
    },
    [handler, listenCapturing]
  )

  return ref
}

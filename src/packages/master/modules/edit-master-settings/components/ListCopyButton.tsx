'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Button } from '../../../components/ui/button'
import React from 'react'

export default function ListCopyButton() {
  const router = useRouter()

  const pathname = usePathname()

  const handleClick = () => {
    router.push(`${pathname}/copy`)
  }

  return (
    <Button type="button" onClick={handleClick}>
      コピー結果を確認
    </Button>
  )
}

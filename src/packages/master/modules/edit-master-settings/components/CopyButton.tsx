'use client'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '../../../components/ui/button'
import React from 'react'

export default function CopyButton() {
  const router = useRouter()

  const pathname = usePathname() // Lấy URL hiện tại (không có domain, chỉ path)

  const handleClick = () => {
    router.push(`${pathname}/copy/new`)
  }

  return (
    <Button type="button" onClick={handleClick}>
      各地会議所にコピー
    </Button>
  )
}

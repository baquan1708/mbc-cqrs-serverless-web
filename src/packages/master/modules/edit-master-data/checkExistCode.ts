import React from 'react'
import { API_URLS } from '../../lib/constants/url'

export const isCodeUnique = async (httpClient, settingCode, code) => {
  const trimmedCode = code.trim()

  if (!trimmedCode) return false

  try {
    const response = await httpClient.post(
      `${API_URLS.DATA_CODE_CHECK_API_URL}/${encodeURIComponent(
        `${settingCode}#${trimmedCode}`
      )}`
    )

    // !isExist -> true if unique, false if not.
    const isExist = response.data
    return !isExist
  } catch (error) {
    console.error('Failed to check code uniqueness:', error)
    return false
  }
}

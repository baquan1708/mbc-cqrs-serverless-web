import { useCallback, useEffect, useState } from 'react'
import { useHttpClient } from '../../provider'

const MASTER_DATA_PREFIX = 'MASTER#'
const SYSTEM_SETTING_PREFIX = 'SYSTEM_SETTING#'

/**
 * A custom hook to safely fetch a dynamic configuration value from the backend.
 * @param tenantCode The identifier for the CCI (number).
 * @param configKey The name of the configuration key to fetch (string).
 * @param defaultValue The default value to use if not found or on error. The type of this value determines the return type.
 * @returns An object containing the configuration `value` and the `isLoading` state.
 */
export const useDynamicConfig = <T>(
  tenantCode: number,
  configKey: string,
  defaultValue: T
): { value: T; isLoading: boolean } => {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const httpClient = useHttpClient()

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    try {
      const pk = `${MASTER_DATA_PREFIX}${tenantCode}`
      const sk = `${SYSTEM_SETTING_PREFIX}${configKey}`

      const response: any = await httpClient.get(`/master-data/${pk}/${sk}`)

      const valueString = response.attributes?.value || `{}`
      const configValue = JSON.parse(valueString)

      if (configValue && configValue['value'] !== undefined) {
        setValue(configValue['value'])
      } else {
        setValue(defaultValue)
      }
    } catch (error) {
      console.error('Error fetching dynamic config:', error)
      setValue(defaultValue)
    } finally {
      setIsLoading(false)
    }
  }, [tenantCode, configKey, defaultValue])

  useEffect(() => {
    if (tenantCode && configKey) {
      fetchConfig()
    } else {
      setIsLoading(false)
      setValue(defaultValue)
    }
  }, [fetchConfig])

  return { value, isLoading }
}

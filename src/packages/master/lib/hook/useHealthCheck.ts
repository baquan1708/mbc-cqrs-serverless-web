import { useEffect } from 'react'
import { useHttpClient } from '../../provider'
import { API_URLS } from '../constants/url'

const useHealthCheck = () => {
  const httpClient = useHttpClient()
  useEffect(() => {
    const triggerHealth = async () => {
      try {
        await httpClient.get(API_URLS.HEALTH_API_URL)
      } catch (error) {
        console.error('Health check failed:', error)
      }
    }

    triggerHealth()
  }, [])
}

export default useHealthCheck

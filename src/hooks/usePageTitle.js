import { useEffect } from 'react'
import { config } from '../data/config'

export function usePageTitle(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | ${config.storeName}` : config.storeName
  }, [titulo])
}
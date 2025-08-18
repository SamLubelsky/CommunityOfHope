import { useEffect, useRef } from 'react'
import { useNotifications } from '@/utils/notification'

export const useNotificationSetup = () => {
  const { 
    registerForPushNotifications, 
    setupNotificationListeners, 
    cleanupListeners 
  } = useNotifications()

  const notificationListenersRef = useRef<{
    notificationListener: any
    responseListener: any
  } | null>(null)

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications()
      .catch((error: any) => console.error('Failed to register for notifications:', error))

    // Setup notification listeners
    notificationListenersRef.current = setupNotificationListeners()

    return () => {
      // Cleanup notification listeners
      if (notificationListenersRef.current) {
        cleanupListeners(notificationListenersRef.current)
      }
    }
  }, [])

  return {
    notificationListenersRef
  }
}

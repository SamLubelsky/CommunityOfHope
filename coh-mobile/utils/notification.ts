import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import { BACKEND_URL } from '@/app/config'

export interface NotificationService {
  expoPushToken: string
  notification: Notifications.Notification | undefined
  registerForPushNotifications: () => Promise<string | undefined>
  uploadPushToken: (token: string) => Promise<void>
  setupNotificationListeners: () => {
    notificationListener: Notifications.EventSubscription
    responseListener: Notifications.EventSubscription
  }
  cleanupListeners: (listeners: {
    notificationListener: Notifications.EventSubscription
    responseListener: Notifications.EventSubscription
  }) => void
}

class NotificationServiceImpl implements NotificationService {
  expoPushToken: string = ''
  notification: Notifications.Notification | undefined = undefined

  async registerForPushNotifications(): Promise<string | undefined> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync()
      let finalStatus = existingStatus

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
      }

      if (finalStatus !== 'granted') {
        console.error(
          'Permission not granted to get push token for push notification!',
        )
        return undefined
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId
      if (!projectId) {
        console.error('Project ID not found')
        return undefined
      }

      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({ projectId })
        ).data
        this.expoPushToken = pushTokenString
        await this.uploadPushToken(pushTokenString)
        return pushTokenString
      } catch (e: unknown) {
        console.error(`Error getting push token: ${e}`)
        return undefined
      }
    } else {
      console.error('Must use physical device for push notifications')
      return undefined
    }
  }

  async uploadPushToken(token: string): Promise<void> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/upload-token`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pushToken: token }),
      })

      const data = await response.json()
      if (response.ok) {
        console.log(data.message)
      } else {
        console.error(data.error)
      }
    } catch (error) {
      console.error('Error uploading push token:', error)
    }
  }

  setupNotificationListeners() {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        this.notification = notification
      },
    )

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response)
      })

    return {
      notificationListener,
      responseListener,
    }
  }

  cleanupListeners(listeners: {
    notificationListener: Notifications.EventSubscription
    responseListener: Notifications.EventSubscription
  }) {
    const { notificationListener, responseListener } = listeners

    if (notificationListener) {
      Notifications.removeNotificationSubscription(notificationListener)
    }

    if (responseListener) {
      Notifications.removeNotificationSubscription(responseListener)
    }
  }

  // Method to get the current push token for logout
  getPushToken(): string {
    return this.expoPushToken
  }

  // Method to clear the stored notification
  clearNotification(): void {
    this.notification = undefined
  }
}

// Create singleton instance
export const notificationService = new NotificationServiceImpl()

// React hook for using notifications
export const useNotifications = () => {
  return {
    expoPushToken: notificationService.expoPushToken,
    notification: notificationService.notification,
    registerForPushNotifications: () =>
      notificationService.registerForPushNotifications(),
    uploadPushToken: (token: string) =>
      notificationService.uploadPushToken(token),
    setupNotificationListeners: () =>
      notificationService.setupNotificationListeners(),
    cleanupListeners: (listeners: any) =>
      notificationService.cleanupListeners(listeners),
    getPushToken: () => notificationService.getPushToken(),
    clearNotification: () => notificationService.clearNotification(),
  }
}

// Export the service instance for direct use
export default notificationService

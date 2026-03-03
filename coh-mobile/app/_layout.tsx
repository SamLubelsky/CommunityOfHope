import { useBoundStore } from '@/store/useBound'
import { router, Slot, Stack, Tabs } from 'expo-router'
import { setStatusBarStyle } from 'expo-status-bar'
import { useEffect } from 'react'
import { BACKEND_URL } from './config'
import '../global.css'
import { WebSocketProvider } from '@/components/WebSocketProvider'
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Roboto': require('../assets/fonts/Roboto-Regular.ttf'),
  });
  useEffect(() => {
    setTimeout(() => {
      setStatusBarStyle('light')
    }, 0)
  }, [])
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <WebSocketProvider>
      <AuthNavigator />
    </WebSocketProvider>
  )
}
function AuthNavigator() {
  const isSignedIn = useBoundStore((state) => state.isSignedIn)
  const setFirstName = useBoundStore((state) => state.setFirstName)
  const setLastName = useBoundStore((state) => state.setLastName)
  const setId = useBoundStore((state) => state.setId)
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn)
  const setRole = useBoundStore((state) => state.setRole)

  async function verifySession() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/verify-session`, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const responseData = await response.json()
        const { firstName, lastName, userId, role } = responseData
        setFirstName(firstName)
        setLastName(lastName)
        setId(userId)
        setRole(role)
        return true
      } else {
        console.log('Session verification failed:', response.status)
        return false
      }
    } catch (error) {
      console.error('Network error during session verification:', error)
      return false
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const signedIn = await verifySession()
      setIsSignedIn(signedIn)

      // Navigate after authentication check is complete
      if (signedIn) {
        router.replace('/(tabs)')
      } else {
        router.replace('/login')
      }
    }

    checkAuth()
  }, [isSignedIn]) // Empty dependency array - only run once on mount

  // Show loading state while checking authentication

  return <Slot />
}

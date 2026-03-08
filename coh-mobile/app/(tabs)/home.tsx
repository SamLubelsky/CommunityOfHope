import HelpModal from '@/components/HelpModal'
import HelpRequests from '@/components/HelpRequests'
import RequestAVolunteer from '@/components/RequestAVolunteer'
import VideoCard from '@/components/VideoCard'
import { useBoundStore } from '@/store/useBound'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import React, { useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import '../../global.css'
import { BACKEND_URL } from '../config'
import { useWebSocketContext } from '@/components/WebSocketProvider'
import { useNotifications } from '@/utils/notification'
import { useNotificationSetup } from '@/hooks/useNotificationSetup'
import { WebSocketStatus } from '@/components/WebSocketStatus'

export default function Home() {
  const [helpVisible, setHelpVisible] = useState(false)
  const { disconnect } = useWebSocketContext()
  const isFocused = useIsFocused()

  const role = useBoundStore((state) => state.role)
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn)

  // Use the notification service
  const { getPushToken } = useNotifications()

  const [refreshKey, setRefreshKey] = useState(0)
  // Setup notifications
  useNotificationSetup()

  const handleLogout = async () => {
    const body = getPushToken() ? { expoPushToken: getPushToken() } : {}
    const response = await fetch(`${BACKEND_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      const responseData = await response.json()
      console.error(responseData)
    }
    disconnect()
    setIsSignedIn(false)
  }

  return (
    <>
      <SafeAreaView className='flex-1'>
        
        <WebSocketStatus />
        <ScrollView>
          <View className='absolute top-1 left-1 z-10 bg-yellow-100 items-center justify-start mx-2 my-1'>
            <Pressable
              onPress={() => setRefreshKey((prev) => prev + 1)}
              className="w-6 h-6 rounded-full bg-blue-100 border-2 border-blue-700 active:bg-blue-300"
            >
              <Ionicons name="refresh-outline" size={27} color="#1d4ed8" />
            </Pressable>
          </View>
          <View className='rounded-full absolute top-1 right-1 z-10 bg-yellow-100 items-center justify-start mx-2 my-1'>
            <Pressable onPress={() => setHelpVisible(!helpVisible)}>
              <Ionicons name='help-outline' color='#fde047' size={48} />
            </Pressable>
          </View>
          <View className='bg-gray-100 items-center justify-start mx-2 my-1'>
            <Image
              className='mb-5 max-w-12 max-h-10 self-center'
              source={require('@/assets/images/icon.png')}
            />
            <Text className='font-primary text-gray-500 text-center text-6 mt-2'>
              {' '}
              Powered by Community of Hope
            </Text>
            <Text className='text-pink-300 mb-6'>
              "We're here to help, not judge."
            </Text>
            {role === 'Mom' ? <RequestAVolunteer refreshKey={refreshKey}/> : <HelpRequests refreshKey={refreshKey}/>}
            <VideoCard />
            {/* This View ensures Logout is pushed to the bottom when content is short */}
            <View className='flex-1 justify-end w-full items-center my-4'></View>
          </View>
        </ScrollView>
        <Text
          className='mb-1 text-blue-600 font-semibold text-6 text-center font-primary text-5 underline hover:text-blue-400 hover:font-6'
          onPress={handleLogout}>
          Logout
        </Text>
      </SafeAreaView>
      <HelpModal
        isVisible={helpVisible}
        onClose={() => setHelpVisible(false)}
      />
    </>
  )
}

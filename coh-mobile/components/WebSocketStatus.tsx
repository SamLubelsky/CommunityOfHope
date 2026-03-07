import React from 'react'
import { View, Text } from 'react-native'
import { useWebSocketContext } from './WebSocketProvider'

export const WebSocketStatus: React.FC = () => {
  const { isConnected, isConnecting } = useWebSocketContext()

  // Render nothing if connected
  if (isConnected) return null

  return (
    <View className='px-4 py-2'>
      <View
        className={`flex-row items-center ${
          isConnecting ? 'bg-yellow-100' : 'bg-red-100'
        } rounded-lg p-2`}>
        <View
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnecting ? 'bg-yellow-500' : 'bg-red-500'
          }`}
        />
        <Text
          className={`font-primary text-sm ${
            isConnecting ? 'text-yellow-700' : 'text-red-700'
          }`}>
          {isConnecting ? 'Connecting...' : 'Disconnected'}
        </Text>
      </View>
    </View>
  )
}
import React from 'react'
import { View, Text } from 'react-native'
import { useWebSocketContext } from './WebSocketProvider'

export const WebSocketStatus: React.FC = () => {
  const { isConnected, isConnecting } = useWebSocketContext()

  return (
    <View className='px-4 py-2'>
      <View
        className={`flex-row items-center ${
          isConnected
            ? 'bg-green-100'
            : isConnecting
            ? 'bg-yellow-100'
            : 'bg-red-100'
        } rounded-lg p-2`}>
        <View
          className={`w-2 h-2 rounded-full mr-2 ${
            isConnected
              ? 'bg-green-500'
              : isConnecting
              ? 'bg-yellow-500'
              : 'bg-red-500'
          }`}
        />
        <Text
          className={`font-primary text-sm ${
            isConnected
              ? 'text-green-700'
              : isConnecting
              ? 'text-yellow-700'
              : 'text-red-700'
          }`}>
          {isConnected
            ? 'Connected'
            : isConnecting
            ? 'Connecting...'
            : 'Disconnected'}
        </Text>
      </View>
    </View>
  )
}

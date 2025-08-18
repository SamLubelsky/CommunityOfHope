import React, { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useWebSocketContext } from './WebSocketProvider'

export const WebSocketDebug: React.FC = () => {
  const { isConnected, isConnecting, connect, disconnect, getConnectionInfo } =
    useWebSocketContext()
  const [connectionInfo, setConnectionInfo] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const updateInfo = () => {
      setConnectionInfo(getConnectionInfo())
    }

    updateInfo()
    const interval = setInterval(updateInfo, 1000)

    return () => clearInterval(interval)
  }, [getConnectionInfo])

  const handleConnect = () => {
    console.log('Manual connect attempt')
    connect()
  }

  const handleDisconnect = () => {
    console.log('Manual disconnect attempt')
    disconnect()
  }

  if (!showDebug) {
    return (
      <Pressable
        onPress={() => setShowDebug(true)}
        className='absolute top-20 right-2 bg-gray-800 p-2 rounded-full'>
        <Text className='text-white text-xs'>WS</Text>
      </Pressable>
    )
  }

  return (
    <View className='absolute top-20 right-2 bg-gray-800 p-3 rounded-lg max-w-64'>
      <Pressable
        onPress={() => setShowDebug(false)}
        className='absolute top-1 right-1'>
        <Text className='text-white text-xs'>×</Text>
      </Pressable>

      <Text className='text-white text-xs font-bold mb-2'>WebSocket Debug</Text>

      <Text className='text-white text-xs'>
        Status:{' '}
        {isConnected
          ? 'Connected'
          : isConnecting
          ? 'Connecting'
          : 'Disconnected'}
      </Text>

      {connectionInfo && (
        <>
          <Text className='text-white text-xs'>
            Attempts: {connectionInfo.connectionAttempts}
          </Text>
          <Text className='text-white text-xs'>
            Has Socket: {connectionInfo.hasSocket ? 'Yes' : 'No'}
          </Text>
          <Text className='text-white text-xs'>
            Socket ID: {connectionInfo.socketId || 'None'}
          </Text>
        </>
      )}

      <View className='flex-row mt-2 space-x-2'>
        <Pressable
          onPress={handleConnect}
          className='bg-green-600 px-2 py-1 rounded'>
          <Text className='text-white text-xs'>Connect</Text>
        </Pressable>

        <Pressable
          onPress={handleDisconnect}
          className='bg-red-600 px-2 py-1 rounded'>
          <Text className='text-white text-xs'>Disconnect</Text>
        </Pressable>
      </View>
    </View>
  )
}

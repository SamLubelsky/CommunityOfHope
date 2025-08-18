import { WebSocketStatus } from '@/components/WebSocketStatus'
import { Slot } from 'expo-router'
import React from 'react'
export default function RootLayout() {
  return (
    <>
      <WebSocketStatus />
      <Slot />
    </>
  )
}
export const screenOptions = {
  headerShown: true,
}

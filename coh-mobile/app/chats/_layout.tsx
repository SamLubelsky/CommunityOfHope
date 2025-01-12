import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Slot, Stack, Tabs} from 'expo-router';
import { Text } from 'react-native';
export default function RootLayout(){
    console.log("HELLO");   
    return (
        <Slot />
    );
}
export const screenOptions = {
    headerShown: true,
}
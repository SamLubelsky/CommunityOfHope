// Start of Selection
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, Button, Pressable, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from './config';
import { PrimaryButton } from '@/components/PrimaryButton';

export const LoginScreen = () => {
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
  const setPassword = useBoundStore((state) => state.setPassword);
  const setId = useBoundStore((state) => state.setId);
  const setFirstName = useBoundStore((state) => state.setFirstName);
  const setLastName = useBoundStore((state) => state.setLastName);
  const setRole = useBoundStore((state) => state.setRole);
  const password = useBoundStore((state) => state.password);
  const firstName = useBoundStore((state) => state.firstName);
  const lastName = useBoundStore((state) => state.lastName);
  const id = useBoundStore((state) => state.id);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleLogin = async () => {
    // Add your authentication logic here + the api call for the login
    // validate the user credentials
    // call the api for the login
    // update the sign in state in the authenticationSlice
    const response = await fetch(`${BACKEND_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
      credentials: "include",
    });
    const json = await response.json();
    if(response.ok){
      const {firstName, lastName, id, role} = json;
      setFirstName(firstName);
      setLastName(lastName);
      setId(id);
      setIsSignedIn(true);
      setRole(role);
      router.push("/(tabs)");
    }else{
      const error = json.message; 
      setError(error);
      Alert.alert("Login failed", error);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 items-center justify-center px-3">
      <Text className="font-primary text-pink-400 text-7 text-center">EPIC: Emergency Portal For Infant Care</Text>
      <Text className="font-primary text-black text-8 text-center">Login</Text>
        <View className="mx-4 mt-3">
          <KeyboardAvoidingView>
            <Text className="font-primary text-5 mb-1 mt-2">Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername} 
                autoCapitalize="none"
                className="font-primary text-6 h-8 w-12 bg-gray-200 pl-4 rounded-md focus:border-2 border-blue-400"
              />
            
            <Text className="font-primary text-5 mt-5 mb-1">Password</Text>
              <TextInput
                value={password}
                secureTextEntry 
              onChangeText={setPassword}
                className="font-primary text-6 h-8 w-12 mb-5 bg-gray-200 pl-4 rounded-md focus:border-2 border-blue-400"
              />
            <PrimaryButton text="Login" onPress={handleLogin}/>
          </KeyboardAvoidingView>
        </View>
        {error && <Text className="text-red-500 text-5 text-center font-primary text-5">{error}</Text>}
    </View>
  );
};

export default LoginScreen;
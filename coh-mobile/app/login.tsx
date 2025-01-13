// Start of Selection
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, View, Alert, Text, Button, Pressable, TextInput, Platform } from 'react-native';
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';
import { BACKEND_URL } from './config';

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
    <View className="flex-1 bg-gray-100 items-center justify-center">
      <Text className="font-primary text-pink-400 text-10 text-center">Welcome to Epic</Text>
        <View className="m-7">
          <Text className="font-primary text-5 mb-1 mt-5">Username</Text>
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
          <Pressable className="w-11 h-7 bg-blue-200 border self-center rounded-md border-none" onPress={handleLogin}>
            <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Login </Text>
          </Pressable>
        </View>
        {error && <Text className="text-red-500 text-5 text-center font-primary text-5">{error}</Text>}
    </View>
    // <SafeAreaView style={loginStyle.content}>
    //   <PaperProvider>
    //     <Card>
    //       <Card.Title title="Community of Hope Login" />
    //       <Card.Content>
    //         <TextInput 
    //           label="Username" 
    //           value={username}
    //           onChangeText={setUsername} 
    //           autoCapitalize="none"
    //           style={styles.input}
    //         />
    //         <TextInput 
    //           label="Password" 
    //           value={password}
    //           secureTextEntry 
    //           onChangeText={setPassword}
    //           style={styles.input}
    //         />
    //         <Button 
    //           mode="contained" 
    //           onPress={handleLogin}
    //           loading={isLoading}
    //           disabled={isLoading}
    //           style={styles.button}
    //         >
    //           Login
    //         </Button>
    //       </Card.Content>
    //     </Card>
    //   </PaperProvider>
    // </SafeAreaView>
  );
};

// export const loginStyle = StyleSheet.create({
//   content: {
//     flex: 1,
//     backgroundColor: '#F7ACCF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7ACCF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  // fontStyle: {
  //   fontFamily: Platform.select({
  //     android: 'Inter_900Black',
  //     ios: 'Inter-Black',
  //   }),
  // }
});

export default LoginScreen;
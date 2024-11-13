import * as React from 'react';
import {useState} from 'react';
//import { router } from 'expo-router';
import { Button, Card, Provider as PaperProvider, TextInput } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


export const LoginScreen = () => {
  const [state, dispatch] = React.useReducer(
    (prevState: any, action: { type: any; token: any; }) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <SafeAreaView style={loginStyle.content}>
      <PaperProvider>
        <Card>
          <Card.Title title="Community of Hope Login" />
          <Card.Content>
            <TextInput 
              label="Email" 
              value={email}
              keyboardType="email-address"
              onChangeText={setEmail} 
            />
            <TextInput 
              label="Password" 
              value={password}
              secureTextEntry 
              onChangeText={setPassword}
            />
            <Button mode="contained" onPress={handleLogin}>
              Login
            </Button>
          </Card.Content>
        </Card>
      </PaperProvider>
    </SafeAreaView>
  );
};

export const loginStyle = StyleSheet.create({
  content: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgb(255, 192, 203)',
  },
});



export default LoginScreen;
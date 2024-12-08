    // Start of Selection
    import * as React from 'react';
    import { Button, Card, Provider as PaperProvider, TextInput } from 'react-native-paper';
    import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
    import { useBoundStore } from '@/store/useBound';
    import { router } from 'expo-router';
    
    export const LoginScreen = () => {
      const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
      const setEmail = useBoundStore((state) => state.setEmail);
      const setPassword = useBoundStore((state) => state.setPassword);
      const setId = useBoundStore((state) => state.setId);
      const setFirstName = useBoundStore((state) => state.setFirstName);
      const setLastName = useBoundStore((state) => state.setLastName);
      const email = useBoundStore((state) => state.email);
      const password = useBoundStore((state) => state.password);
      const firstName = useBoundStore((state) => state.firstName);
      const lastName = useBoundStore((state) => state.lastName);
      const id = useBoundStore((state) => state.id);
      const [isLoading, setIsLoading] = React.useState<boolean>(false);
    
      const handleLogin = async () => {
        // Add your authentication logic here + the api call for the login
        // validate the user credentials
        // call the api for the login
    
        console.log("signIn pressed");
    
        // update the sign in state in the authenticationSlice
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: email,
            password: password,
          }),
          credentials: "include",
        });
        if(response.ok){
          const json = await response.json();
          const {firstName, lastName, id} = json;
          setFirstName(firstName);
          setLastName(lastName);
          setId(id);
          setIsSignedIn(true);
          console.log("Login successful");
        }else{
          console.log("Login failed");
          Alert.alert("Login failed", "Please try again", [{ text: "OK" }]);
        }
        router.push("/(tabs)");
      };
    
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
                  autoCapitalize="none"
                  style={styles.input}
                />
                <TextInput 
                  label="Password" 
                  value={password}
                  secureTextEntry 
                  onChangeText={setPassword}
                  style={styles.input}
                />
                <Button 
                  mode="contained" 
                  onPress={handleLogin}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.button}
                >
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
        flex: 1,
        backgroundColor: '#F7ACCF',
        justifyContent: 'center',
        alignItems: 'center',
      },
    });
    
    const styles = StyleSheet.create({
      input: {
        marginBottom: 16,
      },
      button: {
        marginTop: 8,
      },
    });
    
    export default LoginScreen;
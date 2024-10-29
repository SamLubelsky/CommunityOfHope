import React from 'react';
import { Button, Card, Provider as PaperProvider, TextInput } from 'react-native-paper';
import { SafeAreaView, StyleSheet } from 'react-native';
export const Login = () => {
  return (
    <SafeAreaView style={loginStyle.content}>
        <PaperProvider>
            <Card>
            <Card.Title title="Community of Hope Login" /> 
            <Card.Content>
                <TextInput label = "Email" keyboardType = "email-address"></TextInput>
                <TextInput label = "Password" secureTextEntry = {true}></TextInput>
                <Button mode="contained" onPress={() => console.log("login is pressed!")}>Login</Button>
              </Card.Content>
            </Card>
        </PaperProvider>
    </SafeAreaView>
    
  );
};
export const loginStyle = StyleSheet.create({
  content: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center", 
    flexDirection: "row",
    backgroundColor: "rgb(255, 192, 203)"

  }
})

export default Login;
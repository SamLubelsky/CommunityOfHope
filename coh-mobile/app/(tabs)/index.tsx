import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Page />
      <StatusBar style="light" />
    </View>
  );
}

export function Page() {
  return (
    <Redirect href="/home"/>
  )
}

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    backgroundColor: '#F7ACCF',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  textContainer: {
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
  },
});
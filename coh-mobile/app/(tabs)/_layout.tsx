import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        headerStyle: {
            backgroundColor: '#0994dc'
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle:{
            backgroundColor: '#0994dc',
        }
    }}>
      <Tabs.Screen name="index" 
      options={{
         title: 'Home',
         tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
         )}} />
      <Tabs.Screen name="about" 
      options={{ title: 'About',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
        ),
       }} />
      <Tabs.Screen name="profile" 
      options={{ title: 'Profile',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={24} />
        ),
       }} />
      <Tabs.Screen name="helpRequests" 
      options={{ title: 'helpRequests',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'accessibility' : 'accessibility-outline'} color={color} size={24} />
        ),
       }} />
    </Tabs>
  );
}
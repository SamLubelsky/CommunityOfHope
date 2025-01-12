import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBoundStore } from '@/store/useBound';
import "../../global.css"
type Props = {
  role: string;
}
export default function TabLayout() {
  const role = useBoundStore((state) => state.role);
  return (
    <Tabs screenOptions={{
        tabBarActiveTintColor: "#ffd33d",
        tabBarInactiveTintColor: '#e4e4e7',
        headerShown: false, 
        headerTintColor: '#fff',
        tabBarStyle:{
          backgroundColor: '#06b6d4',
        }
    }}> 
      
      <Tabs.Screen name="home" 
      options={{
        title: 'Home',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
        )}} />

      <Tabs.Screen name="helpRequests"
      options={{
      href: null
      }} />
      <Tabs.Screen name="about" 
      options={{ title: 'About',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
        ),
        }} />
      <Tabs.Screen name="chats" 
      options={{ title: 'Chats',
        tabBarIcon: ({color, focused}) => (
            <Ionicons name={focused ? 'chatbox' : 'chatbox-outline'} color={color} size={24} />
        ),
        }} />
        <Tabs.Screen name="index"
        options={{
        href: null
      }} 
      />
    </Tabs>);
}
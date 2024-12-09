import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useBoundStore } from '@/store/useBound';
type Props = {
  role: string;
}
export default function TabLayout() {
  const role = useBoundStore((state) => state.role);
  console.log("Role here: ", role);
  // console.log(getCustomTabs(role));
  if(role == 'Mom'){
    return (
      <Tabs screenOptions={{
          tabBarActiveTintColor: "#ffd33d",
          tabBarInactiveTintColor: '#fff',
          headerStyle: {
              backgroundColor: '#0994dc'
          },
          headerShown: false, 
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle:{
              backgroundColor: '#0994dc',
          }
      }}> 
        
        <Tabs.Screen name="requestAVolunteer" 
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
  } else {
    return (
      <Tabs screenOptions={{
          tabBarActiveTintColor: "#ffd33d",
          tabBarInactiveTintColor: '#fff',
          headerStyle: {
              backgroundColor: '#0994dc'
          },
          headerShadowVisible: false,
          headerTintColor: '#fff',
          tabBarStyle:{
              backgroundColor: '#0994dc',
          }
      }}> 
                <Tabs.Screen name="helpRequests" 
        options={{
          title: 'Home',
          tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          )}} />

        <Tabs.Screen name="requestAVolunteer"
        options={{
        href: null
        }} 
        />
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
}
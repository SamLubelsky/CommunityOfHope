import {Image, Platform, Text, View, StyleSheet} from 'react-native';
import { HelloWave } from '@/components/HelloWave'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
export default function AboutScreen() {
    // return (
    // <View style={styles.container}>
    //     <Text style={styles.text}>About Screen</Text>
    // </View>
    // );
    return (
      <View className="flex-1 items-center justify-start bg-gray-100 py-6 px-4">
        <Image className="max-w-12 max-h-12 rounded-full" source={require('@/assets/images/icon.png')} />
        <Text className="font-primary text-pink-400 text-8 mb-5" >About EPIC</Text>
        <Text className="font-primary text-blue-600 text-5 mb-4">
          Epic connects Community of Hope volunteers with moms in the community of hope network.  Here's how it works:
        </Text>
        <Text className="font-primary text-pink-400 text-5 mb-1">Step 1:</Text>
        <Text className="font-primary text-gray-400 text-4 mb-5">A mom submits a request for help, including what she needs help with, if she is an emergency, and any other relevant information.  She may cancel this
          request at any time and for any reason.
        </Text>
        <Text className="font-primary text-pink-400 text-5 mb-1">Step 2:</Text>
        <Text className="font-primary text-gray-400 text-4 mb-5">This request will be sent to Community of Hope volunteers, who can choose to accept the request for help</Text>
        <Text className="font-primary text-pink-400 text-5 mb-1">Step 3:</Text>
        <Text className="font-primary text-gray-400 text-4 mb-5">Once a volunteer accepts the request, the mom will be notified and a chat will be opened between the volunteer and the mom
          so they can coordinate the details of how the volunteer can help.
        </Text>
        <Text className="font-primary text-pink-400 text-5 mb-1">Step 4:</Text>
        <Text className="font-primary text-gray-400 text-4 mb-5">Once a volunteer has finished helping, they can mark this on the Community of Hope app, allowing them to help another volunteer.</Text>
      </View>
      );
    // </View></View><ParallaxScrollView
    //   headerBackgroundColor={{ light: '#F7ACCF', dark: '#F7ACCF' }}
    //   headerImage={
    //     <Image
    //       source={require('@/assets/images/icon.png')}
    //       style={styles.reactLogo}
    //     />
      
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type='title'>Welcome!</ThemedText>
    //     <HelloWave />
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type='subtitle'>Step 1: Request A Volunteer</ThemedText>
    //     <ThemedText>
    //       <ThemedText type='defaultSemiBold'>Request</ThemedText>{' '}
    //       help from a volunteer by going to the homepage, 
    //       clicking on the Request button,
    //       and filling out the form.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type='subtitle'>Step 2: Get A Response</ThemedText>
    //     <ThemedText>
    //       A volunteer will promptly respond to your request and 
    //       you will receive a notification. Your volunteer will likely start the conversation,
    //       asking you about your needs and how they can best help.  If you feel uncomfortable
    //       any point, you can cancel your request.
    //     </ThemedText>
    //   </ThemedView>
    //   <ThemedView style={styles.stepContainer}>
    //     <ThemedText type='subtitle'>Step 3: Get Help</ThemedText>
    //     <ThemedText>
    //       With your permission, your volunteer will come over and help you 
    //       with whatever you need.
    //     </ThemedText>
    //   </ThemedView>
    // </ParallaxScrollView>
    // </View>
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
      color: '#fff',
    },  
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: '#F7ACCF',
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
      backgroundColor: '#F7ACCF',
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
      backgroundColor: '#F7ACCF',
    },
  });
  
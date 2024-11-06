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
    <View style={styles.container}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#BBE5ED', dark: '#BBE5ED' }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='title'>Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 1: Request A Volunteer</ThemedText>
        <ThemedText>
          <ThemedText type='defaultSemiBold'>Request</ThemedText>{' '}
          help from a volunteer by going to the homepage, 
          clicking on the Request button,
          and filling out the form.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 2: Get A Response</ThemedText>
        <ThemedText>
          A volunteer will promptly respond to your request and 
          you will receive a notification. Your volunteer will likely start the conversation,
          asking you about your needs and how they can best help.  If you feel uncomfortable
          any point, you can cancel your request.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type='subtitle'>Step 3: Get Help</ThemedText>
        <ThemedText>
          With your permission, your volunteer will come over and help you 
          with whatever you need.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
    </View>);
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#F7ACCF ',
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
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    reactLogo: {
      height: 178,
      width: 290,
      bottom: 0,
      left: 0,
      position: 'absolute',
    },
  });
  
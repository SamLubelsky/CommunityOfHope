import { Image, Text, View, ScrollView, Linking, useWindowDimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebSocketStatus } from '@/components/WebSocketStatus'
import { useBoundStore } from '@/store/useBound'
import Accordion from '@/components/Accordion'
import { PrimaryButton } from '@/components/PrimaryButton'
import { use } from 'react'

export default function AboutScreen() {
  const role = useBoundStore((state) => state.role)
  const {width} = useWindowDimensions()
  const ratio = 1.505
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <WebSocketStatus />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <Image
          className="self-center max-w-[48px] max-h-[40px] mb-4"
          source={require('@/assets/images/icon.png')}
        />

        {/* Accordions */}
        <Accordion title="About EPIC">
          <Text className="font-primary text-black-600 text-5 mb-4">
          At Community of Hope, we believe that the best opportunities for personal growth come from hands-on experiences. This is the inspiration behind our Community Service Programs, 
          where we encourage our staff and volunteers to use their own experiences - good or bad - to help guide their relationships with the community; promoting transparency to develop trust. 
          Our programs are developed with all backgrounds and skill sets in mind, providing the perfect platform to connect, learn and grow. We are dedicated to providing resources and 
          support for positive mental health and wellness. We do not share, sell or disclose your personal information to third parties without your explicit consent
          except when required by law. Your information is kept confidential and used soley for the purposes you have agreed to.
          </Text>
        </Accordion>

        <Accordion title="Our Mission">
          <Text className="font-primary text-black-600 text-5 mb-4">
            Our mission is to create a positive and supportive environment for young mothers aged 11-19 and expecting mothers. We believe that every
            mother deserves the opportunity to thrive, and we are committed to their mental health and well-being. Through our programs and services,
            we provide young mothers with the resources they need to become self-sufficient and confident parents.
          </Text>
        </Accordion>

        {/* Quote */}
        <Text className="text-center font-primary text-black-600 text-5 mt-4 mb-4">
          "Help Doesn't Stop at Delivery"
        </Text>

        {/* Image */}
        <Image
          className="w-full rounded-[60px] border-3 mb-3"
          style={{width: width - 32, height: (width - 32) / ratio}}
          resizeMode="contain"
          source={require('@/assets/images/resourceHub.png')}
        />

        {/* Button */}
        <PrimaryButton
          text="Find Help"
          onPress={() =>
            Linking.openURL(
              'https://sites.google.com/communityofhopestl.org/epicresourcehub/home'
            )
          }
        />
      </ScrollView>
    </SafeAreaView>
  )
}
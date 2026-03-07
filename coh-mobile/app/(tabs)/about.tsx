import { Image, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebSocketStatus } from '@/components/WebSocketStatus'
import { useBoundStore } from '@/store/useBound'
import Accordion from '@/components/Accordion'
export default function AboutScreen() {
  const role = useBoundStore((state) => state.role)
  return (
    <SafeAreaView className='flex-1'>
      <WebSocketStatus />
      <View className='flex-1 items-center justify-start bg-gray-100 py-6 px-4'>
        <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false}>
          <Image
            className='max-w-12 max-h-10 self-center'
            source={require('@/assets/images/icon.png')}
          />
          <View className='mb-5 mt-2 items-center justify-center flex-1'>
            <Accordion title="About EPIC">
              <Text className='font-primary text-black-600 text-5 mb-4'>
              At Community of Hope, we believe that the best opportunities for
              personal growth come from hands-on experiences. This is the
              inspiration behind our Community Service Programs, where we
              encourage our staff and volunteers to use their own experiences -
              good or bad - to help guide their relationships with the community;
              promoting transparency to develop trust. Our programs are developed
              with all backgrounds and skill sets in mind, providing the perfect
              platform to connect, learn and grow. We are dedicated to providing
              resources and support for positive mental health and wellness. We do
              not share, sell or disclose your personal information to third
              parties without your explicit consent except when required by law.
              Your information is kept confidential and used soley for the
              purposes you have agreed to.
            </Text>
            </Accordion>
            <Accordion title="Our Mission">
              <Text className='font-primary text-black-600 text-5 mb-4'>
                Our mission is to create a positive and supportive environment for
                young mothers aged 11-19 and expecting mothers. We believe that
                every mother deserves the opportunity to thrive, and we are
                committed to their mental health and well-being. Through our
                programs and services, we provide young mothers with the resources
                they need to become self-sufficient and confident parents.
              </Text>
            </Accordion>
            <Accordion title="Wellness/Infant Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Caring 4 Kids (314)-726-5437
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Womens & Infants Center for Fetal Care (314)-747-6539
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Youth In Need (314)-553-9169
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                St. Louis Crisis Nursery (314)-292-5770
              </Text>
            </Accordion>
            <Accordion title="Food Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Urban League of Metropolitan St. Louis (314)-615-3600
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                United Way (2-1-1)
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                St. Louis Area Foodbank (314)-292-6262
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Better Family Life (314)-367-3440
              </Text>       
            </Accordion>
            <Accordion title="Furniture Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Home Sweet Home (314)-448-9838
              </Text>
            </Accordion>
            <Accordion title="Education Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                St. Louis Job Corps (314)-679-2021
              </Text>
            </Accordion>
            <Accordion title="Counseling Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Infant Loss Resource (314)-241-7437
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Annie's Hope Center for Grieving (314)-965-5015
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Haven of Grace Support Counseling (314)-325-1995
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Helping Survivors - helpingsurvivors.org/child-sexual-abuse
              </Text>
            </Accordion>
            <Accordion title="Housing Resources">
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Good Shepard Children & Family (314)-824-5700
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Almost Home (314)-771-4663
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Our Lady's Inn (314)-351-4590
              </Text>
              <Text className='font-primary text-black-400 text-sm mb-3'>
                Haven of Grace (314)-621-6507
              </Text>
            </Accordion>
            <Accordion title = "How to Use the App">
              {role === "Mom" ? 
              <>
                <Text className="font-bold font-primary text-black-400 text-sm mb-3">
                  (All chats are monitored and recorded for safety purposes.)
                </Text>
                <Text className='font-primary text-grey-400 text-sm mb-3'>
                  Steps to use App:
                </Text>
                <Text className='font-primary text-black-400 text-sm mb-3'>
                  1: Submit a Request: Fill out a request for help at [location]. Be
                  sure to include details about what you need. If it is an emergency,
                  clearly state that in your request. You can cancel your request at
                  any time for any reason.
                </Text>
                <Text className='font-primary text-black-400 text-sm mb-3'>
                  2: Request Review: Your request will be added to the Help List,
                  where Community of Hope (COH) volunteers monitor incoming requests.
                  (COH staff and volunteers can view the request in the Community
                  inbox.)
                </Text>
                <Text className='font-primary text-black-400 text-sm mb-3'>
                  3: Volunteer Match & Chat: When a volunteer accepts your request,
                  you will receive a notification. A private chat will open between
                  you and the volunteer only to discuss how they can assist you. (This
                  chat will be recorded and stored.)
                </Text>
              </>
              :
              <>
                <Text className='font-primary text-grey-400 text-sm mb-4'>
                  Steps to use App:
                </Text>
                <Text className='font-primary text-black-400 text-sm mb-3'>
                  1: View the Help Queue: On the homepage, you will see a list of
                  mothers who have requested help, ordered from the oldest request to
                  the newest. Whenever possible, prioritize accepting the oldest
                  request first.
                </Text>
                <Text className='font-primary text-black-400 text-sm mb-3'>
                  2: Accept a Request: When you accept a mothers request, a pop-up
                  will appear with her information and a link to start a conversation.
                  Use the provided link to chat with the mother and coordinate how you
                  can help. (This chat will be recorded and stored.)
                </Text>
              </>
              }
            </Accordion>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

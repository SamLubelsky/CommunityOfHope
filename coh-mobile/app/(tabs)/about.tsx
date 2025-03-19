import {Image, Platform, Text, View, StyleSheet, ScrollView} from 'react-native';
import { HelloWave } from '@/components/HelloWave'
export default function AboutScreen() {
    
    return (
      <View className="flex-1 items-center justify-start bg-gray-100 py-6 px-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image className="max-w-12 max-h-12 rounded-full self-center" source={require('@/assets/images/icon.png')} />
          <Text className="font-primary text-pink-400 text-8 mb-5" >About EPIC</Text>
          <Text className="font-primary text-blue-600 text-5 mb-4">
          At Community of Hope, we believe that the best opportunities for personal growth come from hands-on experiences. This is the inspiration behind our Community Service Programs, 
          where we encourage our staff and volunteers to use their own experiences - good or bad - to help guide their relationships with the community; promoting transparency to develop trust. 
          Our programs are developed with all backgrounds and skill sets in mind, providing the perfect platform to connect, learn and grow. We are dedicated to providing resources and 
          support for positive mental health and wellness. We do not share, sell or disclose your personal information to third parties without your explicit consent
          except when required by law. Your information is kept confidential and used soley for the purposes you have agreed to.
          </Text>
          <Text className="font-primary text-pink-400 text-8 mb-5" >Our Mission</Text>
          <Text className="font-primary text-blue-600 text-5 mb-4">
            Our mission is to create a positive and supportive environment for young mothers aged 11-19 and expecting mothers. We believe that every
            mother deserves the opportunity to thrive, and we are committed to their mental health and well-being. Through our programs and services,
            we provide young mothers with the resources they need to become self-sufficient and confident parents.
          </Text>
          <Text className="font-primary text-black-400 text-5 mb-4">RESOURCES:</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Wellness/Infant:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Nurses for Newborns (314)-544-3433</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">The CHildren's New Baby Hospital at BJC</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Caring 4 Kids (314)-726-5437</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Womens & Infants Center for Fetal Care (314)-747-6539</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Sweet Pea Breastfeeding Support (314)-614-2074</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">All Nanna's Kids Closet (314)-624-0500</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Youth In Need (314)-553-9169</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">St. Louis Crisis Nursery (314)-292-5770</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Food:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Urban League of Metropolitan St. Louis (314)-615-3600</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">United Way 2-1-1</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">St. Louis Area Foodbank (314)-292-6262</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Community Action Agency of St. Louis (314)-863-0015</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Better Family Life (314)-367-3440</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Furniture:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Home Sweet Home (314)-448-9838</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Education:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">St. Louis Job Corps (314)-679-2021</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Counseling:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">National Suicide Hotline: Call or Text 988</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Mary Grove (314)-830-6201</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">The Spot (314)-535-0413</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Queen of Peace (314)-531-0511</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Infant Loss Resource (314)-241-7437</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Annie's Hope Center for Grieving (314)-965-5015</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Haven of Grace Support Counseling (314)-325-1995</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Goal Driven Counseling (855)-524-5222</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Helping Survivors - helpingsurvivors.org/child-sexual-abuse</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Housing:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Good Shepard Children & Family (314)-824-5700</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Almost Home (314)-771-4663</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">MO Bap Children's Home (800)-264-6224</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Our Lady's Inn (314)-351-4590</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Haven of Grace (314)-621-6507</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">Lutheran Children's & Family Services (314)-787-5100</Text>

          <Text className="font-primary text-gray-400 text-4 mb-1"> Smart Saving Strategies For Moms On A Budget:</Text>
          <Text className="font-primary text-pink-400 text-5 mb-5">A guide to help navigate the financial challenges of motherhood with practical, 
            achievable strategies for securing your family's financial well-being: mightymoms.net</Text>


            <Text className="font-primary text-purple-400 text-5 mb-4"> RESOURCES FOR MOM IN APP: </Text>
            <Text className="font-primary text-blue-600 text-4 mb-1"> *Personal Information from Mom to Volunteer in chats is okay!*</Text>
            <Text className="font-primary text-grey-400 text-4 mb-1"> Steps to use App:</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">1: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">2: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">3: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">4: placeholder</Text>


            <Text className="font-primary text-purple-400 text-5 mb-4"> RESOURCES FOR VOLUNTEER IN APP: </Text>
            <Text className="font-primary text-blue-600 text-4 mb-1"> *Personal Information from Volunteer to Volunteer about any Mothers is NOT OKAY. 
              Admins can view chat history and will take action.*</Text>
              <Text className="font-primary text-grey-400 text-4 mb-1"> Steps to use App:</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">1: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">2: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">3: placeholder</Text>
            <Text className="font-primary text-pink-400 text-5 mb-5">4: placeholder</Text>
        </ScrollView>
      </View>
      );
}
  
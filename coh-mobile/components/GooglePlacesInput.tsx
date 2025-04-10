import React from 'react';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import Constants from 'expo-constants';
import { Text } from 'react-native';


const GooglePlacesInput = () => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  console.log("ApiKey:", apiKey);
    if (!apiKey) {
        console.error('Google API key is not defined');
        return <Text className="text-8 text-red-600 ">Error: Google API key is not defined</Text>;
    }
  return (
    <GooglePlacesAutocomplete
    placeholder="Search"
    query={{
      key: apiKey,
      language: 'en', // language of the results
    }}
    onPress={(data, details = null) => console.log(data)}
    styles={{
        textInputContainer: {
          backgroundColor: 'grey',
          width: 200,
          marginLeft: 40,
        },
        textInput: {
          height: 38,
          color: '#5d5d5d',
          fontSize: 16,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
    onFail={(error) => console.error(error)}
    requestUrl={{
      url:
        'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
      useOnPlatform: 'web',
    }} // this in only required for use on the web. See https://git.io/JflFv more for details.
  />
  );
};

export default GooglePlacesInput;
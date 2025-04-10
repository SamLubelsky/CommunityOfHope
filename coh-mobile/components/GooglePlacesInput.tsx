import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
import { Text } from 'react-native';
const apiKey = Constants.expoConfig?.extra?.googleApiKey;

const GooglePlacesInput = () => {
  console.log("ApiKey:", apiKey);
    if (!apiKey) {
        console.error('Google API key is not defined');
        return <Text className="text-8 text-red-600 ">Error: Google API key is not defined</Text>;
    }
  return (
    <GooglePlacesAutocomplete
      placeholder='Search'
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        console.log(data, details);
      }}
      query={{
        key: apiKey,
        language: 'en',
      }}
    />
  );
};

export default GooglePlacesInput;
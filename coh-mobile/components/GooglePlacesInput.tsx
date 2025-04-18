import React, {useState, useCallback, useEffect} from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { BACKEND_URL } from '@/app/config';
import { getLastNotificationResponseAsync } from 'expo-notifications';
import _ from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

interface Location {
  placeId: string;
  placeName: string;
}
type Props = {
  control: any;
}
const GooglePlacesInput = ({control}: Props) => {
  const [autcompletions, setAutocompletions] = useState<Location[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [selected, setSelected] = useState<Location | null>(null);

  const fetchAutocomplete = async (text: string) => {
    if (text.trim() === '') {
      setAutocompletions([]);
      return;
    }
    try {
      const response = await fetch(`${BACKEND_URL}/api/autocomplete`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();
      const locations: Location[] = data.predictions.map((location: any) => ({
        placeId: location.place_id,
        placeName: location.description,
      }));
      setAutocompletions(locations);
    } catch (err) {
      console.error("Error fetching autocomplete:", err);
    }
  };
  
  const debouncedFetchAutocomplete = useCallback(
    _.debounce((text: string) => {
      fetchAutocomplete(text);
    }, 300),
    [] // empty deps ensures it's only created once
  );

  useEffect(() => {
    return () => {
      debouncedFetchAutocomplete.cancel();
    };
  }, [debouncedFetchAutocomplete]);
  


  const AutocompleteOptions = ({onChange}: {onChange: any}) => {

    const autcompletionsList = autcompletions.map((location: Location) => {
      return (
        <View key={location.placeId} className="bg-white border-b border-gray-300">
          <Pressable onPress={()=>{
            setSelected(location);
            setAutocompletions([]);
            setInputValue(location.placeName);
            onChange(location);
          }}>
            <Text className="px-2 py-3 text-3">{location.placeName}</Text>
          </Pressable>
        </View>
      );
    });
    return <>
    {autcompletionsList}
    </>
  }



  return (
    <Controller
      control={control}
      name="location"
      rules={{
        required: "Please select a location from the selections",
        validate: (value) => {
          if (!value || typeof value !== 'object') {
            return "Please select a location from the selections";
          }
          return true;
        },
      }}
      render={({ field: { onChange, value}, fieldState: {error} }) => (
        <View className="">
          <TextInput
          editable
          onChangeText={text=> {
            setInputValue(text); 
            setSelected(null);
            debouncedFetchAutocomplete(text); 
            onChange(null)}}
          value={inputValue}
          placeholder='Your Location Here'
          className='px-2 border-2 rounded-md focus:border-blue-500'
          />
          <AutocompleteOptions onChange={onChange}/>  
          {error?.message && (
            <Text className="text-red-500 px-2 pt-1 text-sm">{error.message}</Text>
          )}
        </View>
      )}
      />
  );

};

export default GooglePlacesInput;
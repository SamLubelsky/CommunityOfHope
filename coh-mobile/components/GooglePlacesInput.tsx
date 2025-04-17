import React, {useState, useCallback, useEffect} from 'react';
import { View, TextInput, Text, Pressable } from 'react-native';
import { BACKEND_URL } from '@/app/config';
import { getLastNotificationResponseAsync } from 'expo-notifications';
import _ from 'lodash';

interface Location {
  placeId: string;
  placeName: string;
}
type Props = {
  onSelection: (location: Location) => void;
}
const GooglePlacesInput = ({onSelection}: Props) => {
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

  const selectAutocomplete = async (location: Location) => {
    setSelected(location);
    onSelection(location);
    onChangeText(location.placeName);
    setAutocompletions([]);
  }
  const AutocompleteOptions: React.FC = () => {

    const autcompletionsList = autcompletions.map((location: Location) => {
      return (
        <View key={location.placeId} className="bg-white border-b border-gray-300">
          <Pressable onPress={()=>selectAutocomplete(location)}>
            <Text className="p-2">{location.placeName}</Text>
          </Pressable>
        </View>
      );
    });
    return <>
    {autcompletionsList}
    </>
  }

  const [autcompletions, setAutocompletions] = useState<Location[]>([]);
  const [selected, setSelected] = useState<Location | null>(null);
  const [value, onChangeText] = useState<string>('');

  return (
    <View className="border-2 border-gray-500 rounded-md ">
      <TextInput
      editable
      onChangeText={text=> {onChangeText(text); debouncedFetchAutocomplete(text)}}
      value={value}
      placeholder='Your Location Here'
      className='px-2 py-2 hover:border-blue-500'
      />

      <AutocompleteOptions/>
      
    </View>
  );

};

export default GooglePlacesInput;
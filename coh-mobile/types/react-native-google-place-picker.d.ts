declare module 'react-native-google-place-picker' {
    interface PlaceResponse {
      name?: string;
      address?: string;
      didCancel?: boolean;
      error?: string;
      [key: string]: any; // fallback for other possible keys
    }
  
    const RNGooglePlacePicker: {
      show(callback: (response: PlaceResponse) => void): void;
    };
  
    export default RNGooglePlacePicker;
  }
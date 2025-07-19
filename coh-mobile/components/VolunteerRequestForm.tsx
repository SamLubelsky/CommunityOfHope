import {Modal, Text, View, Pressable} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useForm, SubmitHandler} from 'react-hook-form'; 
import TextareaInput from './TextareaInput';
import CheckboxInput from './CheckboxInput';
import { useBoundStore } from '@/store/useBound';
import { BACKEND_URL } from '../app/config';
import React, {useState} from 'react';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import GooglePlacesInput from './GooglePlacesInput';
interface Location {
    placeId: string;
    placeName: string;
}
type Props = {
    isVisible: boolean;
    onClose: () => void;
    setHelpStatus: any;
    setDescription: any;
}
type FormData = {
    description: string;
    emergency: boolean;
    info?: string;
    location: Location | null;
}
export default function VolunteerRequestForm({isVisible, onClose, setHelpStatus, setDescription}: Props){
    const firstName = useBoundStore((state) => state.firstName);
    const id = useBoundStore((state) => state.id);
    const [isConfirming, setIsConfirming] = useState(false);
    const [data, setData] = useState<FormData | null>(null);
    const [location, setLocation] = useState<Location | null>(null);
    const {control, watch, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            emergency: false,
            description: '',
            info: '',
            location: null,
        }
    });
    const emergencyValue = watch('emergency')
    const onConfirm = async () =>{
        if(data === null){
            console.log("The program encountered an unexpected error")
            return;
        }
        const mom_id = id;
        const {description, emergency, info, location} = data;
        const response = await fetch(`${BACKEND_URL}/api/help_requests`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mom_id, description, emergency, info, placeId: location?.placeId, placeName: location?.placeName }),
            credentials: 'include',
        }); 
        const json = await response.json();
        if(!response.ok){
            console.error(json);
        }  
        setHelpStatus("Requested");
        setDescription(description);
        onClose();
        setIsConfirming(false);
    }
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        console.log("Submitting");
        if(!data.emergency){
            const {description, emergency, info, location} = data;
            const mom_id = id;
            const response = await fetch(`${BACKEND_URL}/api/help_requests`, {
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mom_id, description, emergency, info, placeId: location?.placeId, placeName: location?.placeName }),
                credentials: 'include',
            }); 
            const json = await response.json();
            if(!response.ok){
                console.error(json);
            }  
            setHelpStatus("Requested");
            setDescription(description);
            onClose();
        } else{
            setData(data);
            setIsConfirming(true);
        }
    }
    const showPlacePicker = () => {
        // @ts-ignore
        RNGooglePlacePicker.show((response) => {
            if (response.didCancel) {
                console.log('User cancelled GooglePlacePicker');
            } else if (response.error) {
                console.log('GooglePlacePicker Error:', response.error);
            } else {
                const { name, address } = response;
                console.log('Selected Place:', name, address);
                // You can set this info to your form if needed:
                // setValue('info', `${name}, ${address}`);
            }
        });
    };
    
    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style = {styles.container}>
        <>

        <Modal animationType="slide" visible={isVisible} transparent={true}>

            <View className="rounded-xl mt-3 justify-center px-2 py-5 self-center bg-gray-200"> 
                <Text className="font-primary text-pink-400 text-7 text-center mt-2">Request a Volunteer</Text>
                <View className="absolute top-2 right-2 text-gray-500">
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={28} />
                    </Pressable>
                </View>
                {/* <View className="mt-5"> */}
                {/* <Text className="text-center font-primary text-blue-500 text-7 mb-3">Location</Text> */}
                {/* </View> */}
                <Text className="font-primary text-center text-blue-500 text-7 mb-3"> Your Location</Text>
                <GooglePlacesInput control={control}/>
                <View className="items-center mt-3">
                    <Text className="font-primary text-blue-500 text-7 mb-3">Description</Text>
                    <Text className="font-primary text-gray-500 text-2 mb-1">What do you need help with?</Text>
                    <TextareaInput name="description" control={control} required={true} lines={1}/>
                    {errors.description  && <Text className="mt-2 mb-1 text-red-500">This field is required</Text>}
                </View>

                <View className="items-center py-2 gap-2 my-6">
                    <View className="flex-row items-center gap-2">
                        <Text className="font-primary top-1 text-gray-400 text-4 mb-2">Is this an emergency? </Text>
                        <CheckboxInput name="emergency" control={control} color='gray'/>
                    </View>
                    <Text className="font-primary text-center text-red-500 text-4 font-7 mt-2">
                        {emergencyValue ? "If this is a medical emergency, do NOT submit a help request. Instead, call 911"
                        : "Emergencies are time sensitive, crisis situations"}
                    </Text> 
                </View>



                {/* <View className="items-center mt-5">
                    <Text className="font-primary text-blue-500 text-7 mb-3">Additional Information</Text>
                    <Text className="font-primary text-gray-500 text-2 mb-1">Are there any other details you want to share?</Text>
                    <TextareaInput name="info" control={control} required={false} lines={2}/>
                </View> */}

                <Pressable className="w-11 h-7 mt-5 bg-blue-200 border self-center rounded-md border-none" onPress={handleSubmit(onSubmit)}>
                    <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">Submit</Text>
                </Pressable>

            </View>
        </Modal>

         <Modal animationType="slide" visible={isConfirming} transparent={true}>
            <View className="w-12 rounded-xl p-5 z-10 absolute left bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-gray-300">
                <Text className={'text-red-500 font-primary font-7 text-5 mb-5 text-center'}>Are you sure this is NOT a medical emergency </Text>
                <SecondaryButton text="Yes, this is NOT a medical emergency" onPress={onConfirm}/>
                <PrimaryButton text="No" onPress={()=>setIsConfirming(false)}/>
            </View>
         </Modal>
         </>
    )
}
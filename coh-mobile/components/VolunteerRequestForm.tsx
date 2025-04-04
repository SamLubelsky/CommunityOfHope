import {Modal, StyleSheet, Text, Button, View, Pressable} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useForm, Controller, SubmitHandler} from 'react-hook-form'; 
import {SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context'
import TextareaInput from './TextareaInput';
import CheckboxInput from './CheckboxInput';
import { useBoundStore } from '@/store/useBound';
import { BACKEND_URL } from '../app/config';
import React, {useState} from 'react';
import { ErrorContext } from '@/components/ErrorBoundary';
import {handleError} from '@/utils/error';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
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
}
export default function VolunteerRequestForm({isVisible, onClose, setHelpStatus, setDescription}: Props){
    const firstName = useBoundStore((state) => state.firstName);
    const id = useBoundStore((state) => state.id);
    const [isConfirming, setIsConfirming] = useState(false);
    const [data, setData] = useState<FormData | null>(null);
    const {control, watch, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            emergency: false,
            description: '',
            info: '',
        }
    });
    const emergencyValue = watch('emergency')
    const throwError = React.useContext(ErrorContext);
    const onConfirm = async () =>{
        if(data === null){
            console.log("The program encountered an unexpected error")
            return;
        }
        const mom_id = id;
        const {description, emergency, info} = data;
        const response = await fetch(`${BACKEND_URL}/api/help_requests`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mom_id, description, emergency, info}),
            credentials: 'include',
        }); 
        const json = await response.json();
        if(!response.ok){
            handleError(throwError, json);
        }  
        setHelpStatus("Requested");
        setDescription(description);
        onClose();
        setIsConfirming(false);
    }
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setData(data);
        setIsConfirming(true);
        if(!data.emergency){
            onConfirm();
        }
    }
    
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

                <View className="items-center py-2 gap-2 my-4">
                    <View className="flex-row items-center gap-2">
                        <Text className="font-primary top-1 text-gray-400 text-4 mb-2">Is this an emergency? </Text>
                        <CheckboxInput name="emergency" control={control} color='gray'/>
                    </View>
                    <Text className="font-primary text-center text-red-500 text-4 font-7 mt-2">
                        {emergencyValue ? "If this is a medical emergency, do NOT submit a help request. Instead, call 911"
                        : "Emergencies are time sensitive, crisis situations"}
                    </Text> 
                </View>
                <View className="items-center mt-3">
                    <Text className="font-primary text-blue-500 text-7 mb-3">Description</Text>
                    <Text className="font-primary text-gray-500 text-2 mb-1">What do you need help with?</Text>
                    <TextareaInput name="description" control={control} required={true} lines={1}/>
                    {errors.description  && <Text className="mt-2 mb-1 text-red-500">This field is required</Text>}
                </View>

                <View className="items-center mt-5">
                    <Text className="font-primary text-blue-500 text-7 mb-3">Additional Information</Text>
                    <Text className="font-primary text-gray-500 text-2 mb-1">Are there any other details you want to share?</Text>
                    <TextareaInput name="info" control={control} required={false} lines={2}/>
                </View>

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
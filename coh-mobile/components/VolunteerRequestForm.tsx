import {Modal, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import Button from './Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useForm, Controller, SubmitHandler} from 'react-hook-form'; 
import {SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context'
import TextareaInput from './TextareaInput';
import CheckboxInput from './CheckboxInput';
import { useBoundStore } from '@/store/useBound';
import { BACKEND_URL } from '../app/config';
import React, {useState} from 'react';
type Props = {
    isVisible: boolean;
    onClose: () => void;
    setHelpStatus: any;
}
type FormData = {
    description: string;
    emergency: boolean;
}
export default function VolunteerRequestForm({isVisible, onClose, setHelpStatus}: Props){
    const firstName = useBoundStore((state) => state.firstName);
    const id = useBoundStore((state) => state.id);
    const {control, watch, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            emergency: false,
            description: '',
            info: '',
        }
    });
    const emergencyValue = watch('emergency')

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const description = data.description;
        console.log("data:", data);
        const mom_id = id;
        const mom_name = firstName;
        const response = await fetch(`${BACKEND_URL}/api/help_requests`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mom_id, description, }),
            credentials: 'include',
        }); 
        const json = await response.json();
        setHelpStatus("Requested");
        onClose();
    }
    return (
        // <SafeAreaProvider>
        //     <SafeAreaView style = {styles.container}>
        <Modal animationType="slide" visible={isVisible}>
            <View style={[styles.modalContainer]}> 
                <Text style={styles.text}>Request a Volunteer</Text>

                <View style={styles.closeButton}>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                    </Pressable>
                </View>

                <View style={styles.fixedContainer}>
                    <View style={[styles.fixedContainer, {flexDirection: 'row'}]}>
                        <Text style={styles.inputLabel}>Is this an emergency? </Text>
                        <CheckboxInput name="emergency" control={control} color='white'/>
                    </View>
                    {!emergencyValue && <Text style={styles.warning}>Emergencies are time sensitive, crisis situations </Text>}
                    {emergencyValue && <Text style={styles.warning}> If this is a medical emergency, do NOT submit a help request.  Instead, call 911.</Text>}
                </View>

                <View style={styles.fixedContainer}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <Text style={styles.innerLabel}>What do you need help with?</Text>
                    <TextareaInput name="description" control={control} required={true} lines={3}/>
                    {errors.description  && <Text style={styles.error}>This field is required</Text>}
                </View>

                <View style={styles.fixedContainer}>
                    <Text style={styles.inputLabel}>Additional Information</Text>
                    <Text style={styles.innerLabel}>Are there any other details you want to share?</Text>
                    <TextareaInput name="info" control={control} required={false} lines={2}/>
                </View>

                <Button label="Submit" onPress={handleSubmit(onSubmit)}/>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20, 
    },
    headingContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    modalContainer: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#F7ACCF',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    fixedContainer: {
        backgroundColor: '#F7ACCF',
        alignItems: 'center',
        padding: 10,
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#F7ACCF',
        alignItems: 'center',
    },
    inputLabel: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: '700',
    },
    warning: {
        color: 'red',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: '700',
    },
    innerLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: '500',
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        width: 300,
        padding: 10,
        marginBottom: 10,
    },
    error:{
        marginTop: -5,
        marginBottom: 10,
        color: 'red',
    },
})
import {Modal, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import Button from './Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useForm, Controller, SubmitHandler} from 'react-hook-form'; 
import {SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context'
import Input from './Input';
import { useBoundStore } from '@/store/useBound';
type Props = {
    isVisible: boolean;
    onClose: () => void;
}
type FormData = {
    category: string;
    description: string;
}
export default function VolunteerRequestForm({isVisible, onClose}: Props){
    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            category: '',
            description: '',
        }
    });
    const firstName = useBoundStore((state) => state.firstName);
    const id = useBoundStore((state) => state.id);
    const onSubmit: SubmitHandler<FormData> = async (data) => {

        const description = data.description;
        const mom_id = id;
        const mom_name = firstName;
        const response = await fetch('http://localhost:3000/api/help_requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mom_id, mom_name, description }),
            credentials: 'include',
        }); 
        const json = await response.json();
        console.log(json);
        onClose();
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style = {styles.container}>
                <Modal animationType="slide" visible={isVisible}>
                    <View style={styles.container}> 
                        {/* <View style={styles.headingContainer}> */}
                            <Text style={styles.text}>Request a Volunteer</Text>
                            <View style={styles.closeButton}>
                                <Pressable onPress={onClose}>
                                    <MaterialIcons name="close" color="#fff" size={22} />
                                </Pressable>
                            </View>
                        {/* </View> */}
                        <Text style={styles.inputLabel}>Category</Text>
                        {/* <TextInput placeholder="Category" style={styles.input}/> */}
                        <Text style={styles.inputLabel}>What do you need help with?</Text>
                        {/* <TextInput placeholder="Additional Info" style={styles.input}/> */}
                        <Input name="description" control={control}/>
                        {errors.description  && <Text style={styles.error}>This field is required</Text>}
                        <Button label="Submit" onPress={handleSubmit(onSubmit)}/>
                    </View>
                </Modal>
            </SafeAreaView>
        </SafeAreaProvider>
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
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#F7ACCF',
        alignItems: 'center',
    },
    inputLabel: {
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
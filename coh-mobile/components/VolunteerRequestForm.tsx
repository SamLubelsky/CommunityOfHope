import {Modal, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import Button from './Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useForm, Controller, SubmitHandler} from 'react-hook-form'; 
import {SafeAreaView,SafeAreaProvider } from 'react-native-safe-area-context'

type Props = {
    isVisible: boolean;
    onClose: () => void;
}
type FormData = {
    category: string;
    description: string;
}
type InputProps={
    name: string;
    control: any;
}
const Input = ({name, control}: InputProps) => {
    return (
    <Controller 
    control={control}
    rules={{
        required: true,
    }}
    render={({field: {onChange, onBlur, value}}) => (
        <TextInput 
        placeholder={name}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        style={styles.input}
        placeholderTextColor="#64748b"
        />
    )}
    name={name}
    />);
}
export default function VolunteerRequestForm({isVisible, onClose}: Props){
    const {control, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            category: '',
            description: '',
        }
    });
    const onSubmit: SubmitHandler<FormData> = async (data) => {
        const category = data.category;
        const description = data.description;

        const response = await fetch('/api/submitLogin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category, description }),
        });
        const json = await response.json();
        console.log(json);
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
                        <Input name="category" control={control} />
                        {errors.category && <Text style={styles.error}>This field is required</Text>}
                        <Text style={styles.inputLabel}>Additional Info</Text>
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
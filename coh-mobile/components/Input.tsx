import {Controller} from 'react-hook-form'; 
import { TextInput, StyleSheet } from 'react-native';
type Props={
    name: string;
    control: any;
}
export default function Input({name, control}: Props){
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
const styles = StyleSheet.create({
    input: {
        backgroundColor: '#fff',
        width: 300,
        padding: 10,
        marginBottom: 10,
    },
})
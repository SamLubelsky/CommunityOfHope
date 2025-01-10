import {Controller} from 'react-hook-form'; 
import { TextInput, StyleSheet } from 'react-native';
type Props={
    name: string;
    control: any;
    required: boolean;
    lines: number;
}
export default function TextareaInput({name, control, required, lines}: Props){
    return (
        <Controller 
        control={control}
        rules={{
            required: required,
        }}
        render={({field: {onChange, onBlur, value}}) => (
            <TextInput 
            placeholder={name}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className="bg-gray-100 w-13 p-2 mb-2 rounded-md focus:border-2 border-blue-300"
            multiline={true}
            numberOfLines={lines}
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
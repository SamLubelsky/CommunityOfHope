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
            className="bg-gray-100 w-12 p-2 mb-2 rounded-md border-2 border-gray-500 focus:border-blue-500"
            multiline={true}
            numberOfLines={lines}
            placeholderTextColor="#64748b"
            />
        )}
        name={name}
        />);
}
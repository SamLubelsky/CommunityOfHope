import {Controller} from 'react-hook-form'; 
import { TextInput, StyleSheet } from 'react-native';
type Props={
    name: string;
    control: any;
    required: boolean;
    lines: number;
    placeholder?: string;
    minLength?: number;
    maxLength?: number;
}
export default function TextareaInput({name, control, required, lines, placeholder=name, minLength, maxLength}: Props){
    const rules: any = {};
    if (required) {
        rules.required = 'This field is required';
    }

    if (minLength !== undefined) {
        rules.minLength = {
        value: minLength,
        message: `Must be at least ${minLength} characters`,
        };
    }

    if (maxLength !== undefined) {
        rules.maxLength = {
        value: maxLength,
        message: `Must be at most ${maxLength} characters`,
        };
    }

    return (
        <Controller 
        control={control}
        rules={rules}
        render={({field: {onChange, onBlur, value}}) => (
            <TextInput 
            placeholder={placeholder}
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
import { TextInput } from "react-native"
type Props = {
    value: string;
    secureTextEntry?: boolean;
    onChangeText: any;
    className?: string;
}
export default function TextField({value, secureTextEntry, onChangeText, className}: Props){
    return <TextInput>
        value={value}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        className={className}
    </TextInput>
}
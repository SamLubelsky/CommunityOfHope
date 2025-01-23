import React, {useState} from 'react';
import { Modal, View, Text } from 'react-native';
import CheckboxInput from './CheckboxInput';
import { useForm, SubmitHandler} from 'react-hook-form';
import { PrimaryButton } from './PrimaryButton';
type Props = {
    children: React.ReactNode;
    onSuccess: () => void;
}
type FormData = {
    consent: boolean;
}
export const ConsentScreen = ({children, onSuccess}: Props) => {
    const [error, setError] = useState<null | string>(null);

    const {control, watch, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            consent: false,
        }
    });
    const consentValue = watch('consent');
        const onSubmit: SubmitHandler<FormData> = async (data) => {
            if(consentValue){
                console.log("Consent given");
                onSuccess();
            } else{
                console.log("Consent not given");
                setError("Please accept the conditions to proceed");
            }
        }
    return (
    <Modal animationType="slide" transparent={true}>
        <View className="w-full h-full bg-gray-300 bg-opacity-90">
            {children}
            <CheckboxInput name="consent" control={control} color='gray'/>
            <PrimaryButton text="Submit" onPress={handleSubmit(onSubmit)} />
            {error && <Text className="text-red-500">{error}</Text>}
        </View>
    </Modal>
    );
}
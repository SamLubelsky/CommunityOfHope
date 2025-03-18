import { Pressable, View, Text, Modal } from "react-native";
import React, {useState} from 'react';
import { SecondaryButton } from "./SecondaryButton";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
    onConfirm: () => void;
    children: React.ReactNode;
    className: string;
    confirmText: string;
    danger: boolean;
}
export const ButtonWithConfirmation = ({ onConfirm, danger, children, className, confirmText }: Props) => {
    const [isConfirming, setIsConfirming] = useState(false);
    const handleClick = () => {
        setIsConfirming(false);
        onConfirm();
    }
    return (
        <>
        <Pressable className={className} onPress={() => setIsConfirming(true)}>
            {children}
        </Pressable>
        <Modal animationType="slide" visible={isConfirming} transparent={true}>
            <View className="w-12 rounded-3xl p-5 z-10 absolute left bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 bg-gray-300 border-black-500 border-2">
                <Text className={`${danger ? 'text-red-500' : 'text-yellow-600'} leading-normal font-primary font-7 text-5 mb-5 text-center`}>{confirmText}</Text>
                <PrimaryButton text="Yes" onPress={handleClick}/>
                <SecondaryButton text="No" onPress={()=>setIsConfirming(false)}/>
            </View>
        </Modal>
        </>
    );
}
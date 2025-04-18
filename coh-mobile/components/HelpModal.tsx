import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Pressable, View, Text, Linking } from "react-native"
import { PrimaryButton } from "./PrimaryButton";
type Props = {
    isVisible: boolean;
    onClose: () => void;
}
export default function HelpModal({isVisible, onClose}: Props){
    const helpVideoUrl= "https://www.youtube.com/watch?v=Xgd5c26qT08";
    return (
        <Modal animationType="slide" visible={isVisible} transparent={true}>
            <View className="flex-1 justify-center items-center bg-gray-900/50">
                <View className="rounded-xl mt-3 justify-center px-4 py-6 self-center bg-gray-200">
                    <View className="absolute top-2 right-2 text-gray-500">
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" color="#fff" size={40} />
                        </Pressable>
                    </View>
                    <View className="mt-5">
                        <PrimaryButton
                        text="Watch Help Video"
                        onPress={()=>Linking.openURL(helpVideoUrl)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}
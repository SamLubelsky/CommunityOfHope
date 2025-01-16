import { Pressable, Text} from "react-native"
type Props = {
    text: string;
    onPress: () => void;
}
export const PrimaryButton = ({text, onPress}: Props) => {
    return (
        <Pressable className="py-2 px-5 mb-5 bg-blue-200 border self-center rounded-md border-none" onPress={onPress}>
            <Text className="text-blue-700 text-6 text-center font-primary text-5 m-auto">{text}</Text>
        </Pressable>
    )
}
import { Pressable, Text} from "react-native"
type Props = {
    text: string;
    onPress: () => void;
}
export const SecondaryButton = ({text, onPress}: Props) => {
    return (
        <Pressable className="mb-3 px-2 py-2 bg-gray-100 border self-center rounded-md border-blue-300 border-2 hover:bg-blue-200 bg-gray-200" 
        onPress={onPress}>
            <Text className="text-blue-500 text-6 text-center font-primary text-5 m-auto">{text}</Text>
        </Pressable>
    )
}
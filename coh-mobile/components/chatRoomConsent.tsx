import { ConsentScreen } from "./ConsentScreen"
import { Text } from "react-native";
type Props = {
    onSuccess: () => void;
}
export const chatRoomConsent = ({onSuccess}: Props) => {
    return( 
        <ConsentScreen onSuccess={onSuccess}>
            <Text className="font-primary text-blue-600 text-7 mb-3">I agree to the following:</Text>
            <Text className="font-primary text-blue-600 text-7 mb-3">I will not expose private information about
                myself or others, including but not limited to names, addresses, phone numbers, and email addresses.
            </Text>
        </ConsentScreen>
    );
}

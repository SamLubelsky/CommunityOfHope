import {Modal, StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
import Button from './Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
type Props = {
    isVisible: boolean;
    onClose: () => void;
}
export default function VolunteerRequestForm({isVisible, onClose}: Props){
    return (
        <Modal animationType="slide" visible={isVisible}>
            <View style={styles.container}>
                {/* <View style={styles.headingContainer}> */}
                    <Text style={styles.text}>Request a Volunteer</Text>
                    <View style={styles.closeButton}>
                        <Pressable onPress={onClose}>
                            <MaterialIcons name="close" color="#fff" size={22} />
                        </Pressable>
                    </View>
                {/* </View> */}
                <Text style={styles.inputLabel}>Category</Text>
                <TextInput placeholder="Category" style={styles.input}/>
                <Text style={styles.inputLabel}>Additional Info</Text>
                <TextInput placeholder="Additional Info" style={styles.input}/>
                <Button label="Submit"/>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20, 
    },
    headingContainer: {
        flex: 1, 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        paddingTop: 20,
        flex: 1,
        backgroundColor: '#F7ACCF',
        alignItems: 'center',
    },
    inputLabel: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'left',
        fontWeight: '500',
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        width: 300,
        padding: 10,
        marginBottom: 10,
    }
})
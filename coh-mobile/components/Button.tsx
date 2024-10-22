import {StyleSheet, View, Pressable, Text}  from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
    label: string;
    theme?: 'primary',
    onPress?: () => void;
}

export default function Button({label, onPress}: Props){
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.text}>{label}</Text>
        </Pressable>
    )
}
const styles= StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#BBE5ED',
        marginBottom: 20,
      },
      text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
      },
});
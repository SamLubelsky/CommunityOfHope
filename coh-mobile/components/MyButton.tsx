import {StyleSheet, View, Pressable, Text, ViewStyle}  from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
    label: string;
    onPress?: () => void;
}

export default function MyButton({label, onPress}: Props){
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
        backgroundColor: '#0994dc',
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
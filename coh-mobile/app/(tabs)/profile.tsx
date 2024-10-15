import {View, Text, StyleSheet} from 'react-native';
import ImageViewer from '@/components/ImageViewer';
const placeholderImage = require('@/assets/images/profilePicture.jpg')

export default function Profile(){
    return (
    <View style={styles.container}>
        <View style={styles.nameContainer}>
            <Text style={styles.text}>
                Sam Lubelsky has helped <strong>13</strong> moms through EPIC
            </Text>
        </View>
        <View style={styles.imageContainer}>
            <ImageViewer imgSource={placeholderImage}/>
        </View>
    </View>
    );
}
const styles = StyleSheet.create({
    container:
    {
      flex: 1,
      backgroundColor: '#25292e',
      alignItems: 'center',
    }, 
    imageContainer:{
      flex: 1,
      paddingTop: 28,
      marginBottom: 0,
    },
    text:{
        color:'#fff',
    },
    nameContainer:{
        flex: 1 / 10,
        justifyContent: 'space-between',
    }
  });
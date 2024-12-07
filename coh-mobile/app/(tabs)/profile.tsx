import {View, Text, StyleSheet} from 'react-native';
import ImageViewer from '@/components/ImageViewer';
import {useEffect} from 'react';
import { useBoundStore } from '@/store/useBound';
const placeholderImage = require('@/assets/images/profilePicture.jpg')

export default function Profile(){
    const isSignedIn = useBoundStore((state) => state.isSignedIn);
    const email = useBoundStore((state) => state.email);
    const password = useBoundStore((state) => state.password);
    const firstName = useBoundStore((state) => state.firstName);
    const lastName = useBoundStore((state) => state.lastName);
    useEffect(() =>{
        const fetchData = async() => {
            const response = await fetch("http://localhost:3000/api/users",{
                method: 'GET',
                credentials: 'include'
            });
            const json = await response.json();
            console.log(json);
            }
        fetchData();
        
    }, []);

    return (
    <View style={styles.container}>
        <View style={styles.nameContainer}>
            <Text style={styles.text}>
                Sam Lubelsky has helped 
                <Text style={styles.textBold}> 13 </Text>
                 moms through EPIC
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
      backgroundColor: '#F7ACCF',
      alignItems: 'center',
    }, 
    imageContainer:{
      flex: 1,
      paddingTop: 28,
      marginBottom: 0,
    },
    text:{
        color:'#fff',
        fontSize: 30,
        margin: 10,
    },
    nameContainer:{
        flex: 1 / 10,
        justifyContent: 'space-between',
    },
    textBold:{
        fontWeight: 'bold',
        marginHorizontal: 20,
    }
  });
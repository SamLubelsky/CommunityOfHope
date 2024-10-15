import { Text, View, StyleSheet } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from '@/components/Button'
import * as ImagePicker from 'expo-image-picker'
import IconButton from '@/components/IconButton'
import CircleButton from '@/components/CircleButton'
import EmojiPicker from '@/components/EmojiPicker'
import EmojiList from '@/components/EmojiList'
import { useState } from 'react';
import EmojiSticker from '@/components/EmojiSticker';

const placeholderImage = require('@/assets/images/background-image.png')

export default function Index() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<string | undefined>(undefined);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })
    if(!result.canceled){
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else{
      alert('You did not select any image');
    }
  }
  const onReset = () => {
    setShowAppOptions(false);
  }
  const onAddSticker = () =>{
    setIsModalVisible(true);
  }
  const onModalClose = () => {
    setIsModalVisible(false);
  }
  const onSaveImageAsync = async () => {

  }
  return (
    <View style={styles.container} >
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={placeholderImage} selectedImage={selectedImage}/>
        {pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji}/>}
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset}/>
            <CircleButton onPress={onAddSticker}/>
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync}/>
          </View>
        </View>
      ): (
        <View style={styles.footerContainer}>
        <Button theme="primary" label="choose a photo" onPress={pickImageAsync}/>
        <Button label="Use this photo" onPress={()=> setShowAppOptions(true)} />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        {/* List of Emoji components goes here*/}
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose}/>
      </EmojiPicker>
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
  footerContainer:{
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer:{
    position: 'absolute',
    bottom: 30
  },
  optionsRow:{
    alignItems: 'center',
    flexDirection: 'row',
  }
});

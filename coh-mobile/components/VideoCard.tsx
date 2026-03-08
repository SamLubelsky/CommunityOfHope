import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VideoCardProps {
  title?: string;
  subtitle?: string;
  thumbnail?: string;
  videoUrl?: string;
}

const VideoCard = ({
  title = "Watch how the app works",
  subtitle = "2-minute tutorial",
  videoUrl = "https://drive.google.com/file/d/1B1wcybBwKLPrcUjQH6IswrUJsJxN4kUx/view?usp=sharing",
  thumbnail = "thumnbail.png",
}: VideoCardProps) => {

  const openVideo = () => {
    Linking.openURL(videoUrl);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={openVideo}>
      
      <View style={styles.thumbnailContainer}>
        <Image source={require('@/assets/images/thumbnail.png')} style={styles.thumbnail} />
        <View style={styles.playIcon}>
          <Ionicons name="play-circle" size={50} color="white" />
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    margin: 16,
    elevation: 3,
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 160,
  },
  playIcon: {
    position: "absolute",
    top: "40%",
    left: "45%",
  },
  textContainer: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
});

export default VideoCard;
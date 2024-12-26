import * as React from 'react';
import { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import VolunteerRequestForm from "@/components/VolunteerRequestForm";
import { useBoundStore } from '@/store/useBound';
import { router } from 'expo-router';

const RequestAVolunteerScreen = () => {
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const setIsSignedIn = useBoundStore((state) => state.setIsSignedIn);
  const role = useBoundStore((state) => state.role);
  useEffect(() => {
    if(role == "Volunteer"){
      router.replace('/helpRequests')
    }
  },[]);
  const requestVolunteer = () => {
    setIsModalVisible(true);
  };
  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setIsSignedIn(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}> Welcome to EPIC!</Text>
      </View>
      <Button label="REQUEST A VOLUNTEER" onPress={requestVolunteer} />
      <VolunteerRequestForm isVisible={isModalVisible} onClose={onModalClose} />
      <Button label="Logout" onPress={handleLogout} />
    </View>
  );
};

export default RequestAVolunteerScreen;

const styles = StyleSheet.create({
  container:
  {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7ACCF',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  textContainer: {
    marginBottom: 20,
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff4d4d',
  },
});
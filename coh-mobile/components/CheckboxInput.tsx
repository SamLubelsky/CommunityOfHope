import React, {useState} from 'react';
import {Controller} from 'react-hook-form'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

type Props={
    name: string;
    control: any;
    color: string;
}
export default function CheckboxInput({name, control, color}: Props){
    return (
        <Controller 
        control={control}
        render={({field: {onChange, value}}) => (
            <Pressable style={styles.container} onPress={() => onChange(!value)} >
                <View style={[styles.box, value && styles.checkedBox, {borderColor: color}]}>
                    {value && <MaterialIcons name="check" size={20} color={color}/>}
                </View>
            </Pressable>
        )}
        name={name}
        />);
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: 'transparent',
  },
    input: {
        backgroundColor: '#fff',
        width: 300,
        padding: 10,
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
    }
})
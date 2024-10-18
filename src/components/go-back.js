import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {AppColors} from '../assets/styles/default-styles';

export default function GoBackScreen({text}) {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          size={24}
          color={AppColors.verde}
        />
        <Text style={styles.txt}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 12,
    backgroundColor: AppColors.amarillo,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    color: AppColors.verde,
    fontSize: 18,
    marginLeft: 10,
  },
});

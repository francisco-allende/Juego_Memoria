import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, Dimensions} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 segundos de duración

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../assets/img/icono.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Juego de Memoria</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>Francisco Allende</Text>
        <Text style={styles.info}>División A141-2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.memoryGreen,
    padding: 20,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: width * 0.6,
    height: width * 0.6,
    marginBottom: height * 0.05,
  },
  title: {
    fontSize: width * 0.1, // Aumentado el tamaño de la fuente
    fontWeight: 'bold',
    textAlign: 'center',
    color: AppColors.amarillo,
    textShadowColor: 'black',
    textShadowOffset: {width: -2, height: 2},
    textShadowRadius: 10,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: height * 0.05,
  },
  info: {
    fontSize: width * 0.05, // Aumentado el tamaño de la fuente
    color: AppColors.amarillo,
    marginBottom: 10,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
});

export default SplashScreen;

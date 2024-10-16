import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  Text,
} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';
import GoBackScreen from '../components/go-back';

const {width, height} = Dimensions.get('window');

const optionImages = {
  // Numbers
  1: require('../assets/img/game/numbers/uno.png'),
  2: require('../assets/img/game/numbers/dos.png'),
  3: require('../assets/img/game/numbers/tres.png'),
  4: require('../assets/img/game/numbers/cuatro.png'),
  5: require('../assets/img/game/numbers/cinco.png'),
  6: require('../assets/img/game/numbers/seis.png'),
  // Colors
  Azul: require('../assets/img/game/colors/azul.png'),
  Verde: require('../assets/img/game/colors/verde.png'),
  Rojo: require('../assets/img/game/colors/rojo.png'),
  Amarillo: require('../assets/img/game/colors/amarillo.png'),
  Morado: require('../assets/img/game/colors/morado.png'),
  Naranja: require('../assets/img/game/colors/naranja.png'),
  // Animals
  Vaca: require('../assets/img/game/animals/vaca.png'),
  Perro: require('../assets/img/game/animals/perro.png'),
  Conejo: require('../assets/img/game/animals/conejo.png'),
  Pajaro: require('../assets/img/game/animals/pajaro.png'),
  Elefante: require('../assets/img/game/animals/elefante.png'),
  Leon: require('../assets/img/game/animals/leon.png'),
};

const dimensions = Dimensions.get('screen');

const HomeScreen = () => {
  const [selectedTheme, setSelectedTheme] = useState('animals'); // Animales por defecto

  const items = {
    animals: ['Vaca', 'Perro', 'Conejo', 'Pajaro', 'Elefante', 'Leon'],
    colors: ['Azul', 'Verde', 'Rojo', 'Amarillo', 'Morado', 'Naranja'],
    numbers: [1, 2, 3, 4, 5, 6],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GoBackScreen />
      <View style={styles.container}>
        <View style={styles.gameContainer}>
          {items[selectedTheme].map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.itemButton, {width: itemSize, height: itemSize}]}>
              <Image
                source={optionImages[item]}
                style={styles.itemImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.amarillo,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  languageContainer: {
    flex: 2,
    alignItems: 'center',
  },
  themeContainer: {
    flex: 1,
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'flex-start',
    padding: 10,
    marginTop: 10,
  },
  itemButton: {
    width: dimensions.width * 0.4,
    height: dimensions.width * 0.4,
    margin: width * 0.01,
    backgroundColor: AppColors.celeste,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: 'center',
  },
  itemImage: {
    width: '90%',
    height: '90%',
  },
});

export default HomeScreen;

import React from 'react';
import {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';
import GoBackScreen from '../components/go-back';
import Sound from 'react-native-sound';

const {width, height} = Dimensions.get('window');

const NewHomeScreen = ({navigation}) => {
  const currentSound = useRef(null);

  Sound.setCategory('Playback');

  const handleChooseOption = option => {
    playSound('select');
    navigation.navigate(option);
  };

  const playSound = soundType => {
    if (currentSound.current) {
      currentSound.current.stop(() => {
        currentSound.current.release();
      });
    }

    const soundFile =
      soundType === 'select'
        ? require('../assets/sounds/select.mp3')
        : require('../assets/sounds/match.mp3');

    const sound = new Sound(soundFile, error => {
      if (error) {
        console.log('Error loading sound:', error);
        return;
      }
      currentSound.current = sound;
      sound.play(success => {
        if (success) {
          console.log('Sound played successfully');
        } else {
          console.log('Sound playback failed');
        }
      });
    });
  };

  return (
    <View style={styles.container}>
      <GoBackScreen />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => handleChooseOption('Home')}>
          <ImageBackground
            source={require('../assets/img/login-bg.png')}
            style={styles.buttonBackground}
            imageStyle={styles.buttonBackgroundImage}>
            <Text style={styles.buttonText}>Jugar</Text>
          </ImageBackground>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bigButton}
          onPress={() => handleChooseOption('Results')}>
          <ImageBackground
            source={require('../assets/img/mejor-result.png')}
            style={styles.buttonBackground}
            imageStyle={styles.buttonBackgroundImage}>
            <Text style={styles.buttonText}>Puntajes</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.verde,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigButton: {
    width: width * 0.9,
    height: height * 0.43,
    marginVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBackgroundImage: {
    resizeMode: 'cover',
  },
  buttonText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: AppColors.amarillo,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
});

export default NewHomeScreen;

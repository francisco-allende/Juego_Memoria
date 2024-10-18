import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';
import GoBackScreen from '../components/go-back';
import Sound from 'react-native-sound';

const {width, height} = Dimensions.get('window');

const HomeScreen = ({navigation}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const currentSound = useRef(null);

  const difficultyOptions = [
    {
      level: 'easy',
      text: 'Fácil',
      image: require('../assets/img/animales/cocodrilo.png'),
    },
    {
      level: 'medium',
      text: 'Medio',
      image: require('../assets/img/herramientas/martillo.png'),
    },
    {
      level: 'hard',
      text: 'Difícil',
      image: require('../assets/img/frutas/frutilla.png'),
    },
  ];

  Sound.setCategory('Playback');

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

  const handleDifficultySelect = difficulty => {
    setSelectedDifficulty(difficulty);
    playSound('select');
  };

  const handleStartGame = () => {
    playSound('match');
    navigation.navigate('Game', {difficulty: selectedDifficulty});
  };

  const handleViewResults = () => {
    playSound('select');
    navigation.navigate('Results');
  };

  return (
    <>
      <GoBackScreen />
      <View style={styles.container}>
        <Text style={styles.title}>Elegí la Dificultad</Text>
        <View style={styles.difficultyContainer}>
          {difficultyOptions.map(option => (
            <TouchableOpacity
              key={option.level}
              style={[
                styles.difficultyOption,
                selectedDifficulty === option.level && styles.selectedOption,
              ]}
              onPress={() => handleDifficultySelect(option.level)}>
              <Image source={option.image} style={styles.difficultyImage} />
              <Text style={styles.difficultyText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.playButton} onPress={handleStartGame}>
          <Image
            source={require('../assets/img/rocket.png')}
            style={styles.rocketImage}
          />
          <Text style={styles.playButtonText}>Jugar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.resultsButton}
          onPress={handleViewResults}>
          <Image
            source={require('../assets/img/mejor-result.png')}
            style={styles.rocketImage}
          />
          <Text style={styles.resultsButtonText}>Ver Mejores Resultados</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.amarillo,
    marginBottom: 30,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  difficultyContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
  },
  difficultyOption: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: AppColors.amarillo,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: '5%',
  },
  difficultyImage: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain',
  },
  difficultyText: {
    color: AppColors.amarillo,
    fontSize: 18,
    marginTop: 10,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.amarillo,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 0,
    // Sombras para iOS
    shadowColor: 'black',
    shadowOffset: {width: -1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    // Sombra para Android
    elevation: 5,
  },
  rocketImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  playButtonText: {
    color: AppColors.verde,
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 3,
  },
  //result
  resultsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.memoryBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  resultsButtonText: {
    color: AppColors.blanco,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;

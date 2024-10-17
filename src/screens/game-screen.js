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
import {getAnimales, getHerramientas, getFrutas} from '../utils/imageUtils';
import Sound from 'react-native-sound';

const {width, height} = Dimensions.get('window');

const GameScreen = ({route, navigation}) => {
  const {difficulty} = route.params;
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const currentSound = useRef(null);
  const backgroundMusic = useRef(null);

  useEffect(() => {
    initializeGame();
    playBackgroundMusic();
    return () => {
      stopBackgroundMusic();
      if (currentSound.current) {
        currentSound.current.release();
      }
    };
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver]);

  Sound.setCategory('Playback');

  const playSound = soundType => {
    if (currentSound.current) {
      currentSound.current.stop(() => {
        currentSound.current.release();
      });
    }

    let soundFile;
    switch (soundType) {
      case 'select':
        soundFile = require('../assets/sounds/select.mp3');
        break;
      case 'match':
        soundFile = require('../assets/sounds/match.mp3');
        break;
      case 'win':
        soundFile = require('../assets/sounds/win.mp3');
        break;
      default:
        soundFile = require('../assets/sounds/select.mp3');
    }

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

  const playBackgroundMusic = () => {
    if (backgroundMusic.current) {
      backgroundMusic.current.stop(() => {
        backgroundMusic.current.release();
      });
    }

    backgroundMusic.current = new Sound(
      require('../assets/sounds/game-music-loop.mp3'),
      error => {
        if (error) {
          console.log('Error loading background music:', error);
          return;
        }
        backgroundMusic.current.setNumberOfLoops(-1); // Loop indefinitely
        backgroundMusic.current.play(success => {
          if (success) {
            console.log('Background music started playing');
          } else {
            console.log('Background music playback failed');
          }
        });
      },
    );
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusic.current) {
      backgroundMusic.current.stop(() => {
        backgroundMusic.current.release();
      });
    }
  };

  const initializeGame = () => {
    let images;
    let pairCount;
    switch (difficulty) {
      case 'easy':
        images = getAnimales();
        pairCount = 3;
        break;
      case 'medium':
        images = getHerramientas();
        pairCount = 5;
        break;
      case 'hard':
        images = getFrutas();
        pairCount = 8;
        break;
      default:
        images = getAnimales();
        pairCount = 3;
    }

    const imageKeys = Object.keys(images);
    const selectedImageKeys = imageKeys
      .sort(() => 0.5 - Math.random())
      .slice(0, pairCount);

    const gameCards = [...selectedImageKeys, ...selectedImageKeys]
      .sort(() => 0.5 - Math.random())
      .map((key, index) => ({
        id: index,
        imageKey: key,
        flipped: false,
        matched: false,
      }));

    setCards(gameCards);
    setMatchedPairs([]);
    setFlippedIndices([]);
    setTimer(0);
    setGameOver(false);
  };

  const handleCardPress = index => {
    if (flippedIndices.length === 2 || cards[index].matched) return;

    playSound('select');

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      const [firstIndex, secondIndex] = newFlippedIndices;
      if (cards[firstIndex].imageKey === cards[secondIndex].imageKey) {
        playSound('match');
        setMatchedPairs(prev => [...prev, cards[firstIndex].imageKey]);
        setCards(prev =>
          prev.map((card, idx) =>
            idx === firstIndex || idx === secondIndex
              ? {...card, matched: true}
              : card,
          ),
        );
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      setGameOver(true);
      stopBackgroundMusic();
      playSound('win');
    }
  }, [matchedPairs, cards]);

  const renderCard = (card, index) => {
    const images =
      difficulty === 'easy'
        ? getAnimales()
        : difficulty === 'medium'
        ? getHerramientas()
        : getFrutas();
    return (
      <TouchableOpacity
        key={card.id}
        style={[styles.card, card.matched && styles.matchedCard]}
        onPress={() => handleCardPress(index)}
        disabled={card.matched}>
        {card.matched || flippedIndices.includes(index) ? (
          <Image source={images[card.imageKey]} style={styles.cardImage} />
        ) : (
          <View style={styles.cardBack} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Tiempo: {timer} segundos</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => renderCard(card, index))}
      </View>
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>¡Juego terminado!</Text>
          <Text style={styles.gameOverText}>Tiempo: {timer} segundos</Text>
          <TouchableOpacity
            style={styles.playAgainButton}
            onPress={initializeGame}>
            <Text style={styles.playAgainButtonText}>Jugar de nuevo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.verde,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    fontSize: 18,
    color: AppColors.amarillo,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: width,
    height: height - 100, // Ajusta esto según sea necesario
  },
  card: {
    width: width / 4 - 10,
    height: width / 4 - 10,
    margin: 5,
    backgroundColor: AppColors.amarillo,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  matchedCard: {
    backgroundColor: AppColors.lima,
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.naranja,
    borderRadius: 10,
  },
  cardImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 24,
    color: AppColors.amarillo,
    marginBottom: 20,
  },
  playAgainButton: {
    backgroundColor: AppColors.amarillo,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  playAgainButtonText: {
    fontSize: 18,
    color: AppColors.verde,
  },
});

export default GameScreen;

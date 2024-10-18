import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {AppColors} from '../assets/styles/default-styles';
import {getAnimales, getHerramientas, getFrutas} from '../utils/imageUtils';
import Sound from 'react-native-sound';
import GoBackScreen from '../components/go-back';
import styles from '../assets/styles/game-styles';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initGame = async () => {
      setIsLoading(true);
      initializeGame();
      playBackgroundMusic();

      // Esperar 4 segundos para el loader
      await new Promise(resolve => setTimeout(resolve, 4000));

      setIsLoading(false);
    };

    initGame();

    return () => {
      stopBackgroundMusic();
      if (currentSound.current) {
        currentSound.current.release();
      }
    };
  }, []);

  useEffect(() => {
    if (!gameOver && !isLoading) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameOver, isLoading]);

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
      case 'miss':
        soundFile = require('../assets/sounds/miss.mp3');
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

        setCards(gameCards);
        setMatchedPairs([]);
        setFlippedIndices([]);
        setTimer(0);
        setGameOver(false);

        // Reiniciar la música de fondo
        stopBackgroundMusic();
        playBackgroundMusic();
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
      } else {
        // Reproducir sonido de fallo
        playSound('miss');
      }
      setTimeout(() => setFlippedIndices([]), 1000);
    }
  };

  useEffect(() => {
    if (matchedPairs.length === cards.length / 2 && cards.length > 0) {
      setGameOver(true);
      stopBackgroundMusic();
      playSound('win');
      saveGameResult();
    }
  }, [matchedPairs, cards]);

  const saveGameResult = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userName = user.email.split('@')[0]; // Obtener el nombre de usuario del email
        await firestore().collection('gameResults').add({
          userId: user.uid,
          userName: userName,
          time: timer,
          difficulty: difficulty,
          date: firestore.FieldValue.serverTimestamp(),
        });
        console.log('Game result saved successfully');
      }
    } catch (error) {
      console.error('Error saving game result:', error);
    }
  };

  const getGridStyle = () => {
    switch (difficulty) {
      case 'easy':
        return styles.gridEasy;
      case 'medium':
        return styles.gridMedium;
      case 'hard':
        return styles.gridHard;
      default:
        return styles.gridEasy;
    }
  };

  const getCardStyle = () => {
    switch (difficulty) {
      case 'easy':
        return styles.cardEasy;
      case 'medium':
        return styles.cardMedium;
      case 'hard':
        return styles.cardHard;
      default:
        return styles.cardEasy;
    }
  };

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
        style={[
          styles.card,
          getCardStyle(),
          card.matched && styles.matchedCard,
        ]}
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.amarillo} />
        <Text style={styles.loadingText}>Cargando</Text>
      </View>
    );
  }

  return (
    <>
      <GoBackScreen text={'Menú'} />
      <View style={styles.container}>
        <Text style={styles.timer}>Tiempo: {timer} segundos</Text>
        <View style={[styles.grid, getGridStyle()]}>
          {cards.map((card, index) => renderCard(card, index))}
        </View>
        {gameOver && (
          <View style={styles.gameOverContainer}>
            <Text style={styles.gameOverText}>¡Juego terminado!</Text>
            <Text style={styles.gameOverText}>Tiempo: {timer} segundos</Text>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                setIsLoading(true);
                initializeGame();
                playBackgroundMusic();
                setTimeout(() => setIsLoading(false), 2000);
              }}>
              <Text style={styles.playAgainButtonText}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

export default GameScreen;

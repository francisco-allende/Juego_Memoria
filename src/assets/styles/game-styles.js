import {StyleSheet, Dimensions} from 'react-native';
import {AppColors} from './default-styles';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.verde,
  },
  timer: {
    fontSize: 18,
    color: AppColors.amarillo,
    textAlign: 'center',
    padding: 10,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 5,
  },
  gridEasy: {
    paddingVertical: height * 0.05,
  },
  gridMedium: {
    paddingVertical: height * 0.02,
  },
  gridHard: {
    paddingVertical: height * 0.01,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: AppColors.amarillo,
  },
  cardEasy: {
    width: width * 0.45,
    height: (height - 120) / 3,
    margin: 5,
  },
  cardMedium: {
    width: width * 0.45,
    height: (height - 280) / 4,
    margin: 5,
  },
  cardHard: {
    width: width * 0.22,
    height: (height - 120) / 4,
    margin: 3,
  },
  cardImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  cardBack: {
    width: '100%',
    height: '100%',
    backgroundColor: AppColors.naranja,
    borderRadius: 10,
  },
  matchedCard: {
    backgroundColor: AppColors.lima,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.verde,
  },
  loadingText: {
    color: AppColors.amarillo,
    fontSize: 18,
    marginTop: 10,
  },
});

export default styles;

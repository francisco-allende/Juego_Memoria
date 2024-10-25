import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AppColors} from '../assets/styles/default-styles';
import GoBackScreen from '../components/go-back';

const {width} = Dimensions.get('window');

const ResultsScreen = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('easy');

  const difficulties = [
    {key: 'easy', label: 'Fácil'},
    {key: 'medium', label: 'Medio'},
    {key: 'hard', label: 'Difícil'},
  ];

  useEffect(() => {
    fetchResults(selectedDifficulty);
  }, [selectedDifficulty]);

  const fetchResults = async difficulty => {
    setLoading(true);
    try {
      const snapshot = await firestore()
        .collection('gameResults')
        .where('difficulty', '==', difficulty)
        .orderBy('time', 'asc')
        .limit(5)
        .get();

      const formattedResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toDate().toLocaleString(),
      }));

      setResults(formattedResults);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTab = ({key, label}) => (
    <TouchableOpacity
      key={key}
      style={[styles.tab, selectedDifficulty === key && styles.selectedTab]}
      onPress={() => setSelectedDifficulty(key)}>
      <Text
        style={[
          styles.tabText,
          selectedDifficulty === key && styles.selectedTabText,
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({item, index}) => (
    <View style={styles.resultItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.resultInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.time}>{item.time} segundos</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <>
      <GoBackScreen text={'Menú'} />
      <View style={styles.container}>
        <Text style={styles.title}>Top 5 Mejores Tiempos</Text>

        <View style={styles.tabContainer}>{difficulties.map(renderTab)}</View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppColors.amarillo} />
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No hay resultados disponibles para esta dificultad
              </Text>
            }
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.verde,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: AppColors.amarillo,
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedTab: {
    backgroundColor: AppColors.amarillo,
  },
  tabText: {
    color: AppColors.amarillo,
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedTabText: {
    color: AppColors.verde,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.memoryBlue,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.amarillo,
    marginRight: 15,
  },
  resultInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: AppColors.blanco,
    marginBottom: 2,
  },
  time: {
    fontSize: 14,
    color: AppColors.blanco,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: AppColors.gris,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: AppColors.blanco,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ResultsScreen;
3;

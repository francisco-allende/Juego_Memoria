import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AppColors} from '../assets/styles/default-styles';
import GoBackScreen from '../components/go-back';

const ResultsScreen = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const snapshot = await firestore()
          .collection('gameResults')
          .orderBy('time', 'asc')
          .limit(5)
          .get();

        const formattedResults = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date.toDate().toLocaleString(),
        }));

        setResults(formattedResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderItem = ({item, index}) => (
    <View style={styles.resultItem}>
      <Text style={styles.rank}>{index + 1}</Text>
      <View style={styles.resultInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.time}>{item.time} segundos</Text>
        <Text style={styles.difficulty}>{item.difficulty}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={AppColors.amarillo} />
      </View>
    );
  }

  return (
    <>
      <GoBackScreen text={'Menú'} />
      <View style={styles.container}>
        <Text style={styles.title}>Top 5 Mejores Tiempos</Text>
        <FlatList
          data={results}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay resultados disponibles</Text>
          }
        />
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
    marginBottom: 30,
    textShadowColor: 'black',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    textAlign: 'center',
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
  difficulty: {
    fontSize: 14,
    color: AppColors.gris,
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
    backgroundColor: AppColors.verde,
  },
  emptyText: {
    color: AppColors.blanco,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ResultsScreen;

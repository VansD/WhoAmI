import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { gameStore } from '../stores/GameStore';
import { FinalGameScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';

const FinalGameScreen: React.FC<FinalGameScreenProps> = ({ navigation }) => {
  const results = gameStore.getResults();

  const winner = Object.values(results)[0];
  const winnerScore = winner.explainer + winner.guesser;

  const renderItem = ({ item }: { item: string }) => {
    const { explainer, guesser } = results[item];
    const totalScore = explainer + guesser;
    return (
      <View style={[styles.resultRow, winnerScore === totalScore ? styles.winner : null]}>
        { winnerScore === totalScore && <Text style={styles.header}>Победитель!</Text> }
        <Text style={[styles.text, styles.name]}>{item}:</Text>
        <Text style={styles.text}>Объяснено: {explainer}</Text>
        <Text style={styles.text}>Угадано: {guesser}</Text>
        <Text style={styles.text}>Всего: {totalScore}</Text>
      </View>
    );
  };

  const restart = () => {
    gameStore.restartGame();
    navigation.navigate('Home');
  };

  

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(results)}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        style={styles.flatList}
      />
      <Button title="Начать заново" onPress={restart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    fontSize: 30,
  },
  text: {
    fontSize: 20,
    marginBottom: 5,
    color: 'black',
  },
  name: {
    fontSize: 30,
  },
  resultRow: {
    marginBottom: 15,
    width: '90%',
    padding: 15,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
  },
  winner: {
    backgroundColor: '#c9e1a4',
  },
  flatList: {
    width: '100%',
  },
});

export default FinalGameScreen;

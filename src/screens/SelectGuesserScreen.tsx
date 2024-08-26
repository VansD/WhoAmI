import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { SelectGuesserScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';

const SelectGuesserScreen: React.FC<SelectGuesserScreenProps> = ({ navigation }) => {
  const [selectedGuesser, setSelectedGuesser] = useState<string | null>(null);
  const [selectedExplainer, setSelectedExplainer] = useState<string | null>(null);

  const handleSelectGuesser = (guesser: string) => {
    setSelectedGuesser(guesser);
  };

  const handleSelectExplainer = (explainer: string) => {
    setSelectedExplainer(explainer);
    setSelectedGuesser(null);
  };

  const handleStartGame = () => {
    if (selectedExplainer && selectedGuesser) {
        gameStore.setCurrentPair({ explainer: selectedExplainer, guesser: selectedGuesser });
        gameStore.shuffleCharacters();
        navigation.navigate('Game');
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHead}>Загадывает:</Text>
      <FlatList
        data={gameStore.players}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.playerButton,
              selectedExplainer === item && styles.selectedButton,
            ]}
            onPress={() => handleSelectExplainer(item)}
          >
            <Text style={[styles.text, selectedExplainer === item && styles.selectedButtonText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.textHead}>Отгадывает:</Text>
      <FlatList
        data={gameStore.players.filter(player => player !== selectedExplainer)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.playerButton,
              selectedGuesser === item && styles.selectedButton,
            ]}
            onPress={() => handleSelectGuesser(item)}
          >
            <Text style={[styles.text, selectedGuesser === item && styles.selectedButtonText]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <Button title="Начать игру" onPress={handleStartGame} disabled={!selectedExplainer || !selectedGuesser} />
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
  textHead: {
    fontSize: 25,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
  },
  playerButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#00ddaa',
    borderRadius: 5,
    minWidth: '90%',
    marginHorizontal: 'auto',
  },
  selectedButton: {
    backgroundColor: '#009688',
    borderColor: "#000",
    borderWidth: 2
  },
  selectedButtonText: {
    color: 'white',
  },
});

export default observer(SelectGuesserScreen);

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { gameStore } from '../stores/GameStore';
import { HomeScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';
import ExitButton from '../components/ExitButton';

const HomeScreen = ({ navigation }: HomeScreenProps): React.JSX.Element => {
  const handleNewGame = () => {
    gameStore.restartGame();
    navigation.navigate('CreatePlayers');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleRules = () => {
    navigation.navigate('Rules');
  };

  return (
    <View style={styles.container}>
      <Button title="Новая игра" onPress={handleNewGame} />
      <Button title="Настройки" onPress={handleSettings} />
      <Button title="Правила" onPress={handleRules} />
      <ExitButton />
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
});

export default HomeScreen;

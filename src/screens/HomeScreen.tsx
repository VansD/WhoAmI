import React from 'react';
import { View } from 'react-native';
import { gameStore } from '../stores/GameStore';
import { HomeScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';
import ExitButton from '../components/ExitButton';
import { commonStyles } from '../theme';

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
    <View style={commonStyles.screen}>
      <Button title="Новая игра" onPress={handleNewGame} />
      <Button title="Настройки" onPress={handleSettings} />
      <Button title="Правила" onPress={handleRules} />
      <ExitButton />
    </View>
  );
};

export default HomeScreen;

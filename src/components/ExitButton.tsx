import React from 'react';
import { View, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { playersStore } from '../stores/PlayersStore';
import { clearStoredData, exitApp } from '../utils'; 
import { Button } from './Button';

const ExitButton = observer(() => {
  const handleExit = () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти?",
      [
        {
          text: "Отмена",
          style: "cancel"
        },
        {
          text: "Да",
          onPress: async () => {
            await clearStoredData();
            gameStore.resetGame();
            playersStore.clearPlayers();
            exitApp();
          }
        }
      ],
      { cancelable: false }
    );
  };

  return (
    <View>
      <Button title="Выйти" onPress={handleExit} />
    </View>
  );
});

export default ExitButton;

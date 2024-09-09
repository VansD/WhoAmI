import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { CreatePlayersScreenProps } from '../navigation/NavTypes';
import { playersStore } from '../stores/PlayersStore';
import { Button } from '../components/Button';

const CreatePlayersScreen = observer(({ navigation }: CreatePlayersScreenProps): React.JSX.Element => {
  const [name, setName] = useState('');

  const handleAddCharacter = () => {
    if (name.trim()) {
      gameStore.addPlayer(name);
      setName('');
    }
  };

  const handleStartGame = () => {
    navigation.navigate('CreateCharacters');
  };

  const clearPlayers = () => {
    playersStore.clearPlayers();
  };

  useEffect(() => {
    gameStore.addPlayers(playersStore.players)
  }, [])

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        style={styles.input}
        onChangeText={setName}
        placeholder="Введите имя участника"
        placeholderTextColor="grey"
      />
      <Button title="Добавить" onPress={handleAddCharacter} />
      <Button title="Очистить" onPress={clearPlayers} />
      <FlatList
        data={playersStore.players}
        renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
        keyExtractor={(item, index) => index.toString()}
      />
      <Button title="Продолжить" onPress={handleStartGame} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#587a69',
    backgroundColor: '#e9f5f2',
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 20,
    color: 'black',
    width: '90%',
  },
});

export default CreatePlayersScreen;

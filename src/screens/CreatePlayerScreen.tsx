import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { CreatePlayersScreenProps } from '../navigation/NavTypes';
import { playersStore } from '../stores/PlayersStore';
import { Button } from '../components/Button';
import { colors, commonStyles } from '../theme';

const MIN_PLAYERS = 2;

const CreatePlayersScreen = observer(({ navigation }: CreatePlayersScreenProps): React.JSX.Element => {
  const [name, setName] = useState('');
  const players = playersStore.players;
  const canContinue = players.length >= MIN_PLAYERS;

  const handleAddPlayer = () => {
    const trimmed = name.trim();
    if (trimmed) {
      gameStore.addPlayer(trimmed);
      setName('');
    }
  };

  const handleRemovePlayer = (player: string) => {
    playersStore.removePlayer(player);
  };

  const handleClearPlayers = () => {
    if (players.length === 0) {
      return;
    }
    Alert.alert('Очистить список', 'Удалить всех участников?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Очистить', style: 'destructive', onPress: () => playersStore.clearPlayers() },
    ]);
  };

  const handleStartGame = () => {
    if (canContinue) {
      navigation.navigate('CreateCharacters');
    }
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TextInput
        value={name}
        style={commonStyles.input}
        onChangeText={setName}
        onSubmitEditing={handleAddPlayer}
        blurOnSubmit={false}
        returnKeyType="done"
        placeholder="Введите имя участника"
        placeholderTextColor="grey"
      />
      <Button title="Добавить" onPress={handleAddPlayer} />
      <Button title="Очистить" onPress={handleClearPlayers} />
      <FlatList
        style={styles.list}
        data={players}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePlayer(item)}
              accessibilityLabel={`Удалить ${item}`}>
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {!canContinue && (
        <Text style={styles.hint}>Добавьте минимум {MIN_PLAYERS} участников</Text>
      )}
      <Button title="Продолжить" onPress={handleStartGame} disabled={!canContinue} />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  list: {
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.text,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  removeButtonText: {
    fontSize: 20,
    color: colors.inputBorder,
    fontWeight: 'bold',
  },
  hint: {
    fontSize: 16,
    color: colors.inputBorder,
    marginBottom: 6,
  },
});

export default CreatePlayersScreen;

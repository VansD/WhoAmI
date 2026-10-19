import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { CreateCharactersScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';
import { colors, commonStyles } from '../theme';

const CreateCharactersScreen = observer(({ navigation }: CreateCharactersScreenProps) => {
  const [name, setName] = useState<string>('');
  const characters = gameStore.characters;
  // Минимум — по персонажу на участника, но не меньше двух,
  // чтобы раунд не заканчивался мгновенно.
  const minCharacters = Math.max(2, gameStore.players.length);
  const canContinue = characters.length >= minCharacters;

  const handleAddCharacter = () => {
    const trimmed = name.trim();
    if (trimmed) {
      gameStore.addCharacter(trimmed);
      setName('');
    }
  };

  const handleRemoveCharacter = (index: number) => {
    gameStore.removeCharacterAt(index);
  };

  const handleFinish = () => {
    if (canContinue) {
      navigation.navigate('SelectGuesser');
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
        onSubmitEditing={handleAddCharacter}
        blurOnSubmit={false}
        returnKeyType="done"
        placeholder="Введите имя персонажа"
        placeholderTextColor="grey"
      />
      <Button title="Добавить персонажа" onPress={handleAddCharacter} />
      <Text style={styles.small}>Добавлено персонажей: {characters.length}</Text>
      <FlatList
        style={styles.list}
        data={characters}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{item}</Text>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveCharacter(index)}
              accessibilityLabel={`Удалить ${item}`}>
              <Text style={styles.removeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {!canContinue && (
        <Text style={styles.hint}>Добавьте минимум {minCharacters} персонажей</Text>
      )}
      <Button title="Продолжить" onPress={handleFinish} disabled={!canContinue} />
    </KeyboardAvoidingView>
  );
});

const styles = StyleSheet.create({
  small: {
    fontSize: 15,
    color: colors.text,
  },
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

export default CreateCharactersScreen;

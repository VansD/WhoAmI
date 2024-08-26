import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { CreateCharactersScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';

const CreateCharactersScreen = observer(({ navigation }: CreateCharactersScreenProps) => {
  const [name, setName] = useState<string>('');

  
  // useEffect(() => {
  //   let activePlayersCount = gameStore.players.length;
  //   let actualSavedCharactersCount = characters.length / activePlayersCount;
  //   let savedCharacters = characters.slice(actualSavedCharactersCount)
  //   gameStore.addCharacters(savedCharacters)
  // }, [])

  const handleAddCharacter = () => {
    if (name) {
      gameStore.addCharacter(name);
      setName('');
    }
  };

  const handleFinish = () => {
    if (gameStore.characters.length > 0) {
      navigation.navigate('SelectGuesser'); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        value={name} 
        style={styles.input}
        onChangeText={setName} 
        placeholder="Введите имя персонажа"
        placeholderTextColor="grey"
      />
      <Button title="Добавить персонажа" onPress={handleAddCharacter} />
      <Button title="Продолжить" onPress={handleFinish} />
      <Text style={styles.small}>Добавлено персонажей: {gameStore.characters?.length}</Text>
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
      color: "black"
    },
    input: {
      width: '90%',
      padding: 10,
      borderWidth: 1,
      borderColor: '#587a69',
      backgroundColor: "#e9f5f2",
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 20,
      color: "black"
    },
    small: {
      fontSize: 15,
      color: "black"
    },
  });

export default CreateCharactersScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';
import { roundDurationsStore } from '../stores/RoundDurationStore';

const SettingsScreen = ({ navigation }: SettingsScreenProps): React.JSX.Element => {
  const [roundDurations, setRoundDurations] = useState<number[]>([60, 60, 60]);
  useEffect(() => {
    const getRoundDurations = async () => {
      await roundDurationsStore.loadRoundDurations();
    }
    getRoundDurations();

    setRoundDurations(roundDurationsStore.roundDurations)
  }, []);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem('roundDurations', JSON.stringify(roundDurations));
      navigation.goBack();
    } catch (error) {
      console.error('Ошибка сохранения настроек', error);
    }
  };

  const updateRoundDuration = (index: number, value: number) => {
    const newDurations = [...roundDurations];
    newDurations[index] = value;
    setRoundDurations(newDurations);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Длительность раундов (в секундах):</Text>
      {roundDurations.map((duration, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.text}>Раунд {index + 1}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration.toString()}
            onChangeText={(value) => updateRoundDuration(index, value ? parseInt(value) : 0)}
          />
        </View>
      ))}
      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    fontSize: 25,
    marginBottom: 10,
    color: 'black',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  inputContainer: {
    marginBottom: 16,
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
  },
});

export default SettingsScreen;

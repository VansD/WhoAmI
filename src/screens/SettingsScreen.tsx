import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsScreenProps } from '../navigation/NavTypes';
import { Button } from '../components/Button';
import { roundDurationsStore } from '../stores/RoundDurationStore';
import { STORAGE_KEYS } from '../stores/storageKeys';
import { colors } from '../theme';

const MIN_DURATION = 10;

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
    if (roundDurations.some((duration) => duration < MIN_DURATION)) {
      Alert.alert('Неверная длительность', `Минимальная длительность раунда — ${MIN_DURATION} секунд.`);
      return;
    }
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.roundDurations, JSON.stringify(roundDurations));
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.label}>Длительность раундов (в секундах):</Text>
      {roundDurations.map((duration, index) => (
        <View key={index} style={styles.inputContainer}>
          <Text style={styles.text}>Раунд {index + 1}:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={duration.toString()}
            onChangeText={(value) => updateRoundDuration(index, value ? parseInt(value, 10) : 0)}
          />
        </View>
      ))}
      <Text style={styles.hint}>Минимум {MIN_DURATION} секунд на раунд</Text>
      <Button title="Сохранить" onPress={handleSave} />
    </KeyboardAvoidingView>
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
    color: colors.text,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  hint: {
    fontSize: 16,
    color: colors.inputBorder,
    marginBottom: 10,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 20,
    color: colors.text,
  },
});

export default SettingsScreen;

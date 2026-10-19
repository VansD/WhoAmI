import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../stores/storageKeys';

export const clearStoredData = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.players, STORAGE_KEYS.characters]);
  } catch (error) {
    console.error('Ошибка при очистке данных', error);
  }
};

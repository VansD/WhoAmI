import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearStoredData = async () => {
  try {
    await AsyncStorage.multiRemove(['players', 'characters']);
  } catch (error) {
    console.error('Ошибка при очистке данных', error);
  }
};

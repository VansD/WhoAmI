import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, runInAction } from 'mobx';
import { STORAGE_KEYS } from './storageKeys';

const DEFAULT_ROUND_DURATION = 60;

class RoundDurationsStore {
  roundDurations: number[] = [60, 60, 60];
  currentRound: number = 1;
  maxRounds: number = 3;

  constructor() {
    makeAutoObservable(this);
    this.loadRoundDurations();
  }

  async loadRoundDurations() {
    try {
      const savedDurations = await AsyncStorage.getItem(STORAGE_KEYS.roundDurations);
      if (savedDurations) {
        runInAction(() => {
          this.roundDurations = JSON.parse(savedDurations).map((duration: string) =>
            parseInt(duration, 10),
          );
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки длительности раундов', error);
    }
  }

  getCurrentRoundDuration() {
    // По умолчанию 60 секунд, если что-то пойдет не так
    return this.roundDurations[this.currentRound - 1] || DEFAULT_ROUND_DURATION;
  }

  incrementCurrentRound() {
    this.currentRound++;
  }

  setCurrentRound(value: number) {
    this.currentRound = value;
  }
}

export const roundDurationsStore = new RoundDurationsStore();

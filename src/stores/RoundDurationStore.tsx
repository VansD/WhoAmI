import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";

class RoundDurationsStore {
    roundDurations: number[] = [60, 60, 60];
    currentRound: number = 1;
    maxRounds: number = 3;
    storageKey = 'players';

    constructor() {
        makeAutoObservable(this);
        this.loadRoundDurations();
    }

    async loadRoundDurations() {
        try {
            const savedDurations = await AsyncStorage.getItem('roundDurations');
            if (savedDurations) {
                runInAction(() => {
                    this.roundDurations = JSON.parse(savedDurations).map((duration: string) => parseInt(duration, 10));
                });
            }
        } catch (error) {
            console.error('Ошибка загрузки длительности раундов', error);
        }
    }

    getCurrentRoundDuration() {
        return this.roundDurations[this.currentRound - 1] || 60; // По умолчанию 60 секунд, если что-то пойдет не так
    }

    incrementCurrentRound() {
        this.currentRound++;
    }

    setCurrentRound(value: number) {
        this.currentRound = value;
    }

}

export const roundDurationsStore = new RoundDurationsStore();
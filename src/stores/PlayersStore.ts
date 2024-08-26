import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class PlayersStore {
  players: string[] = [];
  storageKey = 'players';

  constructor() {
    makeAutoObservable(this);
    this.loadPlayers();
  }

  addPlayer(name: string) {
    if (!this.players.includes(name)) {
      this.players.push(name);
      this.savePlayers();
    }
  }

  getPlayers() {
    return this.players;
  }

  clearPlayers() {
    this.players = [];
    this.savePlayers();
  }

  async savePlayers() {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.players));
    } catch (error) {
      console.error('Ошибка сохранения участников в AsyncStorage', error);
    }
  }

  async loadPlayers() {
    try {
      const storedPlayers = await AsyncStorage.getItem(this.storageKey);
      if (storedPlayers) {
        runInAction(() => {
          this.players = JSON.parse(storedPlayers);
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки участников из AsyncStorage', error);
    }
  }

  async restorePlayersForNewGame() {
    await this.loadPlayers();
  }
}

export const playersStore = new PlayersStore();

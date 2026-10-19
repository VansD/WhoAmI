import { makeAutoObservable } from 'mobx';
import { playersStore } from './PlayersStore';
import { roundDurationsStore } from './RoundDurationStore';

export type PlayerPairType = {
  explainer: string;
  guesser: string;
};

type PlayerScoreType = {
  explainer: number;
  guesser: number;
};

const emptyScore = (): PlayerScoreType => ({ explainer: 0, guesser: 0 });

export class GameStore {
  characters: string[] = [];
  previousCharacters: string[] = [];
  usedCharacters: string[] = [];
  scores: Record<string, PlayerScoreType> = {};
  currentPair: PlayerPairType | null = null;
  currentRound = roundDurationsStore.currentRound;
  maxRounds = roundDurationsStore.maxRounds;
  roundDurations = roundDurationsStore.roundDurations;

  constructor() {
    makeAutoObservable(this);
    roundDurationsStore.loadRoundDurations();
    this.syncScores();
  }

  /**
   * Список игроков — единый источник правды в playersStore.
   * GameStore ничего не хранит и не дублирует, только читает.
   */
  get players(): string[] {
    return playersStore.getPlayers();
  }

  addPlayer(name: string) {
    playersStore.addPlayer(name);
    this.ensureScore(name);
  }

  addCharacter(name: string) {
    this.characters.push(name);
    this.previousCharacters = this.characters.slice();
  }

  addCharacters(characters: string[]) {
    this.characters = [...this.characters, ...characters];
    this.previousCharacters = this.characters.slice();
  }

  /**
   * Удаление персонажа по индексу на этапе подготовки игры (исправление
   * опечаток). В отличие от removeCharacter не переносит его в usedCharacters
   * и корректно работает с одинаковыми именами.
   */
  removeCharacterAt(index: number) {
    this.characters.splice(index, 1);
    this.previousCharacters = this.characters.slice();
  }

  setGuesser(guesser: string) {
    if (this.currentPair) {
      this.currentPair.guesser = guesser;
    }
  }

  addPointToPair(pair: PlayerPairType) {
    this.scores[pair.explainer].explainer += 1;
    this.scores[pair.guesser].guesser += 1;
    this.removeCharacter(this.characters[0]);
  }

  setCurrentPair(pair: PlayerPairType) {
    this.currentPair = pair;
  }

  removeCharacter(character: string) {
    this.characters = this.characters.filter((char) => char !== character);
    this.usedCharacters.push(character);
  }

  endRound() {
    if (this.currentRound < this.roundDurations.length) {
      roundDurationsStore.incrementCurrentRound();
      this.shuffleCharacters();
    }
    if (this.currentRound > this.maxRounds) {
      roundDurationsStore.setCurrentRound(1);
    } else {
      this.characters = this.previousCharacters.slice();
      this.usedCharacters = [];
    }
  }

  resetGame() {
    this.characters = [];
    this.usedCharacters = [];
    this.resetScores();
    roundDurationsStore.setCurrentRound(1);
  }

  async restartGame() {
    await playersStore.restorePlayersForNewGame();
    this.characters = [];
    this.previousCharacters = [];
    this.usedCharacters = [];
    this.currentPair = null;
    this.resetScores();
    roundDurationsStore.setCurrentRound(1);
  }

  shuffleCharacters() {
    for (let i = this.characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.characters[i], this.characters[j]] = [this.characters[j], this.characters[i]];
    }
  }

  hasUnusedCharacters() {
    return this.characters.length > 0;
  }

  getNextCharacter() {
    return this.characters.length > 0 ? this.characters[0] : null;
  }

  getTotalScoreForPlayer(name: string): number {
    const playerScore = this.scores[name];
    return playerScore ? playerScore.explainer + playerScore.guesser : 0;
  }

  getResults(): Record<string, PlayerScoreType> {
    const sorted = Object.entries(this.scores).sort(
      ([nameA], [nameB]) => this.getTotalScoreForPlayer(nameB) - this.getTotalScoreForPlayer(nameA),
    );

    return Object.fromEntries(sorted);
  }

  private ensureScore(name: string) {
    if (!this.scores[name]) {
      this.scores[name] = emptyScore();
    }
  }

  private syncScores() {
    this.players.forEach((name) => this.ensureScore(name));
  }

  private resetScores() {
    this.scores = {};
    this.players.forEach((player) => {
      this.scores[player] = emptyScore();
    });
  }
}

export const gameStore = new GameStore();

import { makeAutoObservable, runInAction } from 'mobx';
import { playersStore } from './PlayersStore';
import { roundDurationsStore } from './RoundDurationStore';

export type PlayerPairType = {
  explainer: string;
  guesser: string;
}

type PlayerScoreType = {
  explainer: number;
  guesser: number;
};

class GameStore {
  players: string[] = playersStore.getPlayers();
  previousPlayers: string[] = [];
  characters: string[] = [];
  previousCharacters: string[] = [];
  usedCharacters: string[] = [];
  scores: Record<string, PlayerScoreType> = {};
  currentPair: { explainer: string; guesser: string } | null = null;
  //currentCharacters: string[] = [];
  currentRound = roundDurationsStore.currentRound;
  maxRounds = roundDurationsStore.maxRounds;
  roundDurations = roundDurationsStore.roundDurations;

  constructor() {
    makeAutoObservable(this);
    roundDurationsStore.loadRoundDurations();
  }

  addPlayer(name: string) {
    playersStore.addPlayer(name);
    this.players = playersStore.getPlayers();
    this.previousPlayers = this.players.slice();
    this.scores[name] = { explainer: 0, guesser: 0 };
  }

  // addPlayers(players: string[]) {
  //   this.players = [...this.players, ...players];
  //   players.forEach(name => {
  //     this.scores[name] = { explainer: 0, guesser: 0 };
  //   });
  //   this.previousPlayers = this.players.slice();
  // }

  addCharacter(name: string) {
    this.characters.push(name);
    this.previousCharacters = this.characters.slice();
  }

  addCharacters(characters: string[]) {
    this.characters = [...this.characters, ...characters];
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

  setCurrentPair(pair: { explainer: string; guesser: string }) {
    this.currentPair = pair;
  }

  moveCharacterToEnd() {
    //const character = this.characters.shift();
    // if (character) {
    //   this.characters.push(character);
    // }
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
    this.players = this.previousPlayers.slice();
    this.characters = [];
    this.usedCharacters = [];
    this.scores = {};
    this.players.forEach((player) => {
      this.scores[player] = { explainer: 0, guesser: 0 };
    });
    roundDurationsStore.setCurrentRound(1);
  }

  async restartGame() {
    await playersStore.restorePlayersForNewGame();
    this.players = playersStore.getPlayers();
    this.previousPlayers = this.players.slice();
    this.scores = {};
    this.currentPair = null;
    roundDurationsStore.setCurrentRound(1);

    this.players.forEach((name) => {
      this.scores[name] = { explainer: 0, guesser: 0 };
    });
  }

  shuffleCharacters() {
    //this.currentCharacters = [...this.characters];
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
    return Object.fromEntries(
      Object.entries(this.scores)
        .sort(([nameA, scoresA], [nameB, scoresB]) => {
          const totalScoreA = scoresA.explainer + scoresA.guesser;
          const totalScoreB = scoresB.explainer + scoresB.guesser;
          return totalScoreB - totalScoreA;
        })
    );
  }

  
}

export const gameStore = new GameStore();

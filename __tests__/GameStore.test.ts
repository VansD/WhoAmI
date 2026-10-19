/**
 * @format
 */

import {beforeEach, describe, expect, it} from '@jest/globals';

// AsyncStorage используют playersStore / roundDurationsStore, которые
// импортируются внутри GameStore. Подменяем его на официальный jest-мок.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import {GameStore} from '../src/stores/GameStore';
import {playersStore} from '../src/stores/PlayersStore';

describe('GameStore', () => {
  let store: GameStore;

  beforeEach(() => {
    // playersStore — синглтон, общий между тестами: очищаем его,
    // затем создаём свежий GameStore с чистым состоянием.
    playersStore.clearPlayers();
    store = new GameStore();
  });

  describe('персонажи', () => {
    it('addCharacter добавляет персонажа и дублирует его в previousCharacters', () => {
      store.addCharacter('Гарри Поттер');

      expect(store.characters).toEqual(['Гарри Поттер']);
      expect(store.previousCharacters).toEqual(['Гарри Поттер']);
    });

    it('addCharacters добавляет пачку, сохраняя previousCharacters', () => {
      store.addCharacters(['Бэтмен', 'Шрек']);

      expect(store.characters).toEqual(['Бэтмен', 'Шрек']);
      expect(store.previousCharacters).toEqual(['Бэтмен', 'Шрек']);
    });

    it('getNextCharacter возвращает первого персонажа или null', () => {
      expect(store.getNextCharacter()).toBeNull();

      store.addCharacters(['Йода', 'Голлум']);

      expect(store.getNextCharacter()).toBe('Йода');
    });

    it('hasUnusedCharacters отражает наличие персонажей', () => {
      expect(store.hasUnusedCharacters()).toBe(false);

      store.addCharacter('Нео');

      expect(store.hasUnusedCharacters()).toBe(true);
    });

    it('removeCharacter убирает персонажа и переносит его в usedCharacters', () => {
      store.addCharacters(['Нео', 'Тринити']);

      store.removeCharacter('Нео');

      expect(store.characters).toEqual(['Тринити']);
      expect(store.usedCharacters).toEqual(['Нео']);
    });

    it('removeCharacterAt удаляет по индексу, не трогая usedCharacters', () => {
      store.addCharacters(['Нео', 'Тринити', 'Нео']);

      store.removeCharacterAt(0);

      expect(store.characters).toEqual(['Тринити', 'Нео']);
      expect(store.previousCharacters).toEqual(['Тринити', 'Нео']);
      expect(store.usedCharacters).toEqual([]);
    });
  });

  describe('игроки (единый источник — playersStore)', () => {
    it('players читается из playersStore', () => {
      playersStore.addPlayer('Из стора');

      expect(store.players).toContain('Из стора');
      expect(store.players).toEqual(playersStore.getPlayers());
    });

    it('addPlayer не дублирует уже добавленного игрока', () => {
      store.addPlayer('Аня');
      store.addPlayer('Аня');

      expect(store.players.filter((p) => p === 'Аня')).toHaveLength(1);
      expect(store.getTotalScoreForPlayer('Аня')).toBe(0);
    });

    it('removePlayer убирает игрока из списка', () => {
      store.addPlayer('Аня');
      store.addPlayer('Боря');

      playersStore.removePlayer('Аня');

      expect(store.players).not.toContain('Аня');
      expect(store.players).toContain('Боря');
    });
  });

  describe('счёт', () => {
    it('addPlayer заводит игроку нулевой счёт', () => {
      store.addPlayer('Аня');

      expect(store.getTotalScoreForPlayer('Аня')).toBe(0);
    });

    it('getTotalScoreForPlayer возвращает 0 для неизвестного игрока', () => {
      expect(store.getTotalScoreForPlayer('Нет такого')).toBe(0);
    });

    it('addPointToPair начисляет очки обоим и убирает текущего персонажа', () => {
      store.addPlayer('Объясняющий');
      store.addPlayer('Отгадывающий');
      store.addCharacters(['Маска', 'Зорро']);

      store.addPointToPair({explainer: 'Объясняющий', guesser: 'Отгадывающий'});

      expect(store.scores['Объясняющий'].explainer).toBe(1);
      expect(store.scores['Отгадывающий'].guesser).toBe(1);
      // первый персонаж списка ушёл в использованные
      expect(store.characters).toEqual(['Зорро']);
      expect(store.usedCharacters).toEqual(['Маска']);
    });
  });

  describe('getResults', () => {
    it('сортирует игроков по суммарному счёту по убыванию', () => {
      store.addPlayer('Лидер');
      store.addPlayer('Середняк');
      store.addPlayer('Аутсайдер');

      store.scores['Лидер'] = {explainer: 3, guesser: 2}; // 5
      store.scores['Середняк'] = {explainer: 1, guesser: 1}; // 2
      store.scores['Аутсайдер'] = {explainer: 0, guesser: 0}; // 0

      expect(Object.keys(store.getResults())).toEqual([
        'Лидер',
        'Середняк',
        'Аутсайдер',
      ]);
    });
  });

  describe('resetGame', () => {
    it('очищает персонажей и обнуляет счёт всех игроков', () => {
      store.addPlayer('Аня');
      store.addPlayer('Боря');
      store.addCharacters(['Маска']);
      store.scores['Аня'] = {explainer: 2, guesser: 1};

      store.resetGame();

      expect(store.characters).toEqual([]);
      expect(store.usedCharacters).toEqual([]);
      expect(store.getTotalScoreForPlayer('Аня')).toBe(0);
      expect(store.getTotalScoreForPlayer('Боря')).toBe(0);
    });
  });

  describe('restartGame', () => {
    it('очищает персонажей прошлой игры', async () => {
      store.addCharacters(['Маска', 'Зорро']);

      await store.restartGame();

      expect(store.characters).toEqual([]);
      expect(store.previousCharacters).toEqual([]);
      expect(store.usedCharacters).toEqual([]);
    });
  });

  describe('shuffleCharacters', () => {
    it('сохраняет набор персонажей (перестановка без потерь)', () => {
      const original = ['A', 'B', 'C', 'D', 'E'];
      store.addCharacters(original);

      store.shuffleCharacters();

      expect([...store.characters].sort()).toEqual([...original].sort());
      expect(store.characters).toHaveLength(original.length);
    });
  });
});

/**
 * Ключи AsyncStorage в одном месте, чтобы не дублировать строковые литералы
 * и не ошибиться в имени (раньше, например, RoundDurationsStore держал
 * storageKey = 'players', хотя сохранял по ключу 'roundDurations').
 */
export const STORAGE_KEYS = {
  players: 'players',
  characters: 'characters',
  roundDurations: 'roundDurations',
} as const;

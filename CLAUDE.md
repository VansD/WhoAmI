# CLAUDE.md

Указания для Claude Code при работе с этим репозиторием.

## О проекте

**WhoAmI** («Угадай меня») — мобильная party-игра на React Native (TypeScript).
Игроки по очереди за ограниченное время объясняют загаданных персонажей; игра идёт
в 3 раунда с разными правилами объяснения (свободно → жестами → одним словом).

## Команды

```bash
npm start            # запуск Metro-бандлера
npm run android      # сборка и запуск на Android
npm run ios          # сборка и запуск на iOS
npm test             # запуск Jest-тестов
npm run lint         # ESLint по всему проекту
npx tsc --noEmit     # проверка типов без сборки
```

Требуется Node >= 18. Нативная сборка требует настроенного окружения React Native
(Android SDK / Xcode) — см. README.

## Архитектура

- `App.tsx` → `src/navigation/AppNavigator.tsx` — корень приложения и стек-навигация
  (`@react-navigation/native-stack`). Фон-картинка задаётся на уровне навигатора,
  тема делает фон экранов прозрачным.
- `src/screens/*` — экраны, по одному на маршрут. Маршруты и их типы описаны в
  `src/navigation/NavTypes.ts` (`RootStackParamList` + `*ScreenProps`).
- `src/stores/*` — состояние на **MobX** (синглтоны, экспортируются как инстансы):
  - `GameStore` — ход игры: персонажи, текущая пара (объясняющий/отгадывающий),
    счёт, раунды, перемешивание, подсчёт результатов. **Список игроков не хранит** —
    `gameStore.players` это computed-геттер поверх `PlayersStore` (единый источник
    правды). Счёт заводится лениво через `ensureScore`/`resetScores`.
  - `PlayersStore` — список игроков (единственный источник), персистентность в
    `AsyncStorage`.
  - `RoundDurationStore` — длительности раундов и номер текущего раунда.
- `src/components/*` — переиспользуемые компоненты (`Button`, `Divider`, `ExitButton`).
- `src/utils/*` — утилиты (выход из приложения, очистка хранилища).
- `src/theme.ts` — **единая палитра `colors` и общие стили `commonStyles`**.
  Новые цвета и повторяющиеся стили (контейнер экрана, поля ввода) добавлять сюда,
  не хардкодить hex в экранах.
- `src/stores/storageKeys.ts` — **все ключи `AsyncStorage`** (`players`,
  `characters`, `roundDurations`). Использовать `STORAGE_KEYS`, не строковые литералы.

### Поток данных

Экраны читают состояние из MobX-сторов и оборачиваются в `observer` из
`mobx-react-lite`, когда рендер зависит от observable-полей. Изменения состояния
идут только через методы сторов. Асинхронные обновления в сторах оборачиваются в
`runInAction` (требование MobX).

## Соглашения

- TypeScript везде; экраны типизируются через `*ScreenProps` из `NavTypes.ts`.
- Стиль форматирования (`.prettierrc.js`): одинарные кавычки, trailing commas,
  `arrowParens: avoid`, `bracketSameLine`. ESLint — конфиг `@react-native`.
- Цвета — только из `colors` (`src/theme.ts`). Повторяющийся стиль контейнера экрана —
  `commonStyles.screen`, поля ввода — `commonStyles.input`.
- UI-тексты и комментарии — на русском (язык проекта).
- Компоненты, завязанные на observable-состояние, оборачивать в `observer`.

## Что держать в уме

- Длительности раундов по умолчанию `[60, 60, 60]` сек; настраиваются в
  `SettingsScreen` и сохраняются в `AsyncStorage` под ключом `roundDurations`.
- Игровая логика раундов (`GameStore.endRound`) завязана на `currentRound`,
  `maxRounds` и `roundDurations.length` — менять осторожно, поведение покрыто
  переходами между экранами, а не юнит-тестами.
- Звуки (`react-native-sound`) грузятся из нативных ресурсов; `GameScreen`
  освобождает их в cleanup эффекта.

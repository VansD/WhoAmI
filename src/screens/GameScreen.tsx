import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, PanResponder } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { roundDurationsStore } from '../stores/RoundDurationStore';
import { GameScreenProps } from '../navigation/NavTypes';
import Sound from 'react-native-sound';
import success from '../assets/sounds/success.mp3';
import fail from '../assets/sounds/fail.mp3';
import { Button } from '../components/Button';
import { colors, commonStyles } from '../theme';

const GameScreen = observer(({ navigation }: GameScreenProps): React.JSX.Element => {
  const roundDuration = roundDurationsStore.getCurrentRoundDuration();
  const [timer, setTimer] = useState<number>(roundDuration);
  const [isNextCharacter, setIsNextCharacter] = useState<boolean>(false);
  const [pan] = useState(new Animated.ValueXY());
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const currentPair = gameStore.currentPair;

  const successSoundRef = useRef<Sound | null>(null);
  const failSoundRef = useRef<Sound | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Загрузка звуков один раз на монтировании; хранятся в ref, а не в
  // модульных переменных, чтобы не было гонок между экземплярами экрана.
  useEffect(() => {
    Sound.setCategory('Playback');
    successSoundRef.current = new Sound(success, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Ошибка при загрузке success.mp3:', error);
      }
    });
    failSoundRef.current = new Sound(fail, Sound.MAIN_BUNDLE);

    return () => {
      successSoundRef.current?.release();
      failSoundRef.current?.release();
    };
  }, []);

  const handleRoundEnd = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!gameStore.hasUnusedCharacters()) {
      if (roundDurationsStore.currentRound < roundDurationsStore.maxRounds) {
        navigation.navigate('RoundResults');
      } else {
        navigation.navigate('FinalGame');
      }
    } else {
      navigation.navigate('SelectGuesser');
    }
  }, [navigation]);

  // Один интервал на весь экран: раньше он пересоздавался на каждый тик.
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      handleRoundEnd();
    }
  }, [timer, handleRoundEnd]);

  useEffect(() => {
    const character = gameStore.getNextCharacter();
    if (character) {
      setCurrentCharacter(character);
    } else {
      handleRoundEnd();
    }
  }, [currentPair, handleRoundEnd]);

  const handleNextCharacter = () => {
    const character = gameStore.getNextCharacter();
    if (character) {
      setCurrentCharacter(character);
    } else {
      handleRoundEnd();
    }
    setIsNextCharacter((prev) => !prev);
  };

  const handleSwipeUp = () => {
    successSoundRef.current?.play();
    if (currentPair) {
      gameStore.addPointToPair(currentPair);
    }
    handleNextCharacter();
  };

  const handleSwipeDown = () => {
    failSoundRef.current?.play();
    if (currentCharacter) {
      gameStore.removeCharacter(currentCharacter);
    }
    handleNextCharacter();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gestureState) => {
      const { dy } = gestureState;

      if (dy < -100) {
        handleSwipeUp();
      } else if (dy > 100) {
        handleSwipeDown();
      }

      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
      }).start();
    },
  });

  return (
    <View style={commonStyles.screen}>
      <View style={styles.info}>
        <Text style={styles.header}>{roundDurationsStore.currentRound} раунд</Text>
        <Text style={styles.text}>Персонажи: {gameStore.characters?.length}</Text>
        <Text style={[styles.timer, timer <= LOW_TIME && styles.timerLow]}>{formatTime(timer)}</Text>
      </View>
      <View style={styles.characterBlock}>
        {currentPair && currentCharacter && (
          <>
            <Text style={styles.hint}>↑ Угадал</Text>
            <Animated.View
              style={[styles.characterCard, pan.getLayout(), { backgroundColor: isNextCharacter ? colors.cardNext : colors.primary }]}
              {...panResponder.panHandlers}
            >
              <Text style={styles.characterText} numberOfLines={3} adjustsFontSizeToFit>
                {currentCharacter}
              </Text>
            </Animated.View>
            <Text style={styles.hint}>↓ Нарушение</Text>
          </>
        )}
      </View>
      {currentPair && currentCharacter && (
        <View style={styles.actions}>
          <Button title="Нарушение" onPress={handleSwipeDown} width={150} />
          <Button title="Угадал" onPress={handleSwipeUp} width={150} />
        </View>
      )}
    </View>
  );
});

const LOW_TIME = 10;

const formatTime = (totalSeconds: number): string => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  info: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: colors.text,
  },
  header: {
    fontSize: 30,
    marginBottom: 10,
    color: colors.text,
    textAlign: 'center',
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  timerLow: {
    color: colors.danger,
  },
  hint: {
    fontSize: 18,
    color: colors.muted,
    marginVertical: 8,
  },
  characterBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  characterCard: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBlockColor: 'grey',

  },
  characterText: {
    color: colors.textInverse,
    fontSize: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});

export default GameScreen;

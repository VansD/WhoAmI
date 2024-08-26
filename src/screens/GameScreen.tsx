/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, PanResponder, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { roundDurationsStore } from '../stores/RoundDurationStore';
import { GameScreenProps } from '../navigation/NavTypes';

const GameScreen = observer(({ navigation }: GameScreenProps): React.JSX.Element => {
  const roundDuration = roundDurationsStore.getCurrentRoundDuration();
  const [timer, setTimer] = useState<number>(roundDuration);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const [showRoundEndAlert, setShowRoundEndAlert] = useState<boolean>(false);
  const currentPair = gameStore.currentPair;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer === 0) {
      clearInterval(interval);
      handleRoundEnd();
    }

    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const character = gameStore.getNextCharacter();
    if (character) {
      setCurrentCharacter(character);
    } else {
      handleRoundEnd();
    }
  }, [currentPair]);

  const handleSwipeUp = () => {
    if (currentPair) {
      gameStore.addPointToPair(currentPair);
    }
    handleNextCharacter();
  };

  const handleSwipeDown = () => {
    // gameStore.moveCharacterToEnd();
    // handleNextCharacter();
  };

  const handleNextCharacter = () => {
    const character = gameStore.getNextCharacter();
    if (character) {
      setCurrentCharacter(character);
    } else {
      handleRoundEnd();
    }
  };

  const handleRoundEnd = () => {
    if (!gameStore.hasUnusedCharacters()) {
      if (roundDurationsStore.currentRound < roundDurationsStore.maxRounds) {
        setShowRoundEndAlert(true);
        Alert.alert(
          `Раунд ${roundDurationsStore.currentRound} завершен`,
          `Начинается следующий раунд. ${roundDurationsStore.currentRound < 2 ? 'Теперь объясняем только жестами' : 'Теперь объясняем только одним словом'}`,
          [{ text: 'OK', onPress: handleStartNextRound }],
        );
      } else {
        navigation.navigate('FinalGame');
      }
    } else {
      navigation.navigate('SelectGuesser');
    }
  };

  const handleStartNextRound = () => {
    setShowRoundEndAlert(false);
    gameStore.endRound();
    navigation.navigate('SelectGuesser');
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
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.header}>{roundDurationsStore.currentRound} раунд</Text>
        <Text style={styles.text}>Персонажи: {gameStore.characters?.length}</Text>
        <Text style={styles.text}>{timer}</Text>
      </View>
      <View style={styles.characterBlock}>
        {currentPair && currentCharacter && (
          <Animated.View
            style={[styles.characterCard, pan.getLayout()]}
            {...panResponder.panHandlers}
          >
            <Text style={styles.characterText}>{currentCharacter}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  info: {
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
  header: {
    fontSize: 30,
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
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
    backgroundColor: '#009688',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBlockColor: 'grey',

  },
  characterText: {
    color: '#ffffff',
    fontSize: 40,
  },
});

export default GameScreen;

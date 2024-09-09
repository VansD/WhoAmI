import React, { useEffect, useState } from 'react';
import { View, Text, Animated, StyleSheet, PanResponder, Alert } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { roundDurationsStore } from '../stores/RoundDurationStore';
import { GameScreenProps } from '../navigation/NavTypes';
import Sound from 'react-native-sound';
import success from '../assets/sounds/success.mp3';
import fail from '../assets/sounds/fail.mp3';

let successSound: Sound, failSound: Sound;

const GameScreen = observer(({ navigation }: GameScreenProps): React.JSX.Element => {
  const roundDuration = roundDurationsStore.getCurrentRoundDuration();
  const [timer, setTimer] = useState<number>(roundDuration);
  const [isNextCharacter, setIsNextCharacter] = useState<boolean>(false);
  const [pan, setPan] = useState(new Animated.ValueXY());
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const currentPair = gameStore.currentPair;
  Sound.setCategory('Playback');
  

  useEffect(() => {
    successSound = new Sound(success, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Ошибка при загрузке success.mp3:', error);
        return;
      }
      console.log('Sound loaded successfully');
    });
    failSound = new Sound(fail, Sound.MAIN_BUNDLE);

    return () => {
      successSound.release();
      failSound.release();
    };
  }, []);

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
    successSound.play();
    if (currentPair) {
      gameStore.addPointToPair(currentPair);
    }
    handleNextCharacter();
  };

  const handleSwipeDown = () => {
    failSound.play();
    if (currentCharacter)
      gameStore.removeCharacter(currentCharacter);
    handleNextCharacter();
  };

  const handleNextCharacter = () => {
    const character = gameStore.getNextCharacter();
    if (character) {
      setCurrentCharacter(character);
    } else {
      handleRoundEnd();
    }
    setIsNextCharacter(!isNextCharacter);
  };

  const handleRoundEnd = () => {
    if (!gameStore.hasUnusedCharacters()) {
      if (roundDurationsStore.currentRound < roundDurationsStore.maxRounds) {
        setTimer(0);
        navigation.navigate('RoundResults');
      } else {
        navigation.navigate('FinalGame');
      }
    } else {
      navigation.navigate('SelectGuesser');
    }
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
            style={[styles.characterCard, pan.getLayout(), { backgroundColor: isNextCharacter ? "#bb00aa" : "#009688" }]}
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

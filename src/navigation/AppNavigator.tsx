import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import CreatePlayersScreen from '../screens/CreatePlayerScreen';
import CreateCharactersScreen from '../screens/CreateCharactersScreen';
import RulesScreen from '../screens/RulesScreen';
import { RootStackParamList } from './NavTypes';
import GameScreen from '../screens/GameScreen';
import FinalGameScreen from '../screens/FinalGameScreen';
import SelectGuesserScreen from '../screens/SelectGuesserScreen';
import { ImageBackground, StyleSheet } from 'react-native';
import SettingsScreen from '../screens/SettingsScreen';
import { HeaderHome } from './HeaderHome';
import RoundResultsScreen from '../screens/RoundResultsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
  },
};

const AppNavigator = () => {
  return (
    <ImageBackground style={styles.imgBackground}
      resizeMode="stretch"
      source={require('../assets/background_1.jpg')}>
      <NavigationContainer theme={MyTheme}>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Угадай меня', headerTitleAlign: 'center', header: HeaderHome}} />
          <Stack.Screen name="Rules" component={RulesScreen} options={{ title: 'Правила игры' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Настройки' }} />
          <Stack.Screen name="CreatePlayers" component={CreatePlayersScreen} options={{ title: 'Добавить игрока' }} />
          <Stack.Screen name="CreateCharacters" component={CreateCharactersScreen} options={{ title: 'Добавить персонажа' }} />
          <Stack.Screen name="SelectGuesser" component={SelectGuesserScreen} options={{ title: 'Выбор участников' }} />
          <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Игра' }} />
          <Stack.Screen name="FinalGame" component={FinalGameScreen} options={{ title: 'Результаты' }} />
          <Stack.Screen name="RoundResults" component={RoundResultsScreen} options={{ title: 'Результаты раунда' }} />
        </Stack.Navigator>
      </NavigationContainer >
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imgBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
  },
});

export default AppNavigator;

import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';


export type RootStackParamList = {
    Home: undefined;
    CreatePlayers: undefined;
    CreateCharacters: undefined;
    Rules: undefined;
    FinalGame: undefined;
    Game: undefined;
    SelectGuesser: undefined;
    Settings: undefined;

  };

 export type CreatePlayersScreenProps = NativeStackScreenProps<RootStackParamList, 'CreatePlayers'>;
 export type CreateCharactersScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateCharacters'>;
 export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
 export type RulesScreenProps = NativeStackScreenProps<RootStackParamList, 'Rules'>;
 export type FinalGameScreenProps = NativeStackScreenProps<RootStackParamList, 'FinalGame'>;
 export type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;
 export type SelectGuesserScreenProps = NativeStackScreenProps<RootStackParamList, 'SelectGuesser'>;
 export type SettingsScreenProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;


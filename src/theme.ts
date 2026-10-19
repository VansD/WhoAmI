import { StyleSheet } from 'react-native';

/**
 * Единая палитра приложения. Раньше hex-коды были разбросаны по экранам,
 * из-за чего один и тот же цвет дублировался в десятке мест.
 */
export const colors = {
  primary: '#009688',
  primaryLight: '#00ddaa',
  cardNext: '#bb00aa',
  winner: '#c9e1a4',
  danger: '#d32f2f',
  inputBackground: '#e9f5f2',
  inputBorder: '#587a69',
  text: 'black',
  textInverse: '#fff',
  muted: 'grey',
  surface: 'white',
};

/**
 * Общие стили, которые повторялись почти в каждом экране.
 */
export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBackground,
    borderRadius: 5,
    marginBottom: 10,
    fontSize: 20,
    color: colors.text,
  },
});

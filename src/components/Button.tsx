import { TouchableOpacity, Text, StyleSheet, DimensionValue, ViewStyle } from 'react-native';
import { colors } from '../theme';

type ButtonProps = {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  width?: DimensionValue;
  style?: ViewStyle;
};

export const Button = ({ onPress, title, disabled, width, style }: ButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.buttonContainer,
      { width: width ?? 'auto', minWidth: width ?? 250 },
      style,
    ]}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    elevation: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 10,
    maxHeight: 50,
  },
  buttonText: {
    fontSize: 18,
    color: colors.textInverse,
    fontWeight: 'bold',
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
});

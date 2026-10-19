import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

export const Divider = (): React.JSX.Element => <View style={styles.divider} />;

const styles = StyleSheet.create({
  divider: {
    flex: 1,
    height: 1,
    width: '100%',
    backgroundColor: colors.muted,
    marginVertical: 10,
  },
});

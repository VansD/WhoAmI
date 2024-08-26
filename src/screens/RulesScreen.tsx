import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RulesScreen = (): React.JSX.Element => {
  return (
    <View style={styles.container}>
      <Text style={styles.textHead}>Игра состоит из 3 раундов</Text>
      <Text style={styles.text}>В каждом раунде необходимо как можно быстрее объяснить персонажа, который загадан. Пропускать нельзя.</Text>
      <Text style={styles.textHead}>Раунд 1</Text>
      <Text style={styles.text}>Необходимо объяснить загаданного персонажа всеми доступными способами.</Text>
      <Text style={styles.textHead}>Раунд 2</Text>
      <Text style={styles.text}>Необходимо объяснить загаданного персонажа только жестами, не издавая звуков.</Text>
      <Text style={styles.textHead}>Раунд 3</Text>
      <Text style={styles.text}>Необходимо объяснить загаданного персонажа только ОДНИМ словом.</Text>
      <Text style={styles.textHead}>Результаты</Text>
      <Text style={styles.text}>В результатах учитываются персонажи, которых участник смог успешно объяснить, и которых сумел угадать.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  textHead: {
    fontSize: 25,
    marginBottom: 10,
    color: "black",
    
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
    color: "black",
  }
});

export default RulesScreen;

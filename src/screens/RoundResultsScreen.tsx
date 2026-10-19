import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { observer } from 'mobx-react-lite';
import { gameStore } from '../stores/GameStore';
import { RoundResultsScreenProps } from '../navigation/NavTypes';
import { roundDurationsStore } from '../stores/RoundDurationStore';
import { Button } from '../components/Button';
import { colors } from '../theme';

const RoundResultsScreen = observer(({ navigation }: RoundResultsScreenProps) => {
    const results = gameStore.getResults();

    const renderItem = ({ item }: { item: string }) => {
        const { explainer, guesser } = results[item];
        const totalScore = explainer + guesser;
        return (
            <View style={styles.playerContainer}>
                <Text style={styles.playerTitle}>{item}</Text>
                <Text style={styles.text}>Объяснено: {explainer}</Text>
                <Text style={styles.text}>Угадано: {guesser}</Text>
                <Text style={styles.text}>Всего: {totalScore}</Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.h1}>Раунд {roundDurationsStore.currentRound} завершен</Text>
            <Text style={styles.h2}>В следующем раунде {roundDurationsStore.currentRound < 2 ? 'объясняем только жестами' : 'объясняем только одним словом'}</Text>
            <FlatList
                data={Object.keys(results)}
                keyExtractor={(item) => item}
                renderItem={renderItem}
                style={styles.flatList}
            />
            <Button
                title="Следующий раунд"
                onPress={() => {
                    gameStore.endRound();
                    navigation.navigate('SelectGuesser');
                }}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10
    },
    h1: {
        fontSize: 28,
        marginBottom: 20,
        marginTop: 20,
        color: colors.text
    },
    h2: {
        fontSize: 20,
        marginBottom: 20,
        color: colors.text
    },
    flatList: {
        width: '100%',
        maxHeight: '65%'
    },
    text: {
        fontSize: 20,
        color: colors.text
    },
    playerContainer: {
        flex: 1,
        alignItems: "center",
        borderColor: colors.muted,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: colors.surface,
        padding: 10
    },
    playerTitle: {
        fontSize: 22,
        color: colors.primary
    }
});

export default RoundResultsScreen;

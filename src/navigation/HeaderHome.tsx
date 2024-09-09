import { View, Image, StyleSheet } from "react-native";

export const HeaderHome = (): React.JSX.Element =>
    <View style={styles.container}>
        <Image
            style={styles.headerImg}
            source={require('../assets/images/logo.png')}
        />
        <Image
            style={styles.headerText}
            source={require('../assets/images/logoText.png')}
        /> 
    </View>

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: 70,
        justifyContent: "flex-start",
        alignItems: "center"
    },
    headerText: {
        width: 200,
        height: 60,
        resizeMode: "contain"
    },
    headerImg: {
        width: 80,
        height: 80,
        resizeMode: "contain"
    }
})
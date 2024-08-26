import { TouchableOpacity, Text, StyleSheet, DimensionValue } from "react-native";

type ButtonProps = {
    onPress: () => void;
    title: string;
    disabled?: boolean; 
    width?: DimensionValue | undefined;
    style?: object
}

export const Button = (props: ButtonProps) => (
    <TouchableOpacity onPress={props.onPress} style={styles(props).buttonContainer} disabled={props.disabled}>
      <Text style={styles(props).buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );

const styles = (props: ButtonProps) => StyleSheet.create({
    buttonContainer: {
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 10,
        width: props.width ?? "auto",
        minWidth: props.width ?? 250,
        maxHeight: 50
      },
      buttonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
        textTransform: "uppercase"
      }
})
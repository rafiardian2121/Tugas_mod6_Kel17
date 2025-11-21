import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";


const AuthButton = ({ title, isLoading = false, onPress, style }) => {
    return (
        <Pressable style={[styles.button, style]} onPress={onPress}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        backgroundColor: '#078FC4',
        paddingVertical: 10
    },
    text: {
        fontFamily: "InstrumentSans",
        textAlign: "center",
        fontSize: 16,
        color: "#fff"
    }
})

export default AuthButton
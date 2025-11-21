import { Pressable, StyleSheet, Text, View } from "react-native";


const AuthSwitch = ({ activeState, setActiveState }) => {

    return (
        <View style={styles.base}>
            <Pressable style={[styles.switchButton, activeState === "login" && styles.activeButton]} onPress={() => setActiveState('login')}>
                <Text style={[styles.switchText, activeState === "login" && styles.activeText]}>Login</Text>
            </Pressable>
            <Pressable style={[styles.switchButton, activeState === "register" && styles.activeButton]} onPress={() => setActiveState('register')}>
                <Text style={[styles.switchText, activeState === "register" && styles.activeText]}>Create Account</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    base: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
        width: "100%",
    },
    switchButton: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeButton: {
        borderBottomColor: "#013763",
    },
    switchText: {
        fontFamily: "InstrumentSans",
        fontSize: 16,
        color: "#979797",
    },
    activeText: {
        color: "#000",
        fontWeight: "400",
    },
});


export default AuthSwitch
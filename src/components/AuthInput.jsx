import { StyleSheet, TextInput } from "react-native"

const AuthInput = ({ placeholder, ...props }) => {
    return (
        <TextInput style={styles.input} placeholder={placeholder} {...props} />
    )
}

const styles = StyleSheet.create({
    input: {
        width: '100%',
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#BAB5B5',
        fontFamily: 'InstrumentSans',
        fontSize: 15
    }
})

export default AuthInput
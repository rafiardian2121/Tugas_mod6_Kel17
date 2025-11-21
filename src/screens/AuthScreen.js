import AuthSwitch from "../components/AuthSwitch";
import LoginForm from "../components/LoginForm";
import { useState } from "react";
import { supabase } from '../lib/supabase'
import { Dimensions, Text, StyleSheet, View, Alert, Pressable } from "react-native";
import RegisterForm from "../components/RegisterForm";

const { width } = Dimensions.get("window");

const AuthScreen = () => {
    const [authState, setAuthState] = useState('login')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (email, password) => {
        if (loading)
            return

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })
        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    const handleRegister = async (email, password) => {
        if (loading)
            return

        setLoading(true)
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        })
        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }

    const handleAnonymous = async () => {
        const { data, error } = await supabase.auth.signInAnonymously()

        console.log(data)
    }

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Text>Login</Text>
            </View>
            <View style={styles.formContainer}>
                <AuthSwitch setActiveState={setAuthState} activeState={authState} />
                {authState == 'login' ? (<LoginForm handleLogin={handleLogin} />) : (<RegisterForm handleRegister={handleRegister} />)}
                <Text onPress={handleAnonymous}>Login anonymously</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    imageContainer: {
        flex: 1,
        paddingBottom: 16,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    formContainer: {
        flex: 1,
        width: width * 0.7,
        paddingTop: 0,
        paddingBottom: 128,
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 16
    }
})

export default AuthScreen
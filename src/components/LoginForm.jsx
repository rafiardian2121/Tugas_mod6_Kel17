import { Eye, EyeClosed } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AuthButton from "./AuthButton";
import AuthInput from "./AuthInput";

export default function LoginForm({ handleLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);

    return (
        <>
            <View style={styles.inputContainer}>
                <AuthInput
                    placeholder="Enter your Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={{ position: 'relative', width: '100%' }}>
                    <AuthInput
                        placeholder="Enter your Password"
                        secureTextEntry={!visible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <Pressable
                        onPress={() => setVisible(prev => !prev)}
                        style={{ justifyContent: 'center', position: "absolute", height: '100%', right: 12 }}
                    >
                        {!visible ? (
                            <Eye stroke={"#BAB5B5"} />
                        ) : (
                            <EyeClosed stroke={"#BAB5B5"} />
                        )}
                    </Pressable>
                </View>
            </View>

            <AuthButton title='Login' onPress={() => handleLogin(email, password)} style={{ width: 256 }} />
        </>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        width: '100%',
        gap: 6
    },
});

// src/screens/ProfileScreen.js
import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { useTabSwipe } from "../hooks/useTabSwipe";

function ProfileScreen() {
    const { user, logout } = useAuth();

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Tidak ada pengguna yang login</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Profil Pengguna</Text>
            <View style={styles.infoCard}>
                <Text style={styles.label}>ID:</Text>
                <Text style={styles.value}>{user.id}</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
            </View>
            <View style={styles.infoCard}>
                <Text style={styles.label}>Dibuat Pada:</Text>
                <Text style={styles.value}>{new Date(user.created_at).toLocaleString()}</Text>
            </View>

            <Button title="Logout" onPress={logout} color="#DC2626" />
        </View>
    );
}

export default useTabSwipe(ProfileScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "600",
        marginBottom: 20,
        textAlign: "center",
    },
    infoCard: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: "#6B7280",
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
    },
});

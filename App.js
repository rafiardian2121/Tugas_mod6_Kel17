import { useEffect, useState, useCallback } from "react";
import { View, Image } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { enableScreens } from "react-native-screens";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-url-polyfill/auto';
import * as SplashScreen from "expo-splash-screen";

import MonitoringScreen from "./src/screens/MonitoringScreen";
import ControlScreen from "./src/screens/ControlScreen";
import AuthScreen from "./src/screens/AuthScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { AuthContext } from "./src/contexts/AuthContext";
import { supabase } from "./src/lib/supabase";
import { assertConfig } from "./src/services/config";
import { GestureHandlerRootView } from "react-native-gesture-handler";

enableScreens();
const Tab = createBottomTabNavigator();

export default function App() {
  const [session, setSession] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);

  const theme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: "#f8f9fb" },
  };

  useEffect(() => {
    async function prepare() {
      const start = Date.now(); // mulai timer
      try {
        await SplashScreen.preventAutoHideAsync();

        assertConfig();

        const { data } = await supabase.auth.getSession();
        setSession(data.session);

        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session);
        });

        // Proses tambahan bisa dimasukkan di sini

      } catch (e) {
        console.warn(e);
      } finally {
        // Hitung durasi proses
        const elapsed = Date.now() - start;
        const minimumDelay = 3500; // 1.5 detik
        const waitTime = Math.max(0, minimumDelay - elapsed);

        // Tunggu sisa waktu jika proses terlalu cepat
        await new Promise(resolve => setTimeout(resolve, waitTime));

        setIsAppReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  const authContextValue = {
    session,
    user: session?.user || null,
    logout: async () => {
      await AsyncStorage.clear();
      await supabase.auth.signOut();
      setSession(null);
    },
  };

  if (!isAppReady) {
    // Tampilan Splash Screen Custom
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("./assets/splash-icon.png")}
          style={{ width: 200, height: 200, resizeMode: "contain" }}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider onLayout={onLayoutRootView}>
        <AuthContext.Provider value={authContextValue}>
          <NavigationContainer theme={theme}>
            {session && session.user ? (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  headerShown: true,
                  headerTitle: "IOTWatch",
                  headerTitleAlign: "center",
                  headerTintColor: "#1f2937",
                  headerStyle: { backgroundColor: "#f8f9fb" },
                  headerTitleStyle: { fontWeight: "600", fontSize: 18 },
                  tabBarActiveTintColor: "#2563eb",
                  tabBarInactiveTintColor: "#94a3b8",
                  tabBarIcon: ({ color, size }) => {
                    const iconName =
                      route.name === "Monitoring"
                        ? "analytics"
                        : route.name === "Control"
                          ? "options"
                          : "person-circle";
                    return <Ionicons name={iconName} size={size} color={color} />;
                  },
                })}
              >
                <Tab.Screen name="Monitoring" component={MonitoringScreen} />
                {!session.user.is_anonymous && (
                  <Tab.Screen name="Control" component={ControlScreen} />
                )}
                <Tab.Screen name="Profile" component={ProfileScreen} />
              </Tab.Navigator>
            ) : (
              <AuthScreen />
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

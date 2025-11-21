import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import { useNavigation, useRoute } from "@react-navigation/native";

export function useTabSwipe(Component) {
    return function WrappedComponent(props) {
        const navigation = useNavigation();
        const route = useRoute();
        const translateX = useSharedValue(0);
        const SWIPE_THRESHOLD = 80; // ⬅ Biar ga gampang kegeser

        const changeTab = (direction) => {
            const state = navigation.getState();
            if (!state || !state.routes) return;

            const { routes, index } = state;

            if (direction === "left" && index < routes.length - 1) {
                navigation.navigate(routes[index + 1].name);
            } else if (direction === "right" && index > 0) {
                navigation.navigate(routes[index - 1].name);
            }
        };

        const pan = Gesture.Pan()
            .activeOffsetX([-10, 10]) // hanya aktif kalau swipe horizontal
            .failOffsetY([-10, 10])   // kalau gerak vertikal, gesture dianggap gagal
            .onUpdate((event) => {
                translateX.value = event.translationX;
            })
            .onEnd(() => {
                if (translateX.value < -SWIPE_THRESHOLD) {
                    runOnJS(changeTab)("left");
                } else if (translateX.value > SWIPE_THRESHOLD) {
                    runOnJS(changeTab)("right");
                }

                translateX.value = withTiming(0); // reset posisi
            });

        return (
            <GestureDetector gesture={pan}>
                <Animated.View style={{ flex: 1 }}>
                    <Component {...props} />
                </Animated.View>
            </GestureDetector>
        );
    };
}

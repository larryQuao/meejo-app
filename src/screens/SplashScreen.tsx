import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../constants/theme';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        // Simulate splash screen delay then fade out
        setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                onFinish();
            });
        }, 2500);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <StatusBar style="dark" />
            <View style={styles.logoContainer}>
                {/* Placeholder for the 'M' Logo - using text for now as asset generation is limited */}
                <Text style={styles.logoText}>M</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
    },
    logoContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 100,
        fontWeight: 'bold',
        color: COLORS.primary,
        fontFamily: 'System', // Use system font
        includeFontPadding: false,
    },
});

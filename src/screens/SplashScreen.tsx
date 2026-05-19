import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.7)).current;
    const containerFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Hold then fade out
            setTimeout(() => {
                Animated.timing(containerFade, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => onFinish());
            }, 1800);
        });
    }, []);

    return (
        <Animated.View style={[styles.wrapper, { opacity: containerFade }]}>
            <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary, '#4F8EF8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <StatusBar style="light" />

                {/* Decorative circles */}
                <View style={styles.circleTopRight} />
                <View style={styles.circleBottomLeft} />

                {/* Logo */}
                <Animated.View style={[styles.logoWrap, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoLetter}>M</Text>
                    </View>
                    <Text style={styles.appName}>meejo</Text>
                    <Text style={styles.tagline}>Swap. Buy. Save.</Text>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleTopRight: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    circleBottomLeft: {
        position: 'absolute',
        bottom: -80,
        left: -80,
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    logoWrap: {
        alignItems: 'center',
    },
    logoContainer: {
        width: 88,
        height: 88,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
        marginBottom: 20,
    },
    logoLetter: {
        fontSize: 52,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: -2,
        includeFontPadding: false,
    },
    appName: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        letterSpacing: 1.5,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 2,
        fontWeight: '500',
        textTransform: 'uppercase',
    },
});

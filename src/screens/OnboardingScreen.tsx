import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface OnboardingScreenProps {
    onNext: () => void;
}

const { height } = Dimensions.get('window');

const NETWORK_CARDS = [
    { label: 'MTN', color: '#FCD34D', textColor: '#92400E' },
    { label: 'AT', color: '#3B82F6', textColor: '#fff' },
    { label: 'Telecel', color: '#EF4444', textColor: '#fff' },
];

export default function OnboardingScreen({ onNext }: OnboardingScreenProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Hero Area */}
            <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroArea}
            >
                {/* Decorative circles */}
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />

                <View style={styles.networkSwapContainer}>
                    {/* Left network */}
                    <View style={[styles.networkCard, { backgroundColor: NETWORK_CARDS[0].color }]}>
                        <Text style={[styles.networkLabel, { color: NETWORK_CARDS[0].textColor }]}>MTN</Text>
                        <Ionicons name="phone-portrait" size={20} color={NETWORK_CARDS[0].textColor} />
                    </View>

                    {/* Swap arrows */}
                    <View style={styles.arrowsContainer}>
                        <View style={styles.arrowPill}>
                            <Ionicons name="swap-horizontal" size={28} color={COLORS.white} />
                        </View>
                    </View>

                    {/* Right networks stack */}
                    <View style={styles.rightNetworks}>
                        <View style={[styles.networkCard, { backgroundColor: NETWORK_CARDS[1].color, marginBottom: 10 }]}>
                            <Text style={[styles.networkLabel, { color: NETWORK_CARDS[1].textColor }]}>AT</Text>
                            <Ionicons name="wifi" size={20} color={NETWORK_CARDS[1].textColor} />
                        </View>
                        <View style={[styles.networkCard, { backgroundColor: NETWORK_CARDS[2].color }]}>
                            <Text style={[styles.networkLabel, { color: NETWORK_CARDS[2].textColor }]}>Telecel</Text>
                            <Ionicons name="phone-portrait" size={20} color={NETWORK_CARDS[2].textColor} />
                        </View>
                    </View>
                </View>

                {/* Feature pills */}
                <View style={styles.pillsRow}>
                    {['Buy Data', 'Buy Airtime', 'Swap'].map((label) => (
                        <View key={label} style={styles.featurePill}>
                            <Text style={styles.featurePillText}>{label}</Text>
                        </View>
                    ))}
                </View>
            </LinearGradient>

            {/* Content Area */}
            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.headline}>Exchange With Ease</Text>
                <Text style={styles.bodyText}>
                    Swap airtime or data between any network — MTN, Telecel, AT — instantly and hassle-free.
                </Text>

                {/* Step dots */}
                <View style={styles.dotsRow}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.dotActive]} />
                    <View style={styles.dot} />
                </View>

                <TouchableOpacity style={styles.button} onPress={onNext} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color={COLORS.white} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    heroArea: {
        height: height * 0.52,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 32,
        overflow: 'hidden',
    },
    decCircle1: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    decCircle2: {
        position: 'absolute',
        bottom: -30,
        left: -40,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    networkSwapContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        marginBottom: 28,
    },
    networkCard: {
        width: 90,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        gap: 8,
        ...SHADOWS.md,
    },
    networkLabel: {
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    arrowsContainer: {
        alignItems: 'center',
    },
    arrowPill: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    rightNetworks: {
        alignItems: 'center',
    },
    pillsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    featurePill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    featurePillText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingTop: 36,
    },
    headline: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    bodyText: {
        fontSize: 15,
        color: COLORS.textGrey,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.border,
    },
    dotActive: {
        width: 24,
        backgroundColor: COLORS.primary,
    },
    button: {
        width: '100%',
        borderRadius: 18,
        overflow: 'hidden',
        ...SHADOWS.primary,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

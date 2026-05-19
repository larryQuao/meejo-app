import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface TransactionSuccessStateProps {
    message: string;
    subMessage: string;
    onDone: () => void;
}

export default function TransactionSuccessState({ message, subMessage, onDone }: TransactionSuccessStateProps) {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[COLORS.successLight, COLORS.background]}
                style={styles.gradientTop}
            >
                <Animated.View style={[styles.iconArea, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    {/* Outer ring */}
                    <View style={styles.ring2} />
                    <View style={styles.ring1} />
                    <View style={styles.iconCircle}>
                        <Ionicons name="checkmark" size={44} color={COLORS.white} />
                    </View>
                </Animated.View>
            </LinearGradient>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Success!</Text>
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.subMessage}>{subMessage}</Text>

                <View style={[styles.detailCard, SHADOWS.sm]}>
                    <View style={styles.detailRow}>
                        <Ionicons name="time-outline" size={16} color={COLORS.textGrey} />
                        <Text style={styles.detailText}>Processed instantly</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.success} />
                        <Text style={styles.detailText}>Transaction secured</Text>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.doneBtnGradient}
                    >
                        <Text style={styles.doneBtnText}>Done</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    gradientTop: {
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconArea: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
    ring2: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
    },
    ring1: {
        position: 'absolute',
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: COLORS.success,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.success,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingTop: 28,
    },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 8, letterSpacing: -0.5 },
    message: { fontSize: 16, fontWeight: '600', color: COLORS.textMid, textAlign: 'center', marginBottom: 8 },
    subMessage: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
    detailCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        width: '100%',
        gap: 12,
    },
    detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    detailText: { fontSize: 14, color: COLORS.textMid, fontWeight: '500' },
    footer: { padding: 24, paddingBottom: 36 },
    doneBtn: { borderRadius: 16, overflow: 'hidden', ...SHADOWS.primary },
    doneBtnGradient: { paddingVertical: 18, alignItems: 'center' },
    doneBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
});

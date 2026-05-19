import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface TransactionErrorStateProps {
    message: string;
    onRetry: () => void;
    onClose: () => void;
}

export default function TransactionErrorState({ message, onRetry, onClose }: TransactionErrorStateProps) {
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
                colors={[COLORS.dangerLight, COLORS.background]}
                style={styles.gradientTop}
            >
                <Animated.View style={[styles.iconArea, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    <View style={styles.ring2} />
                    <View style={styles.ring1} />
                    <View style={styles.iconCircle}>
                        <Ionicons name="close" size={44} color={COLORS.white} />
                    </View>
                </Animated.View>
            </LinearGradient>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.title}>Failed</Text>
                <Text style={styles.message}>Transaction Failed</Text>
                <Text style={styles.subMessage}>{message}</Text>

                <View style={[styles.infoCard, SHADOWS.sm]}>
                    <Ionicons name="alert-circle-outline" size={18} color={COLORS.danger} />
                    <Text style={styles.infoText}>Don't worry — your balance has not been deducted.</Text>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.retryBtnGradient}
                    >
                        <Ionicons name="refresh" size={18} color={COLORS.white} style={{ marginRight: 8 }} />
                        <Text style={styles.retryBtnText}>Try Again</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
                    <Text style={styles.closeBtnText}>Cancel</Text>
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
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
    },
    ring1: {
        position: 'absolute',
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(239, 68, 68, 0.12)',
    },
    iconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: COLORS.danger,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.danger,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 28,
        paddingTop: 28,
    },
    title: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 8, letterSpacing: -0.5 },
    message: { fontSize: 16, fontWeight: '600', color: COLORS.textMid, textAlign: 'center', marginBottom: 8 },
    subMessage: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: '85%' },
    infoCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    infoText: { fontSize: 13, color: COLORS.textMid, fontWeight: '500', flex: 1, lineHeight: 20 },
    footer: { padding: 24, paddingBottom: 36, gap: 12 },
    retryBtn: { borderRadius: 16, overflow: 'hidden', ...SHADOWS.primary },
    retryBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    retryBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
    closeBtn: { paddingVertical: 14, alignItems: 'center' },
    closeBtnText: { color: COLORS.textGrey, fontSize: 16, fontWeight: '600' },
});

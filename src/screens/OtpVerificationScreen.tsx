import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface OtpVerificationScreenProps {
    phone?: string;
    onVerified: () => void;
    onBack: () => void;
}

const OTP_LENGTH = 6;
const RESEND_SECONDS = 180;

export default function OtpVerificationScreen({ phone = '0XX XXX XXXX', onVerified, onBack }: OtpVerificationScreenProps) {
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [countdown, setCountdown] = useState(RESEND_SECONDS);
    const [canResend, setCanResend] = useState(false);
    const ref0 = useRef<TextInput>(null);
    const ref1 = useRef<TextInput>(null);
    const ref2 = useRef<TextInput>(null);
    const ref3 = useRef<TextInput>(null);
    const ref4 = useRef<TextInput>(null);
    const ref5 = useRef<TextInput>(null);
    const inputRefs = [ref0, ref1, ref2, ref3, ref4, ref5];
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
        setTimeout(() => inputRefs[0].current?.focus(), 400);
    }, []);

    useEffect(() => {
        if (countdown <= 0) { setCanResend(true); return; }
        const timer = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (value: string, index: number) => {
        if (value.length > 1) return;
        const next = [...otp];
        next[index] = value;
        setOtp(next);
        if (value && index < OTP_LENGTH - 1) inputRefs[index + 1].current?.focus();
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleResend = () => {
        setOtp(Array(OTP_LENGTH).fill(''));
        setCountdown(RESEND_SECONDS);
        setCanResend(false);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
    };

    const isComplete = otp.every(d => d !== '');
    const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const maskedPhone = phone.replace(/(\d{3})\d{4}(\d{4})/, '$1 •••• $2');

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="light" />

            <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
                    <Ionicons name="arrow-back" size={22} color={COLORS.white} />
                </TouchableOpacity>
                <View style={styles.logoWrap}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoLetter}>M</Text>
                    </View>
                    <Text style={styles.logoText}>meejo</Text>
                </View>
            </LinearGradient>

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                <Text style={styles.heading}>Enter the OTP</Text>
                <Text style={styles.subheading}>
                    Enter the 6-digit code sent to{'\n'}
                    <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
                </Text>

                <Text style={styles.label}>Enter Code</Text>

                {/* OTP boxes */}
                <View style={styles.otpRow}>
                    {otp.map((digit, i) => (
                        <TextInput
                            key={i}
                            ref={inputRefs[i]}
                            style={[styles.otpBox, digit && styles.otpBoxFilled]}
                            value={digit}
                            onChangeText={v => handleChange(v, i)}
                            onKeyPress={e => handleKeyPress(e, i)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Resend */}
                {canResend ? (
                    <TouchableOpacity onPress={handleResend} activeOpacity={0.75}>
                        <Text style={styles.resendActive}>Resend Code</Text>
                    </TouchableOpacity>
                ) : (
                    <Text style={styles.resendTimer}>
                        Resend Code in : <Text style={styles.timerValue}>{formatTime(countdown)}</Text>
                    </Text>
                )}

                {/* Verify button */}
                <TouchableOpacity
                    style={[styles.btn, !isComplete && styles.btnDisabled]}
                    onPress={onVerified}
                    disabled={!isComplete}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={isComplete ? [COLORS.primary, COLORS.primaryDark] : ['#CBD5E1', '#CBD5E1']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.btnGradient}
                    >
                        <Text style={styles.btnText}>Verify</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        paddingTop: 60, paddingBottom: 36,
        alignItems: 'center', overflow: 'hidden',
    },
    decCircle1: {
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    decCircle2: {
        position: 'absolute', bottom: -30, left: -30,
        width: 120, height: 120, borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: { position: 'absolute', top: 56, left: 20, padding: 8 },
    logoWrap: { alignItems: 'center', gap: 10 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    },
    logoLetter: { fontSize: 36, fontWeight: '900', color: COLORS.white },
    logoText: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
    content: {
        flex: 1, paddingHorizontal: 24, paddingTop: 36,
    },
    heading: {
        fontSize: 28, fontWeight: '800', color: COLORS.textDark,
        letterSpacing: -0.5, marginBottom: 8,
    },
    subheading: {
        fontSize: 15, color: COLORS.textGrey, lineHeight: 22, marginBottom: 36,
    },
    phoneHighlight: { color: COLORS.textDark, fontWeight: '700' },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 14 },
    otpRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpBox: {
        width: 50, height: 56,
        borderWidth: 1.5, borderColor: COLORS.border,
        borderRadius: 14, fontSize: 22, fontWeight: '700',
        textAlign: 'center', color: COLORS.textDark,
        backgroundColor: COLORS.white, ...SHADOWS.sm,
    },
    otpBoxFilled: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    resendTimer: {
        fontSize: 14, color: COLORS.textGrey, textAlign: 'center', marginBottom: 32,
    },
    timerValue: { color: COLORS.primary, fontWeight: '700' },
    resendActive: {
        fontSize: 14, color: COLORS.primary, fontWeight: '700',
        textAlign: 'center', marginBottom: 32,
    },
    btn: { borderRadius: 18, overflow: 'hidden', ...SHADOWS.primary },
    btnDisabled: { shadowOpacity: 0, elevation: 0 },
    btnGradient: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', paddingVertical: 18,
    },
    btnText: { color: COLORS.white, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
});

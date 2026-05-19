import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface CreatePinScreenProps {
    onDone: () => void;
    onBack: () => void;
}

type Step = 'create' | 'confirm' | 'success';

export default function CreatePinScreen({ onDone, onBack }: CreatePinScreenProps) {
    const [step, setStep] = useState<Step>('create');
    const [pin, setPin] = useState<string[]>(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState<string[]>(['', '', '', '']);
    const [mismatch, setMismatch] = useState(false);
    const iRef0 = useRef<TextInput>(null);
    const iRef1 = useRef<TextInput>(null);
    const iRef2 = useRef<TextInput>(null);
    const iRef3 = useRef<TextInput>(null);
    const inputRefs = [iRef0, iRef1, iRef2, iRef3];
    const cRef0 = useRef<TextInput>(null);
    const cRef1 = useRef<TextInput>(null);
    const cRef2 = useRef<TextInput>(null);
    const cRef3 = useRef<TextInput>(null);
    const confirmRefs = [cRef0, cRef1, cRef2, cRef3];
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        if (step === 'confirm') {
            setConfirmPin(['', '', '', '']);
            setMismatch(false);
            setTimeout(() => confirmRefs[0].current?.focus(), 200);
        }
        if (step === 'create') {
            setTimeout(() => inputRefs[0].current?.focus(), 400);
        }
        if (step === 'success') {
            Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
        }
    }, [step]);

    const handleChange = (value: string, index: number, refs: React.RefObject<TextInput | null>[], setter: (v: string[]) => void, current: string[]) => {
        if (value.length > 1) return;
        const next = [...current];
        next[index] = value;
        setter(next);
        if (value && index < 3) refs[index + 1].current?.focus();
    };

    const handleKeyPress = (e: any, index: number, refs: React.RefObject<TextInput | null>[], current: string[]) => {
        if (e.nativeEvent.key === 'Backspace' && !current[index] && index > 0) {
            refs[index - 1].current?.focus();
        }
    };

    const handleContinue = () => {
        if (step === 'create') {
            setStep('confirm');
        } else if (step === 'confirm') {
            if (pin.join('') === confirmPin.join('')) {
                setStep('success');
            } else {
                setMismatch(true);
                setConfirmPin(['', '', '', '']);
                setTimeout(() => confirmRefs[0].current?.focus(), 100);
            }
        }
    };

    const createComplete = pin.every(d => d !== '');
    const confirmComplete = confirmPin.every(d => d !== '');

    if (step === 'success') {
        return (
            <View style={styles.container}>
                <StatusBar style="light" />
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <View style={styles.decCircle1} />
                    <View style={styles.decCircle2} />
                    <View style={styles.logoWrap}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoLetter}>M</Text>
                        </View>
                        <Text style={styles.logoText}>meejo</Text>
                    </View>
                </LinearGradient>

                <Animated.View style={[styles.successContent, { opacity: fadeAnim }]}>
                    <Animated.View style={[styles.successIconWrap, { transform: [{ scale: scaleAnim }] }]}>
                        <Ionicons name="checkmark-circle" size={96} color={COLORS.success} />
                    </Animated.View>
                    <Text style={styles.successHeading}>All Set!</Text>
                    <Text style={styles.successSubtext}>You're done setting up your Meejo account</Text>

                    <TouchableOpacity style={styles.btn} onPress={onDone} activeOpacity={0.85}>
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primaryDark]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={styles.btnGradient}
                        >
                            <Text style={styles.btnText}>Go to Dashboard</Text>
                            <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                        </LinearGradient>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        );
    }

    const activePin = step === 'create' ? pin : confirmPin;
    const activeSetter = step === 'create' ? setPin : setConfirmPin;
    const activeRefs = step === 'create' ? inputRefs : confirmRefs;
    const isComplete = step === 'create' ? createComplete : confirmComplete;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="light" />

            <LinearGradient
                colors={[COLORS.primaryDark, COLORS.primary]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.decCircle1} />
                <View style={styles.decCircle2} />
                {step === 'confirm' && (
                    <TouchableOpacity style={styles.backBtn} onPress={() => setStep('create')} activeOpacity={0.75}>
                        <Ionicons name="arrow-back" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                )}
                {step === 'create' && (
                    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.75}>
                        <Ionicons name="arrow-back" size={22} color={COLORS.white} />
                    </TouchableOpacity>
                )}
                <View style={styles.logoWrap}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoLetter}>M</Text>
                    </View>
                    <Text style={styles.logoText}>meejo</Text>
                </View>
            </LinearGradient>

            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <Text style={styles.heading}>
                    {step === 'create' ? 'Create your Meejo Pin' : 'Confirm your PIN'}
                </Text>
                <Text style={styles.subheading}>
                    {step === 'create'
                        ? 'This PIN will be used to authorise your transactions'
                        : 'Re-enter your PIN to confirm'}
                </Text>

                {mismatch && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>PINs don't match. Please try again.</Text>
                    </View>
                )}

                <Text style={styles.label}>{step === 'create' ? 'Enter PIN' : 'Confirm PIN'}</Text>

                <View style={styles.pinRow}>
                    {activePin.map((digit, i) => (
                        <TextInput
                            key={i}
                            ref={activeRefs[i]}
                            style={[styles.pinBox, digit && styles.pinBoxFilled, mismatch && styles.pinBoxError]}
                            value={digit}
                            onChangeText={v => handleChange(v, i, activeRefs, activeSetter, activePin)}
                            onKeyPress={e => handleKeyPress(e, i, activeRefs, activePin)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.btn, !isComplete && styles.btnDisabled]}
                    onPress={handleContinue}
                    disabled={!isComplete}
                    activeOpacity={0.85}
                >
                    <LinearGradient
                        colors={isComplete ? [COLORS.primary, COLORS.primaryDark] : ['#CBD5E1', '#CBD5E1']}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.btnGradient}
                    >
                        <Text style={styles.btnText}>{step === 'create' ? 'Continue' : 'Set PIN'}</Text>
                        <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
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
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 36 },
    heading: {
        fontSize: 26, fontWeight: '800', color: COLORS.textDark,
        letterSpacing: -0.5, marginBottom: 8,
    },
    subheading: { fontSize: 15, color: COLORS.textGrey, lineHeight: 22, marginBottom: 28 },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 14 },
    errorBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.dangerLight, borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20,
    },
    errorText: { fontSize: 13, color: COLORS.danger, fontWeight: '500', flex: 1 },
    pinRow: {
        flexDirection: 'row', gap: 16, marginBottom: 40,
    },
    pinBox: {
        flex: 1, height: 64,
        borderWidth: 1.5, borderColor: COLORS.border,
        borderRadius: 16, fontSize: 24, fontWeight: '800',
        textAlign: 'center', color: COLORS.textDark,
        backgroundColor: COLORS.white, ...SHADOWS.sm,
    },
    pinBoxFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    pinBoxError: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight },
    btn: { borderRadius: 18, overflow: 'hidden', ...SHADOWS.primary },
    btnDisabled: { shadowOpacity: 0, elevation: 0 },
    btnGradient: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', paddingVertical: 18,
    },
    btnText: { color: COLORS.white, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },

    // Success state
    successContent: {
        flex: 1, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: 24, paddingBottom: 40,
    },
    successIconWrap: { marginBottom: 24 },
    successHeading: {
        fontSize: 32, fontWeight: '800', color: COLORS.textDark,
        letterSpacing: -0.5, marginBottom: 12,
    },
    successSubtext: {
        fontSize: 15, color: COLORS.textGrey, textAlign: 'center',
        lineHeight: 22, marginBottom: 48,
    },
});

import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface ChangePinScreenProps {
    onBack: () => void;
    onDone: () => void;
}

type Step = 'current' | 'new' | 'confirm' | 'success';
const MOCK_CURRENT_PIN = '1234';

export default function ChangePinScreen({ onBack, onDone }: ChangePinScreenProps) {
    const [step, setStep] = useState<Step>('current');
    const [currentPin, setCurrentPin] = useState(['', '', '', '']);
    const [newPin, setNewPin] = useState(['', '', '', '']);
    const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
    const [wrongPin, setWrongPin] = useState(false);
    const [mismatch, setMismatch] = useState(false);

    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    // current refs
    const cRef0 = useRef<TextInput>(null); const cRef1 = useRef<TextInput>(null);
    const cRef2 = useRef<TextInput>(null); const cRef3 = useRef<TextInput>(null);
    const currentRefs = [cRef0, cRef1, cRef2, cRef3];

    // new refs
    const nRef0 = useRef<TextInput>(null); const nRef1 = useRef<TextInput>(null);
    const nRef2 = useRef<TextInput>(null); const nRef3 = useRef<TextInput>(null);
    const newRefs = [nRef0, nRef1, nRef2, nRef3];

    // confirm refs
    const cfRef0 = useRef<TextInput>(null); const cfRef1 = useRef<TextInput>(null);
    const cfRef2 = useRef<TextInput>(null); const cfRef3 = useRef<TextInput>(null);
    const confirmRefs = [cfRef0, cfRef1, cfRef2, cfRef3];

    useEffect(() => {
        if (step === 'current') setTimeout(() => currentRefs[0].current?.focus(), 300);
        if (step === 'new') { setNewPin(['', '', '', '']); setMismatch(false); setTimeout(() => newRefs[0].current?.focus(), 200); }
        if (step === 'confirm') { setConfirmPin(['', '', '', '']); setTimeout(() => confirmRefs[0].current?.focus(), 200); }
        if (step === 'success') Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
    }, [step]);

    const handleChange = (value: string, index: number, refs: React.RefObject<TextInput | null>[], setter: (v: string[]) => void, current: string[]) => {
        if (value.length > 1) return;
        const next = [...current]; next[index] = value; setter(next);
        if (value && index < 3) refs[index + 1].current?.focus();
    };

    const handleKeyPress = (e: any, index: number, refs: React.RefObject<TextInput | null>[], current: string[]) => {
        if (e.nativeEvent.key === 'Backspace' && !current[index] && index > 0) refs[index - 1].current?.focus();
    };

    const handleContinue = () => {
        if (step === 'current') {
            if (currentPin.join('') === MOCK_CURRENT_PIN) { setWrongPin(false); setStep('new'); }
            else { setWrongPin(true); setCurrentPin(['', '', '', '']); setTimeout(() => currentRefs[0].current?.focus(), 100); }
        } else if (step === 'new') {
            setStep('confirm');
        } else if (step === 'confirm') {
            if (newPin.join('') === confirmPin.join('')) setStep('success');
            else { setMismatch(true); setConfirmPin(['', '', '', '']); setTimeout(() => confirmRefs[0].current?.focus(), 100); }
        }
    };

    const getState = () => {
        if (step === 'current') return { pin: currentPin, setter: setCurrentPin, refs: currentRefs };
        if (step === 'new') return { pin: newPin, setter: setNewPin, refs: newRefs };
        return { pin: confirmPin, setter: setConfirmPin, refs: confirmRefs };
    };

    const { pin, setter, refs } = getState();
    const isComplete = pin.every(d => d !== '');
    const hasError = step === 'current' ? wrongPin : step === 'confirm' ? mismatch : false;

    const TITLES: Record<Step, string> = {
        current: 'Enter current PIN',
        new: 'Create new PIN',
        confirm: 'Confirm new PIN',
        success: '',
    };
    const SUBS: Record<Step, string> = {
        current: 'Enter your existing 4-digit transaction PIN',
        new: 'Choose a new 4-digit transaction PIN',
        confirm: 'Re-enter your new PIN to confirm',
        success: '',
    };
    const BTN_LABELS: Record<Step, string> = { current: 'Verify', new: 'Continue', confirm: 'Change PIN', success: '' };
    const stepNum = step === 'current' ? 1 : step === 'new' ? 2 : 3;

    if (step === 'success') {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <View style={{ width: 38 }} />
                    <Text style={styles.headerTitle}>Change PIN</Text>
                    <View style={{ width: 38 }} />
                </View>
                <View style={styles.successWrap}>
                    <Animated.View style={[styles.successIcon, { transform: [{ scale: scaleAnim }] }]}>
                        <Ionicons name="lock-closed" size={36} color={COLORS.success} />
                    </Animated.View>
                    <Text style={styles.successTitle}>PIN Changed!</Text>
                    <Text style={styles.successSub}>Your transaction PIN has been updated successfully</Text>
                    <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.8}>
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={step === 'current' ? onBack : () => setStep(step === 'confirm' ? 'new' : 'current')} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Change PIN</Text>
                <View style={{ width: 38 }} />
            </View>

            <View style={styles.content}>
                {/* Step dots */}
                <View style={styles.stepRow}>
                    {[1, 2, 3].map(n => (
                        <View key={n} style={styles.stepItem}>
                            <View style={[styles.stepDot, n <= stepNum && styles.stepDotActive]}>
                                {n < stepNum && <Ionicons name="checkmark" size={11} color={COLORS.white} />}
                            </View>
                            {n < 3 && <View style={[styles.stepLine, n < stepNum && styles.stepLineActive]} />}
                        </View>
                    ))}
                </View>

                <Text style={styles.title}>{TITLES[step]}</Text>
                <Text style={styles.subtitle}>{SUBS[step]}</Text>

                {hasError && (
                    <View style={styles.errorBanner}>
                        <Ionicons name="alert-circle-outline" size={16} color={COLORS.danger} />
                        <Text style={styles.errorText}>
                            {step === 'current' ? 'Incorrect PIN. Try again.' : "PINs don't match. Try again."}
                        </Text>
                    </View>
                )}

                <View style={styles.pinRow}>
                    {pin.map((digit, i) => (
                        <TextInput
                            key={`${step}-${i}`}
                            ref={refs[i]}
                            style={[styles.pinBox, digit && styles.pinBoxFilled, hasError && styles.pinBoxError]}
                            value={digit}
                            onChangeText={v => handleChange(v, i, refs, setter, pin)}
                            onKeyPress={e => handleKeyPress(e, i, refs, pin)}
                            keyboardType="number-pad"
                            maxLength={1}
                            secureTextEntry
                            selectTextOnFocus
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.continueBtn, !isComplete && styles.continueBtnOff]}
                    onPress={handleContinue}
                    disabled={!isComplete}
                    activeOpacity={0.8}
                >
                    <Text style={styles.continueBtnText}>{BTN_LABELS[step]}</Text>
                </TouchableOpacity>

                {step === 'current' && (
                    <TouchableOpacity style={styles.forgotBtn} activeOpacity={0.7}>
                        <Text style={styles.forgotBtnText}>Forgot PIN?</Text>
                    </TouchableOpacity>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.white, paddingHorizontal: 8,
        paddingTop: 56, paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },

    content: { flex: 1, paddingHorizontal: 24, paddingTop: 36 },

    stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
    stepItem: { flexDirection: 'row', alignItems: 'center' },
    stepDot: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center',
    },
    stepDotActive: { backgroundColor: COLORS.textDark },
    stepLine: { width: 40, height: 2, backgroundColor: '#E5E7EB', marginHorizontal: 6 },
    stepLineActive: { backgroundColor: COLORS.textDark },

    title: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 6 },
    subtitle: { fontSize: 14, color: COLORS.textGrey, lineHeight: 20, marginBottom: 24 },

    errorBanner: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.dangerLight, borderRadius: 10,
        paddingHorizontal: 14, paddingVertical: 10, marginBottom: 20,
    },
    errorText: { fontSize: 13, color: COLORS.danger, fontWeight: '500', flex: 1 },

    pinRow: { flexDirection: 'row', gap: 14, marginBottom: 36 },
    pinBox: {
        flex: 1, height: 62, borderWidth: 1.5, borderColor: '#E5E7EB',
        borderRadius: 14, fontSize: 22, fontWeight: '800',
        textAlign: 'center', color: COLORS.textDark, backgroundColor: COLORS.white,
        ...SHADOWS.sm,
    },
    pinBoxFilled: { borderColor: COLORS.textDark },
    pinBoxError: { borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight },

    continueBtn: { backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
    continueBtnOff: { opacity: 0.3 },
    continueBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

    forgotBtn: { alignItems: 'center', marginTop: 20 },
    forgotBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },

    // Success
    successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    successIcon: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center',
        marginBottom: 24,
    },
    successTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
    successSub: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 20, marginBottom: 40 },
    doneBtn: { backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 15, paddingHorizontal: 48 },
    doneBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});

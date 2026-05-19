import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Animated, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface RegisterScreenProps {
    onNext: () => void;
    onBack: () => void;
}

export default function RegisterScreen({ onNext, onBack }: RegisterScreenProps) {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const isValid = fullName.trim().length >= 2 && phone.replace(/\s/g, '').length >= 9;

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar style="light" />

            {/* Top gradient header */}
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

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                    <Text style={styles.heading}>Let's get started</Text>
                    <Text style={styles.subheading}>Enter your full name and phone number to sign up</Text>

                    {/* Full Name */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Your Full Name</Text>
                        <View style={[styles.inputWrap, focusedField === 'name' && styles.inputWrapFocused]}>
                            <Ionicons name="person-outline" size={18} color={focusedField === 'name' ? COLORS.primary : COLORS.textGrey} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={fullName}
                                onChangeText={setFullName}
                                placeholder="Reynolds Maguire"
                                placeholderTextColor={COLORS.textLight}
                                autoCapitalize="words"
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Your Phone Number</Text>
                        <View style={[styles.inputRow, focusedField === 'phone' && styles.inputWrapFocused]}>
                            <View style={styles.flagChip}>
                                <Text style={styles.flagEmoji}>🇬🇭</Text>
                                <Text style={styles.dialCode}>+233</Text>
                                <Ionicons name="chevron-down" size={12} color={COLORS.textGrey} />
                            </View>
                            <View style={styles.inputDivider} />
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="0XX XXX XXXX"
                                placeholderTextColor={COLORS.textLight}
                                keyboardType="phone-pad"
                                onFocus={() => setFocusedField('phone')}
                                onBlur={() => setFocusedField(null)}
                                maxLength={13}
                            />
                        </View>
                    </View>

                    {/* Continue */}
                    <TouchableOpacity
                        style={[styles.btn, !isValid && styles.btnDisabled]}
                        onPress={onNext}
                        disabled={!isValid}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={isValid ? [COLORS.primary, COLORS.primaryDark] : ['#CBD5E1', '#CBD5E1']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.btnGradient}
                        >
                            <Text style={styles.btnText}>Continue</Text>
                            <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.loginLink} onPress={onBack} activeOpacity={0.75}>
                        <Text style={styles.loginLinkText}>
                            Already have an account?{' '}
                            <Text style={styles.loginLinkHighlight}>Log In</Text>
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        paddingTop: 60,
        paddingBottom: 36,
        alignItems: 'center',
        overflow: 'hidden',
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
    backBtn: {
        position: 'absolute',
        top: 56,
        left: 20,
        padding: 8,
    },
    logoWrap: { alignItems: 'center', gap: 10 },
    logoCircle: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
    },
    logoLetter: { fontSize: 36, fontWeight: '900', color: COLORS.white },
    logoText: { fontSize: 22, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
    scrollContent: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 40 },
    heading: {
        fontSize: 28, fontWeight: '800', color: COLORS.textDark,
        letterSpacing: -0.5, marginBottom: 8,
    },
    subheading: { fontSize: 15, color: COLORS.textGrey, marginBottom: 36, lineHeight: 22 },
    fieldGroup: { marginBottom: 20 },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 8 },
    inputWrap: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.white, borderRadius: 16,
        borderWidth: 1.5, borderColor: COLORS.border,
        ...SHADOWS.sm,
    },
    inputWrapFocused: { borderColor: COLORS.primary },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.white, borderRadius: 16,
        borderWidth: 1.5, borderColor: COLORS.border,
        overflow: 'hidden', ...SHADOWS.sm,
    },
    inputIcon: { paddingLeft: 16 },
    flagChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 14, paddingVertical: 18,
    },
    flagEmoji: { fontSize: 18 },
    dialCode: { fontSize: 14, fontWeight: '600', color: COLORS.textMid },
    inputDivider: { width: 1, height: 24, backgroundColor: COLORS.border },
    input: {
        flex: 1, paddingHorizontal: 14, paddingVertical: 18,
        fontSize: 16, color: COLORS.textDark, fontWeight: '500',
    },
    btn: { borderRadius: 18, overflow: 'hidden', marginTop: 8, ...SHADOWS.primary },
    btnDisabled: { shadowOpacity: 0, elevation: 0 },
    btnGradient: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'center', paddingVertical: 18,
    },
    btnText: { color: COLORS.white, fontSize: 17, fontWeight: '700', letterSpacing: 0.3 },
    loginLink: { alignItems: 'center', paddingVertical: 24 },
    loginLinkText: { fontSize: 15, color: COLORS.textGrey },
    loginLinkHighlight: { color: COLORS.primary, fontWeight: '700' },
});

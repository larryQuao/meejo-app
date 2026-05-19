import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface SecurityScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

export default function SecurityScreen({ onBack, onNavigate }: SecurityScreenProps) {
    const [biometrics, setBiometrics] = useState(false);
    const [twoFactor, setTwoFactor] = useState(true);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Security</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={[styles.card, SHADOWS.sm]}>
                    {/* Change PIN */}
                    <TouchableOpacity style={styles.row} onPress={() => onNavigate('changePin')} activeOpacity={0.55}>
                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Change PIN</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Biometric */}
                    <View style={styles.row}>
                        <Ionicons name="finger-print-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Biometric Login</Text>
                        <Switch
                            value={biometrics}
                            onValueChange={setBiometrics}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor={COLORS.white}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* 2FA */}
                    <View style={styles.row}>
                        <Ionicons name="shield-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Two-Factor Auth</Text>
                        <Switch
                            value={twoFactor}
                            onValueChange={setTwoFactor}
                            trackColor={{ false: COLORS.border, true: COLORS.primary }}
                            thumbColor={COLORS.white}
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Login Activity */}
                    <TouchableOpacity style={styles.row} onPress={() => {}} activeOpacity={0.55}>
                        <Ionicons name="time-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Login Activity</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                {/* Security tip */}
                <View style={styles.tip}>
                    <Ionicons name="information-circle-outline" size={16} color={COLORS.textGrey} />
                    <Text style={styles.tipText}>
                        Never share your PIN or OTP with anyone, including Meejo agents.
                    </Text>
                </View>

            </ScrollView>
        </View>
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

    content: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12 },

    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
    rowIcon: { marginRight: 16, width: 22 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },

    tip: {
        flexDirection: 'row', gap: 8, alignItems: 'flex-start',
        paddingHorizontal: 4,
    },
    tipText: { flex: 1, fontSize: 12, color: COLORS.textGrey, lineHeight: 18 },
});

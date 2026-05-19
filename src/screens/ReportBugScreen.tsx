import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface ReportBugScreenProps { onBack: () => void; }

const BUG_CATEGORIES = [
    { id: 'crash', label: 'App Crash', icon: 'skull-outline' },
    { id: 'payment', label: 'Payment Issue', icon: 'card-outline' },
    { id: 'exchange', label: 'Exchange Failed', icon: 'swap-horizontal' },
    { id: 'login', label: 'Login Problem', icon: 'lock-open-outline' },
    { id: 'display', label: 'Display / UI Bug', icon: 'phone-portrait-outline' },
    { id: 'notification', label: 'Notifications', icon: 'notifications-off-outline' },
    { id: 'other', label: 'Other', icon: 'help-circle-outline' },
];

const SEVERITY = [
    { id: 'low', label: 'Low', desc: 'Minor inconvenience', color: COLORS.success },
    { id: 'medium', label: 'Medium', desc: 'Affects usability', color: COLORS.warning },
    { id: 'high', label: 'High', desc: 'Blocks core feature', color: COLORS.danger },
];

export default function ReportBugScreen({ onBack }: ReportBugScreenProps) {
    const [category, setCategory] = useState('');
    const [severity, setSeverity] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [steps, setSteps] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const canSubmit = category && severity && title.trim().length > 5 && description.trim().length > 10;

    const handleSubmit = () => {
        if (!canSubmit) return;
        setSubmitted(true);
    };

    if (submitted) {
        const ticketId = `MEJ-BUG-${Math.floor(Math.random() * 90000) + 10000}`;
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Report a Bug</Text>
                    <View style={{ width: 38 }} />
                </View>
                <View style={styles.successWrap}>
                    <View style={styles.successIcon}>
                        <Ionicons name="checkmark-circle" size={44} color={COLORS.success} />
                    </View>
                    <Text style={styles.successTitle}>Report Submitted!</Text>
                    <Text style={styles.successSub}>
                        Thank you for helping us improve Meejo. Our engineering team will investigate and follow up.
                    </Text>
                    <View style={[styles.ticketCard, SHADOWS.sm]}>
                        <Text style={styles.ticketLabel}>Ticket ID</Text>
                        <Text style={styles.ticketId}>{ticketId}</Text>
                        <Text style={styles.ticketNote}>Save this for follow-up via Chat Support</Text>
                    </View>
                    <TouchableOpacity style={styles.doneBtn} onPress={onBack} activeOpacity={0.8}>
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
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Report a Bug</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Category */}
                <Text style={styles.sectionLabel}>What went wrong?</Text>
                <View style={styles.categoryGrid}>
                    {BUG_CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.catCard, category === cat.id && styles.catCardActive, SHADOWS.sm]}
                            onPress={() => setCategory(cat.id)}
                            activeOpacity={0.75}
                        >
                            <Ionicons
                                name={cat.icon as any}
                                size={22}
                                color={category === cat.id ? COLORS.white : COLORS.textGrey}
                            />
                            <Text style={[styles.catLabel, category === cat.id && styles.catLabelActive]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Severity */}
                <Text style={[styles.sectionLabel, { marginTop: 8 }]}>How severe is the issue?</Text>
                <View style={styles.severityRow}>
                    {SEVERITY.map(s => (
                        <TouchableOpacity
                            key={s.id}
                            style={[styles.sevCard, severity === s.id && { borderColor: s.color, borderWidth: 2 }, SHADOWS.sm]}
                            onPress={() => setSeverity(s.id)}
                            activeOpacity={0.75}
                        >
                            <View style={[styles.sevDot, { backgroundColor: s.color }]} />
                            <Text style={styles.sevLabel}>{s.label}</Text>
                            <Text style={styles.sevDesc}>{s.desc}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Details */}
                <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Describe the bug</Text>
                <View style={[styles.card, SHADOWS.sm]}>
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Short title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g. App crashes when I tap Exchange"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>
                    <View style={styles.fieldDivider} />
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>What happened? *</Text>
                        <TextInput
                            style={[styles.input, styles.inputMulti]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe what you expected vs. what actually happened..."
                            placeholderTextColor={COLORS.textLight}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                    <View style={styles.fieldDivider} />
                    <View style={styles.fieldWrap}>
                        <Text style={styles.fieldLabel}>Steps to reproduce (optional)</Text>
                        <TextInput
                            style={[styles.input, styles.inputMulti]}
                            value={steps}
                            onChangeText={setSteps}
                            placeholder="1. Open the app&#10;2. Tap Exchange&#10;3. ..."
                            placeholderTextColor={COLORS.textLight}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Device info auto-attach note */}
                <View style={styles.autoNote}>
                    <Ionicons name="information-circle-outline" size={15} color={COLORS.textGrey} />
                    <Text style={styles.autoNoteText}>
                        Device info and app version will be attached automatically to help our engineers.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, !canSubmit && styles.submitBtnOff]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                    activeOpacity={0.8}
                >
                    <Ionicons name="bug-outline" size={18} color={COLORS.white} />
                    <Text style={styles.submitBtnText}>Submit Report</Text>
                </TouchableOpacity>

            </ScrollView>
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

    content: { padding: 16, paddingBottom: 40 },
    sectionLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 10, paddingHorizontal: 2,
    },

    // Category grid
    categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
    catCard: {
        width: '30%', flexGrow: 1,
        backgroundColor: COLORS.white, borderRadius: 14,
        paddingVertical: 14, paddingHorizontal: 10,
        alignItems: 'center', gap: 6,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    catCardActive: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
    catLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textGrey, textAlign: 'center' },
    catLabelActive: { color: COLORS.white },

    // Severity
    severityRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
    sevCard: {
        flex: 1, backgroundColor: COLORS.white, borderRadius: 14,
        padding: 12, alignItems: 'center', gap: 4,
        borderWidth: 1.5, borderColor: 'transparent',
    },
    sevDot: { width: 10, height: 10, borderRadius: 5 },
    sevLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textDark },
    sevDesc: { fontSize: 10, color: COLORS.textGrey, textAlign: 'center' },

    // Form card
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
    fieldWrap: { padding: 16 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textGrey, marginBottom: 8 },
    input: { fontSize: 14, color: COLORS.textDark, fontWeight: '500', padding: 0 },
    inputMulti: { minHeight: 72, lineHeight: 20 },
    fieldDivider: { height: 1, backgroundColor: '#F0F0F0' },

    autoNote: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 7,
        marginBottom: 20, paddingHorizontal: 2,
    },
    autoNoteText: { flex: 1, fontSize: 12, color: COLORS.textGrey, lineHeight: 18 },

    submitBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 16,
    },
    submitBtnOff: { opacity: 0.35 },
    submitBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

    // Success
    successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
    successIcon: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    successTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
    successSub: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
    ticketCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 18,
        alignItems: 'center', width: '100%', marginBottom: 28,
    },
    ticketLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textGrey, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
    ticketId: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, letterSpacing: 1, marginBottom: 6 },
    ticketNote: { fontSize: 12, color: COLORS.textGrey },
    doneBtn: { backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 14, paddingHorizontal: 48 },
    doneBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});

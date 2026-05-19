import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface EditProfileScreenProps {
    onBack: () => void;
}

export default function EditProfileScreen({ onBack }: EditProfileScreenProps) {
    const [fullName, setFullName] = useState('Reynolds Kojo');
    const [email, setEmail] = useState('reynolds.kojo@gmail.com');
    const [dob, setDob] = useState('12 / 04 / 1995');

    const initials = fullName.split(' ').map(w => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);

    const handleSave = () => {
        Alert.alert('Profile Updated', 'Your profile has been updated successfully.', [
            { text: 'OK', onPress: onBack },
        ]);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={handleSave} activeOpacity={0.7}>
                    <Text style={styles.saveLink}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarOuter}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarInitials}>{initials}</Text>
                        </View>
                        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.8}>
                            <Ionicons name="camera" size={14} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.avatarHint}>Tap to change photo</Text>
                </View>

                {/* Form fields */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.textLight}
                        />
                    </View>
                    <View style={styles.fieldDivider} />
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Phone Number</Text>
                        <View style={styles.phoneRow}>
                            <View style={styles.phoneChip}>
                                <Text>🇬🇭</Text>
                                <Text style={styles.phoneCode}>+233</Text>
                            </View>
                            <Text style={styles.phoneValue}>055 482 4425</Text>
                            <TouchableOpacity activeOpacity={0.7}>
                                <Text style={styles.changeLink}>Change</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.fieldDivider} />
                    <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.fieldDivider} />
                    <View style={[styles.field, { borderBottomWidth: 0 }]}>
                        <Text style={styles.fieldLabel}>Date of Birth</Text>
                        <TextInput
                            style={styles.input}
                            value={dob}
                            onChangeText={setDob}
                            placeholder="DD / MM / YYYY"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="numbers-and-punctuation"
                        />
                    </View>
                </View>

                {/* Verified status */}
                <View style={[styles.verifiedRow, SHADOWS.sm]}>
                    <Ionicons name="shield-checkmark" size={18} color={COLORS.success} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.verifiedTitle}>Verified Account</Text>
                        <Text style={styles.verifiedSub}>Your identity has been verified by Meejo</Text>
                    </View>
                    <Text style={styles.verifiedActive}>Active</Text>
                </View>

                {/* Save button */}
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
                    <Text style={styles.saveBtnText}>Save Changes</Text>
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
    saveLink: { fontSize: 15, fontWeight: '700', color: COLORS.primary, paddingHorizontal: 10 },

    content: { padding: 16, paddingBottom: 40 },

    // Avatar
    avatarSection: { alignItems: 'center', paddingVertical: 24 },
    avatarOuter: { position: 'relative', marginBottom: 8 },
    avatar: {
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarInitials: { fontSize: 28, fontWeight: '800', color: COLORS.white },
    cameraBtn: {
        position: 'absolute', bottom: 0, right: 0,
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: COLORS.textDark,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#F7F7F7',
    },
    avatarHint: { fontSize: 12, color: COLORS.textGrey },

    // Form
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
    field: { paddingHorizontal: 18, paddingVertical: 14 },
    fieldLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textGrey, marginBottom: 6 },
    input: { fontSize: 15, fontWeight: '600', color: COLORS.textDark, padding: 0 },
    fieldDivider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 18 },
    phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    phoneChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#F7F7F7', paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 8,
    },
    phoneCode: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
    phoneValue: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    changeLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

    // Verified
    verifiedRow: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        backgroundColor: COLORS.white, borderRadius: 18,
        padding: 16, marginBottom: 20,
    },
    verifiedTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
    verifiedSub: { fontSize: 12, color: COLORS.textGrey, marginTop: 1 },
    verifiedActive: { fontSize: 12, fontWeight: '700', color: COLORS.success },

    // Save btn
    saveBtn: {
        backgroundColor: COLORS.textDark, borderRadius: 30,
        paddingVertical: 16, alignItems: 'center',
    },
    saveBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});

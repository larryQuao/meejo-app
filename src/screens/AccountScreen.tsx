import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface AccountScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

function Row({ icon, label, sublabel, onPress }: { icon: string; label: string; sublabel?: string; onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.55}>
            <Ionicons name={icon as any} size={20} color={COLORS.textDark} style={styles.rowIcon} />
            <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>{label}</Text>
                {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
        </TouchableOpacity>
    );
}

export default function AccountScreen({ onBack, onNavigate }: AccountScreenProps) {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Account</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, SHADOWS.sm]}>
                    <Row icon="person-outline" label="Edit Profile" sublabel="Update your name & photo" onPress={() => onNavigate('editProfile')} />
                    <View style={styles.divider} />
                    <Row icon="phone-portrait-outline" label="My Numbers" sublabel="Manage saved phone numbers" onPress={() => onNavigate('myNumbers')} />
                    <View style={styles.divider} />
                    <Row icon="people-outline" label="Saved Beneficiaries" sublabel="Mom, Work, +4 more" onPress={() => onNavigate('savedBeneficiaries')} />
                    <View style={styles.divider} />
                    <Row icon="card-outline" label="Saved Cards" sublabel="Visa *4242, Mastercard *8888" onPress={() => onNavigate('savedCards')} />
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
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden' },

    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
    rowIcon: { marginRight: 16, width: 22 },
    rowContent: { flex: 1 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    rowSublabel: { fontSize: 12, color: COLORS.textGrey, marginTop: 2 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },
});

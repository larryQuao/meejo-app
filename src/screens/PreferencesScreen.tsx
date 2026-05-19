import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface PreferencesScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

export default function PreferencesScreen({ onBack, onNavigate }: PreferencesScreenProps) {
    const [pushNotifs, setPushNotifs] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(true);
    const [emailReceipts, setEmailReceipts] = useState(false);
    const [promoOffers, setPromoOffers] = useState(true);
    const [language, setLanguage] = useState('English');

    const handleLanguage = () => {
        Alert.alert('Language', 'Choose your preferred language', [
            { text: 'English', onPress: () => setLanguage('English') },
            { text: 'Twi', onPress: () => setLanguage('Twi') },
            { text: 'Ga', onPress: () => setLanguage('Ga') },
            { text: 'Ewe', onPress: () => setLanguage('Ewe') },
            { text: 'Cancel', style: 'cancel' },
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Preferences</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionLabel}>Notifications</Text>
                <View style={[styles.card, SHADOWS.sm]}>
                    <View style={styles.row}>
                        <Ionicons name="notifications-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Push Notifications</Text>
                        <Switch value={pushNotifs} onValueChange={setPushNotifs} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.white} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Ionicons name="chatbubble-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>SMS Alerts</Text>
                        <Switch value={smsAlerts} onValueChange={setSmsAlerts} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.white} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Ionicons name="mail-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Email Receipts</Text>
                        <Switch value={emailReceipts} onValueChange={setEmailReceipts} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.white} />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <Ionicons name="pricetag-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Promo & Offers</Text>
                        <Switch value={promoOffers} onValueChange={setPromoOffers} trackColor={{ false: COLORS.border, true: COLORS.primary }} thumbColor={COLORS.white} />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.row} onPress={() => onNavigate('notifications')} activeOpacity={0.55}>
                        <Ionicons name="notifications-circle-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Notification Centre</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionLabel}>App Settings</Text>
                <View style={[styles.card, SHADOWS.sm]}>
                    <TouchableOpacity style={styles.row} onPress={handleLanguage} activeOpacity={0.55}>
                        <Ionicons name="language-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Language</Text>
                        <Text style={styles.valueText}>{language}</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.row} onPress={() => onNavigate('txHistory')} activeOpacity={0.55}>
                        <Ionicons name="receipt-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                        <Text style={styles.rowLabel}>Transaction History</Text>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                    </TouchableOpacity>
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
    sectionLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, marginTop: 4, paddingHorizontal: 2,
    },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 20 },

    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 16 },
    rowIcon: { marginRight: 16, width: 22 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },
    valueText: { fontSize: 13, fontWeight: '600', color: COLORS.textGrey, marginRight: 8 },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface TermsPrivacyScreenProps { onBack: () => void; }

type Tab = 'terms' | 'privacy';

const TERMS_SECTIONS = [
    {
        title: '1. Acceptance of Terms',
        body: 'By downloading, installing, or using the Meejo application, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app. Meejo reserves the right to update these terms at any time with notice to users.',
    },
    {
        title: '2. Eligibility',
        body: 'You must be at least 18 years old and a resident of Ghana to use Meejo. By using the app, you represent that you meet these requirements and that all information you provide is accurate and complete.',
    },
    {
        title: '3. Services',
        body: 'Meejo provides airtime and data exchange services between MTN, Telecel, and AT networks. Exchange rates, fees, and availability may change without prior notice. We do not guarantee continuous, uninterrupted access to our services.',
    },
    {
        title: '4. User Responsibilities',
        body: 'You are solely responsible for all activity on your account. You must keep your PIN and login credentials confidential. You must not use Meejo for fraudulent transactions, money laundering, or any illegal purposes.',
    },
    {
        title: '5. Fees & Charges',
        body: 'Meejo charges service fees of 2–5% per transaction as displayed before confirmation. We reserve the right to modify fees with 14 days\' notice. All fees are non-refundable unless a transaction error is on our end.',
    },
    {
        title: '6. Dispute Resolution',
        body: 'Any disputes arising from the use of Meejo shall first be addressed through our support team. Unresolved disputes will be subject to the jurisdiction of Ghanaian courts and governed by the laws of Ghana.',
    },
    {
        title: '7. Limitation of Liability',
        body: 'Meejo shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including loss of data, revenue, or profits, even if we have been advised of the possibility of such damages.',
    },
    {
        title: '8. Termination',
        body: 'Meejo may suspend or terminate your account at any time for violation of these terms, suspicious activity, or at our discretion. You may close your account at any time by contacting support.',
    },
];

const PRIVACY_SECTIONS = [
    {
        title: '1. Information We Collect',
        body: 'We collect information you provide directly, including your name, phone number, date of birth, and identity documents. We also collect transaction data, device information, and usage analytics to improve our services.',
    },
    {
        title: '2. How We Use Your Information',
        body: 'Your information is used to provide and improve our services, process transactions, verify your identity, send transaction notifications, comply with legal obligations, and personalise your experience.',
    },
    {
        title: '3. Data Sharing',
        body: 'We do not sell your personal data. We may share data with telecom partners (MTN, Telecel, AT) to process transactions, with payment processors for billing, and with regulatory authorities as required by Ghanaian law.',
    },
    {
        title: '4. Data Security',
        body: 'We use 256-bit AES encryption for all stored data and TLS 1.3 for data in transit. We are PCI-DSS compliant. Despite these measures, no system is 100% secure, and we cannot guarantee absolute security.',
    },
    {
        title: '5. Your Rights',
        body: 'You have the right to access, correct, or delete your personal data. You may request a copy of your data, object to processing, or withdraw consent at any time by contacting our Data Protection Officer at privacy@meejo.com.gh.',
    },
    {
        title: '6. Cookies & Analytics',
        body: 'We use anonymised analytics to understand app usage patterns. We do not use third-party advertising trackers. You can opt out of analytics in the app settings under Preferences.',
    },
    {
        title: '7. Data Retention',
        body: 'We retain your account data for as long as your account is active and for 7 years after closure as required by Ghanaian financial regulations. Transaction records are retained for a minimum of 5 years.',
    },
    {
        title: '8. Contact Us',
        body: 'For privacy concerns, contact our Data Protection Officer at privacy@meejo.com.gh or write to Meejo Technologies Ltd, Accra Digital Centre, Airport City, Accra, Ghana.',
    },
];

export default function TermsPrivacyScreen({ onBack }: TermsPrivacyScreenProps) {
    const [tab, setTab] = useState<Tab>('terms');
    const sections = tab === 'terms' ? TERMS_SECTIONS : PRIVACY_SECTIONS;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Legal</Text>
                <View style={{ width: 38 }} />
            </View>

            {/* Tab switcher */}
            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, tab === 'terms' && styles.tabActive]}
                    onPress={() => setTab('terms')}
                    activeOpacity={0.75}
                >
                    <Text style={[styles.tabText, tab === 'terms' && styles.tabTextActive]}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, tab === 'privacy' && styles.tabActive]}
                    onPress={() => setTab('privacy')}
                    activeOpacity={0.75}
                >
                    <Text style={[styles.tabText, tab === 'privacy' && styles.tabTextActive]}>Privacy Policy</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Last updated */}
                <Text style={styles.lastUpdated}>Last updated: January 2025</Text>

                {sections.map((section, i) => (
                    <View key={i} style={[styles.card, SHADOWS.sm]}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionBody}>{section.body}</Text>
                    </View>
                ))}

                {/* Footer */}
                <View style={styles.footer}>
                    <Ionicons name="shield-checkmark-outline" size={16} color={COLORS.textLight} />
                    <Text style={styles.footerText}>
                        Meejo Technologies Ltd · Accra, Ghana · Regulated by Bank of Ghana
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

    tabBar: {
        flexDirection: 'row', backgroundColor: COLORS.white,
        paddingHorizontal: 16, paddingBottom: 0,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    tab: {
        flex: 1, paddingVertical: 13, alignItems: 'center',
        borderBottomWidth: 2, borderBottomColor: 'transparent',
    },
    tabActive: { borderBottomColor: COLORS.textDark },
    tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textGrey },
    tabTextActive: { color: COLORS.textDark, fontWeight: '700' },

    content: { padding: 16, paddingBottom: 40 },
    lastUpdated: { fontSize: 12, color: COLORS.textLight, marginBottom: 12, paddingHorizontal: 2 },

    card: {
        backgroundColor: COLORS.white, borderRadius: 18,
        padding: 18, marginBottom: 10,
    },
    sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
    sectionBody: { fontSize: 13, color: COLORS.textGrey, lineHeight: 21 },

    footer: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        justifyContent: 'center', paddingTop: 8,
    },
    footerText: { fontSize: 11, color: COLORS.textLight, textAlign: 'center', lineHeight: 17 },
});

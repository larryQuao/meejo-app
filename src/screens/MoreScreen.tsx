import React from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import AdBanner from '../components/AdBanner';
import { useTier } from '../context/TierContext';

interface MoreScreenProps {
    onNavigate?: (screen: string) => void;
}

// ─── Single row item ──────────────────────────────────────────────────────────
function Row({
    icon, label, onPress, danger = false,
}: {
    icon: string; label: string; onPress: () => void; danger?: boolean;
}) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.55}>
            <Ionicons name={icon as any} size={20} color={danger ? COLORS.danger : COLORS.textDark} style={styles.rowIcon} />
            <Text style={[styles.rowLabel, danger && { color: COLORS.danger }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
        </TouchableOpacity>
    );
}

function Divider() {
    return <View style={styles.divider} />;
}

// ─── MoreScreen ───────────────────────────────────────────────────────────────
export default function MoreScreen({ onNavigate }: MoreScreenProps) {
    const { config } = useTier();

    const handleLogout = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign Out', style: 'destructive', onPress: () => {} },
            ]
        );
    };

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            {/* ── Profile ── */}
            <View style={styles.profileWrap}>
                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitials}>RK</Text>
                    <View style={styles.avatarBadge}>
                        <Ionicons name="checkmark" size={9} color={COLORS.white} />
                    </View>
                </View>
                <Text style={styles.profileName}>Reynolds Kojo</Text>
                <Text style={styles.profilePhone}>055 482 4425</Text>
                <TouchableOpacity
                    style={[styles.tierPill, { backgroundColor: config.bgColor }]}
                    onPress={() => onNavigate?.('subscription')}
                    activeOpacity={0.75}
                >
                    <Ionicons name="diamond-outline" size={11} color={config.color} />
                    <Text style={[styles.tierPillText, { color: config.color }]}>{config.name} Plan</Text>
                    {config.id !== 'premium' && (
                        <Text style={[styles.tierPillUpgrade, { color: config.color }]}>· Upgrade</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Invite Friends Banner ── */}
            <TouchableOpacity activeOpacity={0.85} style={styles.inviteWrap}>
                <LinearGradient
                    colors={['#2A65F8', '#7C3AED', '#F97316']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.inviteBanner}
                >
                    <View style={styles.inviteDec1} />
                    <View style={styles.inviteDec2} />
                    <View style={styles.inviteLeft}>
                        <View style={[styles.inviteIconBox]}>
                            <Ionicons name="person-add" size={18} color={COLORS.white} />
                        </View>
                        <Text style={styles.inviteLabel}>Invite friends</Text>
                    </View>
                    {/* Decorative emoji stand-in blobs */}
                    <View style={styles.blobRow}>
                        <View style={[styles.blob, { backgroundColor: 'rgba(255,200,80,0.85)', width: 40, height: 40, borderRadius: 20, bottom: 0 }]} />
                        <View style={[styles.blob, { backgroundColor: 'rgba(240,90,160,0.9)', width: 32, height: 32, borderRadius: 16, bottom: 8, marginLeft: -8 }]} />
                        <View style={[styles.blob, { backgroundColor: 'rgba(130,80,200,0.85)', width: 24, height: 24, borderRadius: 12, bottom: 0, marginLeft: -6 }]} />
                    </View>
                </LinearGradient>
            </TouchableOpacity>

            {/* ── Account ── */}
            <View style={[styles.card, SHADOWS.sm]}>
                <Row icon="diamond-outline" label="Subscription" onPress={() => onNavigate?.('subscription')} />
                <Divider />
                <Row icon="person-outline" label="Edit Profile" onPress={() => onNavigate?.('editProfile')} />
                <Divider />
                <Row icon="phone-portrait-outline" label="My Numbers" onPress={() => onNavigate?.('myNumbers')} />
                <Divider />
                <Row icon="people-outline" label="Saved Beneficiaries" onPress={() => onNavigate?.('savedBeneficiaries')} />
                <Divider />
                <Row icon="card-outline" label="Saved Cards" onPress={() => onNavigate?.('savedCards')} />
            </View>

            {/* ── Security ── */}
            <View style={[styles.card, SHADOWS.sm]}>
                <Row icon="lock-closed-outline" label="Change PIN" onPress={() => onNavigate?.('changePin')} />
                <Divider />
                <Row icon="finger-print-outline" label="Biometric Login" onPress={() => onNavigate?.('security')} />
                <Divider />
                <Row icon="shield-outline" label="Security Settings" onPress={() => onNavigate?.('security')} />
            </View>

            {/* ── Preferences ── */}
            <View style={[styles.card, SHADOWS.sm]}>
                <Row icon="notifications-outline" label="Manage Notifications" onPress={() => onNavigate?.('preferences')} />
                <Divider />
                <Row icon="receipt-outline" label="Transaction History" onPress={() => onNavigate?.('txHistory')} />
                <Divider />
                <Row icon="language-outline" label="Language" onPress={() => onNavigate?.('preferences')} />
            </View>

            {/* ── Ads ── */}
            <View style={styles.adSection}>
                <AdBanner variant="at" />
                <View style={{ height: 10 }} />
                <AdBanner variant="partner" />
            </View>

            {/* ── Support ── */}
            <View style={[styles.card, SHADOWS.sm]}>
                <Row icon="help-circle-outline" label="FAQ" onPress={() => onNavigate?.('faq')} />
                <Divider />
                <Row icon="chatbubble-ellipses-outline" label="Chat Support" onPress={() => onNavigate?.('chatSupport')} />
                <Divider />
                <Row icon="star-outline" label="Rate the App" onPress={() => onNavigate?.('rateApp')} />
                <Divider />
                <Row icon="document-text-outline" label="Terms & Privacy" onPress={() => onNavigate?.('termsPrivacy')} />
                <Divider />
                <Row icon="bug-outline" label="Report a Bug" onPress={() => onNavigate?.('reportBug')} />
            </View>

            {/* ── Sign Out ── */}
            <View style={[styles.card, SHADOWS.sm]}>
                <Row icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
            </View>

            <Text style={styles.version}>Meejo v1.0.0 · Made with ♥ in Ghana</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    content: { paddingBottom: 120 },

    // ── Profile
    profileWrap: { alignItems: 'center', paddingTop: 24, paddingBottom: 28 },
    avatarCircle: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: COLORS.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 12, position: 'relative',
    },
    avatarInitials: { fontSize: 26, fontWeight: '800', color: COLORS.white },
    avatarBadge: {
        position: 'absolute', bottom: 2, right: 2,
        width: 18, height: 18, borderRadius: 9,
        backgroundColor: COLORS.success,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#F7F7F7',
    },
    profileName: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
    profilePhone: { fontSize: 14, color: COLORS.textGrey, fontWeight: '500', marginBottom: 10 },
    tierPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    },
    tierPillText: { fontSize: 12, fontWeight: '700' },
    tierPillUpgrade: { fontSize: 12, fontWeight: '600', opacity: 0.7 },

    // ── Invite Banner
    inviteWrap: { marginHorizontal: 16, marginBottom: 16 },
    inviteBanner: {
        borderRadius: 18, padding: 18,
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', overflow: 'hidden',
        minHeight: 72,
    },
    inviteDec1: {
        position: 'absolute', top: -30, right: 80,
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    inviteDec2: {
        position: 'absolute', bottom: -20, left: -20,
        width: 80, height: 80, borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    inviteLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    inviteIconBox: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
    },
    inviteLabel: { fontSize: 16, fontWeight: '700', color: COLORS.white },
    blobRow: { flexDirection: 'row', alignItems: 'flex-end', marginRight: 4 },
    blob: { position: 'relative' },

    // ── Cards
    card: {
        backgroundColor: COLORS.white, borderRadius: 18,
        marginHorizontal: 16, marginBottom: 12, overflow: 'hidden',
    },

    // ── Rows
    row: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 18, paddingVertical: 16,
    },
    rowIcon: { marginRight: 16, width: 22 },
    rowLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },

    adSection: { paddingHorizontal: 16, marginBottom: 4 },
    version: {
        textAlign: 'center', fontSize: 12, color: COLORS.textLight,
        marginTop: 8, marginBottom: 8, fontWeight: '500',
    },
});

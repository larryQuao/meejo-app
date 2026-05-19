import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView, Share,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import type { Transaction } from './TransactionHistoryScreen';

interface TransactionDetailScreenProps {
    transaction: Transaction;
    onBack: () => void;
}

const STATUS_CONFIG: Record<Transaction['status'], { label: string; color: string; bg: string; icon: string }> = {
    completed: { label: 'Completed', color: COLORS.success, bg: COLORS.successLight, icon: 'checkmark-circle' },
    pending: { label: 'Pending', color: COLORS.warning, bg: COLORS.warningLight, icon: 'time' },
    failed: { label: 'Failed', color: COLORS.danger, bg: COLORS.dangerLight, icon: 'close-circle' },
};

const NETWORK_COLORS: Record<string, { bg: string; text: string }> = {
    MTN: { bg: '#FEF3C7', text: '#D97706' },
    Telecel: { bg: '#FEE2E2', text: '#DC2626' },
    AT: { bg: '#DBEAFE', text: '#1D4ED8' },
};

function Row({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
        </View>
    );
}

export default function TransactionDetailScreen({ transaction: tx, onBack }: TransactionDetailScreenProps) {
    const statusCfg = STATUS_CONFIG[tx.status];

    const formattedDate = new Date(tx.date).toLocaleDateString('en-GH', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    const formattedTime = new Date(tx.date).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });

    const handleShare = async () => {
        try {
            await Share.share({ message: `Meejo Transaction Receipt\nRef: ${tx.reference}\n${tx.title} - ${tx.amountLabel}\nStatus: ${statusCfg.label}` });
        } catch {}
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Receipt</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.7}>
                    <Ionicons name="share-outline" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Status hero */}
                <View style={[styles.heroCard, SHADOWS.sm]}>
                    <View style={[styles.statusCircle, { backgroundColor: statusCfg.bg }]}>
                        <Ionicons name={statusCfg.icon as any} size={36} color={statusCfg.color} />
                    </View>
                    <Text style={styles.heroAmount}>{tx.amountLabel}</Text>
                    <Text style={styles.heroTitle}>{tx.title}</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusCfg.bg }]}>
                        <Text style={[styles.statusPillText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                    </View>
                </View>

                {/* Main details */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <Row label="Date" value={formattedDate} />
                    <View style={styles.divider} />
                    <Row label="Time" value={formattedTime} />
                    <View style={styles.divider} />
                    <Row label="Reference" value={tx.reference} valueColor={COLORS.primary} />
                </View>

                {/* Transaction details */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <Text style={styles.sectionLabel}>Transaction Details</Text>

                    {tx.fromNetwork && tx.toNetwork && (
                        <View style={styles.networkRow}>
                            <View style={[styles.netPill, { backgroundColor: NETWORK_COLORS[tx.fromNetwork]?.bg ?? COLORS.primaryLight }]}>
                                <Text style={[styles.netPillText, { color: NETWORK_COLORS[tx.fromNetwork]?.text ?? COLORS.primary }]}>{tx.fromNetwork}</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={14} color={COLORS.textGrey} />
                            <View style={[styles.netPill, { backgroundColor: NETWORK_COLORS[tx.toNetwork]?.bg ?? COLORS.primaryLight }]}>
                                <Text style={[styles.netPillText, { color: NETWORK_COLORS[tx.toNetwork]?.text ?? COLORS.primary }]}>{tx.toNetwork}</Text>
                            </View>
                        </View>
                    )}

                    {tx.recipient && <><View style={styles.divider} /><Row label="Recipient" value={tx.recipient} /></>}
                    {tx.paymentMethod && <><View style={styles.divider} /><Row label="Payment Method" value={tx.paymentMethod} /></>}
                    <View style={styles.divider} />
                    <Row label="Type" value={tx.type === 'exchange' ? 'Exchange' : 'Purchase'} />
                </View>

                {/* Status notice */}
                {tx.status !== 'completed' && (
                    <View style={[styles.notice, { backgroundColor: statusCfg.bg }]}>
                        <Ionicons name={statusCfg.icon as any} size={16} color={statusCfg.color} />
                        <Text style={[styles.noticeText, { color: statusCfg.color }]}>
                            {tx.status === 'failed'
                                ? 'This transaction could not be processed. No charges were made.'
                                : 'This transaction is being processed. It may take up to 5 minutes.'}
                        </Text>
                    </View>
                )}

                {/* Download receipt */}
                <TouchableOpacity style={[styles.downloadBtn, SHADOWS.sm]} onPress={handleShare} activeOpacity={0.75}>
                    <Ionicons name="download-outline" size={17} color={COLORS.textDark} />
                    <Text style={styles.downloadBtnText}>Download Receipt</Text>
                </TouchableOpacity>

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
    shareBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },

    content: { padding: 16, paddingBottom: 40 },

    heroCard: {
        backgroundColor: COLORS.white, borderRadius: 18,
        alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20,
        marginBottom: 12,
    },
    statusCircle: {
        width: 72, height: 72, borderRadius: 36,
        alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    heroAmount: { fontSize: 30, fontWeight: '900', color: COLORS.textDark, letterSpacing: -0.5, marginBottom: 4 },
    heroTitle: { fontSize: 14, color: COLORS.textGrey, marginBottom: 12 },
    statusPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
    statusPillText: { fontSize: 13, fontWeight: '700' },

    card: { backgroundColor: COLORS.white, borderRadius: 18, padding: 18, marginBottom: 12 },
    sectionLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 14,
    },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailLabel: { fontSize: 14, color: COLORS.textGrey },
    detailValue: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, maxWidth: '60%', textAlign: 'right' },

    networkRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    netPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
    netPillText: { fontSize: 12, fontWeight: '800' },

    notice: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        borderRadius: 14, padding: 14, marginBottom: 12,
    },
    noticeText: { flex: 1, fontSize: 13, fontWeight: '500', lineHeight: 18 },

    downloadBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.white, borderRadius: 18, paddingVertical: 15,
    },
    downloadBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
});

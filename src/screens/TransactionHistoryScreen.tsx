import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import AdBanner from '../components/AdBanner';

export interface Transaction {
    id: string;
    type: 'exchange' | 'purchase' | 'receive';
    title: string;
    subtitle: string;
    amount: string;
    amountLabel: string;
    positive: boolean;
    status: 'completed' | 'pending' | 'failed';
    date: string;
    dateLabel: string;
    network?: string;
    reference: string;
    fromNetwork?: string;
    toNetwork?: string;
    recipient?: string;
    paymentMethod?: string;
}

interface TransactionHistoryScreenProps {
    onBack: () => void;
    onSelectTransaction: (tx: Transaction) => void;
}

const MOCK: Transaction[] = [
    { id: 'TX001', type: 'exchange', title: 'Data Exchange', subtitle: '20 GB · MTN → AT', amount: '2.0 GB', amountLabel: '+2.0 GB', positive: true, status: 'completed', date: new Date().toISOString(), dateLabel: 'Today', network: 'MTN', fromNetwork: 'MTN', toNetwork: 'AT', recipient: 'Self (+233 55 482 4425)', paymentMethod: 'Airtime', reference: 'MEJ-2025-001' },
    { id: 'TX002', type: 'exchange', title: 'Airtime to Data', subtitle: 'GHC 20.00 exchanged', amount: '290 MB', amountLabel: '+290 MB', positive: true, status: 'completed', date: new Date().toISOString(), dateLabel: 'Today', network: 'Telecel', fromNetwork: 'Telecel', toNetwork: 'Telecel', recipient: 'Self (+233 55 482 4425)', paymentMethod: 'Airtime', reference: 'MEJ-2025-002' },
    { id: 'TX003', type: 'purchase', title: 'Airtime Purchase', subtitle: 'MTN · Self', amount: 'GHC 20', amountLabel: '-GHC 20', positive: false, status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), dateLabel: 'Yesterday', network: 'MTN', recipient: 'Self (+233 55 482 4425)', paymentMethod: 'Visa *4242', reference: 'MEJ-2025-003' },
    { id: 'TX004', type: 'purchase', title: 'Data Bundle', subtitle: 'Monthly 10GB · AT', amount: 'GHC 50', amountLabel: '-GHC 50', positive: false, status: 'completed', date: new Date(Date.now() - 86400000).toISOString(), dateLabel: 'Yesterday', network: 'AT', recipient: 'Mom (+233 54 123 4567)', paymentMethod: 'MTN MoMo', reference: 'MEJ-2025-004' },
    { id: 'TX005', type: 'exchange', title: 'Airtime Exchange', subtitle: 'GHC 5 · MTN → Telecel', amount: 'GHC 4.50', amountLabel: '-GHC 5', positive: false, status: 'pending', date: new Date(Date.now() - 86400000 * 3).toISOString(), dateLabel: 'This Week', network: 'MTN', fromNetwork: 'MTN', toNetwork: 'Telecel', recipient: 'Work (+233 20 987 6543)', paymentMethod: 'Airtime', reference: 'MEJ-2025-005' },
    { id: 'TX006', type: 'purchase', title: 'Airtime Purchase', subtitle: 'Telecel · Self', amount: 'GHC 10', amountLabel: '-GHC 10', positive: false, status: 'failed', date: new Date(Date.now() - 86400000 * 5).toISOString(), dateLabel: 'This Week', network: 'Telecel', recipient: 'Self (+233 55 482 4425)', paymentMethod: 'Mastercard *8888', reference: 'MEJ-2025-006' },
];

const TX_ICONS: Record<string, string> = { exchange: 'swap-horizontal', purchase: 'wallet-outline', receive: 'arrow-down-circle-outline' };

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    completed: { color: COLORS.success, bg: COLORS.successLight },
    pending: { color: COLORS.warning, bg: COLORS.warningLight },
    failed: { color: COLORS.danger, bg: COLORS.dangerLight },
};

const FILTERS = ['All', 'Exchange', 'Purchase', 'Pending', 'Failed'];

export default function TransactionHistoryScreen({ onBack, onSelectTransaction }: TransactionHistoryScreenProps) {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const filtered = MOCK.filter(tx => {
        const matchSearch = !search || tx.title.toLowerCase().includes(search.toLowerCase()) || tx.subtitle.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || (filter === 'Exchange' && tx.type === 'exchange') || (filter === 'Purchase' && tx.type === 'purchase') || (filter === 'Pending' && tx.status === 'pending') || (filter === 'Failed' && tx.status === 'failed');
        return matchSearch && matchFilter;
    });

    const groups: { label: string; items: Transaction[] }[] = [];
    filtered.forEach(tx => {
        const g = groups.find(g => g.label === tx.dateLabel);
        if (g) g.items.push(tx); else groups.push({ label: tx.dateLabel, items: [tx] });
    });

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction History</Text>
                <View style={{ width: 38 }} />
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={17} color={COLORS.textGrey} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search transactions..."
                    placeholderTextColor={COLORS.textLight}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                        <Ionicons name="close-circle" size={17} color={COLORS.textGrey} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
                {FILTERS.map(f => (
                    <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)} activeOpacity={0.75}>
                        <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* List */}
            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {groups.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="receipt-outline" size={44} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No transactions found</Text>
                    </View>
                ) : (
                    groups.map((group, groupIdx) => (
                        <View key={group.label}>
                            <Text style={styles.groupLabel}>{group.label}</Text>
                            <View style={[styles.card, SHADOWS.sm]}>
                                {group.items.map((tx, i) => (
                                    <View key={tx.id}>
                                        {i > 0 && <View style={styles.divider} />}
                                        <TouchableOpacity style={styles.txRow} onPress={() => onSelectTransaction(tx)} activeOpacity={0.6}>
                                            <Ionicons name={TX_ICONS[tx.type] as any} size={20} color={COLORS.textDark} style={styles.txIcon} />
                                            <View style={styles.txMeta}>
                                                <Text style={styles.txTitle}>{tx.title}</Text>
                                                <Text style={styles.txSub}>{tx.subtitle}</Text>
                                            </View>
                                            <View style={styles.txRight}>
                                                <Text style={[styles.txAmount, { color: tx.positive ? COLORS.success : COLORS.textDark }]}>{tx.amountLabel}</Text>
                                                <View style={[styles.statusPill, { backgroundColor: STATUS_COLORS[tx.status].bg }]}>
                                                    <Text style={[styles.statusText, { color: STATUS_COLORS[tx.status].color }]}>{tx.status}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            {/* Ad after first group */}
                            {groupIdx === 0 && (
                                <View style={styles.adWrap}>
                                    <AdBanner variant="mtn" />
                                </View>
                            )}
                        </View>
                    ))
                )}
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

    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12,
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2,
        borderWidth: 1, borderColor: '#EBEBEB',
    },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.textDark },

    filterRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#EBEBEB' },
    filterChipActive: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
    filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textGrey },
    filterChipTextActive: { color: COLORS.white },

    listContent: { paddingHorizontal: 16, paddingBottom: 40 },
    groupLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, marginTop: 4, paddingHorizontal: 2,
    },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },

    txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
    txIcon: { marginRight: 14, width: 22 },
    txMeta: { flex: 1 },
    txTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
    txSub: { fontSize: 12, color: COLORS.textGrey },
    txRight: { alignItems: 'flex-end', gap: 4 },
    txAmount: { fontSize: 14, fontWeight: '700' },
    statusPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
    statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },

    adWrap: { marginBottom: 4 },
    empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
    emptyTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textGrey },
});

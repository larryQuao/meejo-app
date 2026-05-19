import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Modal, TextInput, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { useTier } from '../context/TierContext';

interface SavedNumber {
    id: string;
    label: string;
    number: string;
    network: 'MTN' | 'Telecel' | 'AT';
    isPrimary?: boolean;
}

interface MyNumbersScreenProps {
    onBack: () => void;
    onUpgrade?: () => void;
}

const NETWORK_COLORS: Record<string, { bg: string; text: string }> = {
    MTN: { bg: '#FEF3C7', text: '#D97706' },
    Telecel: { bg: '#FEE2E2', text: '#DC2626' },
    AT: { bg: '#DBEAFE', text: '#1D4ED8' },
};

const INITIAL_NUMBERS: SavedNumber[] = [
    { id: '1', label: 'My MTN', number: '055 482 4425', network: 'MTN', isPrimary: true },
];

export default function MyNumbersScreen({ onBack, onUpgrade }: MyNumbersScreenProps) {
    const { config } = useTier();
    const [numbers, setNumbers] = useState<SavedNumber[]>(INITIAL_NUMBERS);
    const [showModal, setShowModal] = useState(false);
    const [newLabel, setNewLabel] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState<'MTN' | 'Telecel' | 'AT'>('MTN');

    const atLimit = numbers.length >= config.maxNumbers;

    const handleOpenAdd = () => {
        if (atLimit) {
            Alert.alert(
                'Number Limit Reached',
                `Your ${config.name} plan allows up to ${config.maxNumbers} number${config.maxNumbers > 1 ? 's' : ''}. Upgrade your plan to add more.`,
                [
                    { text: 'Not Now', style: 'cancel' },
                    { text: 'View Plans', onPress: () => { onUpgrade?.(); } },
                ]
            );
            return;
        }
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        const num = numbers.find(n => n.id === id);
        if (num?.isPrimary) { Alert.alert('Cannot Delete', 'You cannot delete your primary number.'); return; }
        Alert.alert('Delete Number', `Remove "${num?.label}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => setNumbers(prev => prev.filter(n => n.id !== id)) },
        ]);
    };

    const handleSetPrimary = (id: string) => {
        setNumbers(prev => prev.map(n => ({ ...n, isPrimary: n.id === id })));
    };

    const handleAdd = () => {
        if (!newLabel.trim() || newNumber.length < 9) return;
        setNumbers(prev => [...prev, { id: Date.now().toString(), label: newLabel.trim(), number: newNumber.trim(), network: selectedNetwork }]);
        setNewLabel(''); setNewNumber(''); setSelectedNetwork('MTN');
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Numbers</Text>
                <TouchableOpacity style={styles.addIconBtn} onPress={handleOpenAdd} activeOpacity={0.7}>
                    <Ionicons name="add" size={22} color={atLimit ? COLORS.textLight : COLORS.textDark} />
                </TouchableOpacity>
            </View>

            {/* Tier usage bar */}
            <View style={styles.tierBar}>
                <View style={styles.tierBarLeft}>
                    <View style={[styles.tierBadge, { backgroundColor: config.bgColor }]}>
                        <Text style={[styles.tierBadgeText, { color: config.color }]}>{config.name}</Text>
                    </View>
                    <Text style={styles.tierSlotText}>
                        {numbers.length} / {config.maxNumbers} number{config.maxNumbers > 1 ? 's' : ''}
                    </Text>
                </View>
                {atLimit && (
                    <TouchableOpacity onPress={onUpgrade} activeOpacity={0.75}>
                        <Text style={styles.upgradeLink}>Upgrade</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, SHADOWS.sm]}>
                    {numbers.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && <View style={styles.divider} />}
                            <View style={styles.row}>
                                <Ionicons name="phone-portrait-outline" size={20} color={COLORS.textDark} style={styles.rowIcon} />
                                <View style={styles.rowContent}>
                                    <View style={styles.rowTop}>
                                        <Text style={styles.rowLabel}>{item.label}</Text>
                                        {item.isPrimary && <View style={styles.primaryBadge}><Text style={styles.primaryBadgeText}>Primary</Text></View>}
                                        <View style={[styles.networkPill, { backgroundColor: NETWORK_COLORS[item.network].bg }]}>
                                            <Text style={[styles.networkPillText, { color: NETWORK_COLORS[item.network].text }]}>{item.network}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.rowSub}>{item.number}</Text>
                                </View>
                                <View style={styles.rowActions}>
                                    {!item.isPrimary && (
                                        <TouchableOpacity onPress={() => handleSetPrimary(item.id)} activeOpacity={0.7} style={styles.actionBtn}>
                                            <Ionicons name="star-outline" size={16} color={COLORS.textGrey} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity onPress={() => handleDelete(item.id)} activeOpacity={0.7} style={styles.actionBtn}>
                                        <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={handleOpenAdd} activeOpacity={0.75}>
                    <Ionicons name="add" size={18} color={COLORS.textDark} />
                    <Text style={styles.addBtnText}>Add New Number</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Modal */}
            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)} />
                <View style={styles.sheet}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Add New Number</Text>

                    <Text style={styles.inputLabel}>Label</Text>
                    <TextInput style={styles.input} placeholder="e.g. My Spare SIM" placeholderTextColor={COLORS.textLight} value={newLabel} onChangeText={setNewLabel} />

                    <Text style={styles.inputLabel}>Phone Number</Text>
                    <View style={styles.phoneInputRow}>
                        <View style={styles.phoneChip}><Text>🇬🇭</Text><Text style={styles.phoneCode}>+233</Text></View>
                        <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="0XX XXX XXXX" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" value={newNumber} onChangeText={setNewNumber} />
                    </View>

                    <Text style={[styles.inputLabel, { marginTop: 16 }]}>Network</Text>
                    <View style={styles.networkChips}>
                        {(['MTN', 'Telecel', 'AT'] as const).map(net => (
                            <TouchableOpacity key={net} style={[styles.netChip, selectedNetwork === net && styles.netChipActive]} onPress={() => setSelectedNetwork(net)} activeOpacity={0.75}>
                                <Text style={[styles.netChipText, selectedNetwork === net && styles.netChipTextActive]}>{net}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={styles.sheetActions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)} activeOpacity={0.75}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.confirmBtn, (!newLabel.trim() || newNumber.length < 9) && styles.confirmBtnOff]}
                            onPress={handleAdd}
                            disabled={!newLabel.trim() || newNumber.length < 9}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmBtnText}>Add Number</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    addIconBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },

    tierBar: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.white, paddingHorizontal: 18, paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    tierBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    tierBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    tierBadgeText: { fontSize: 11, fontWeight: '800' },
    tierSlotText: { fontSize: 13, fontWeight: '500', color: COLORS.textGrey },
    upgradeLink: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

    content: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12 },

    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
    rowIcon: { marginRight: 16, width: 22 },
    rowContent: { flex: 1 },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    rowSub: { fontSize: 13, color: COLORS.textGrey },
    primaryBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    primaryBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
    networkPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
    networkPillText: { fontSize: 10, fontWeight: '700' },
    rowActions: { flexDirection: 'row', gap: 4 },
    actionBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },

    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.white, borderRadius: 18, paddingVertical: 15,
        ...SHADOWS.sm,
    },
    addBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },

    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' },
    sheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 20 },
    sheetTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark, marginBottom: 20 },
    inputLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textGrey, marginBottom: 8 },
    input: {
        fontSize: 15, color: COLORS.textDark, fontWeight: '500',
        backgroundColor: '#F7F7F7', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13,
        borderWidth: 1, borderColor: '#EBEBEB', marginBottom: 16,
    },
    phoneInputRow: { flexDirection: 'row', gap: 10, alignItems: 'center', marginBottom: 4 },
    phoneChip: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#F7F7F7', paddingHorizontal: 12, paddingVertical: 13,
        borderRadius: 12, borderWidth: 1, borderColor: '#EBEBEB',
    },
    phoneCode: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
    networkChips: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    netChip: {
        flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center',
        backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#EBEBEB',
    },
    netChipActive: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
    netChipText: { fontSize: 14, fontWeight: '700', color: COLORS.textGrey },
    netChipTextActive: { color: COLORS.white },
    sheetActions: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 30, backgroundColor: '#F0F0F0', alignItems: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textGrey },
    confirmBtn: { flex: 2, paddingVertical: 14, borderRadius: 30, backgroundColor: COLORS.textDark, alignItems: 'center' },
    confirmBtnOff: { opacity: 0.4 },
    confirmBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Modal, TextInput, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface Beneficiary {
    id: string;
    name: string;
    number: string;
    network: 'MTN' | 'Telecel' | 'AT';
    relationship: string;
    color: string;
}

interface SavedBeneficiariesScreenProps {
    onBack: () => void;
}

const NETWORK_COLORS: Record<string, { bg: string; text: string }> = {
    MTN: { bg: '#FEF3C7', text: '#D97706' },
    Telecel: { bg: '#FEE2E2', text: '#DC2626' },
    AT: { bg: '#DBEAFE', text: '#1D4ED8' },
};

const AVATAR_COLORS = ['#2A65F8', '#10B981', '#F59E0B', '#EF4444', '#7C3AED', '#06B6D4'];

const INITIAL: Beneficiary[] = [
    { id: '1', name: 'Ama Mensah', relationship: 'Mom', number: '024 456 7890', network: 'MTN', color: AVATAR_COLORS[0] },
    { id: '2', name: 'Kofi Asante', relationship: 'Work', number: '050 321 6543', network: 'Telecel', color: AVATAR_COLORS[1] },
    { id: '3', name: 'Kwame Boateng', relationship: 'Dad', number: '027 789 0123', network: 'AT', color: AVATAR_COLORS[2] },
    { id: '4', name: 'Abena Owusu', relationship: 'Sister', number: '055 234 5678', network: 'MTN', color: AVATAR_COLORS[3] },
    { id: '5', name: 'Yaw Darko', relationship: 'Friend', number: '059 654 3210', network: 'Telecel', color: AVATAR_COLORS[4] },
    { id: '6', name: 'Efua Sarpong', relationship: 'Barber', number: '026 987 6543', network: 'AT', color: AVATAR_COLORS[5] },
];

const getInitials = (name: string) => name.split(' ').map(w => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);

export default function SavedBeneficiariesScreen({ onBack }: SavedBeneficiariesScreenProps) {
    const [items, setItems] = useState<Beneficiary[]>(INITIAL);
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newRel, setNewRel] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState<'MTN' | 'Telecel' | 'AT'>('MTN');

    const handleDelete = (id: string) => {
        const b = items.find(x => x.id === id);
        Alert.alert('Remove Beneficiary', `Remove "${b?.name}"?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => setItems(prev => prev.filter(x => x.id !== id)) },
        ]);
    };

    const handleAdd = () => {
        if (!newName.trim() || newNumber.length < 9) return;
        setItems(prev => [...prev, {
            id: Date.now().toString(), name: newName.trim(), number: newNumber.trim(),
            network: selectedNetwork, relationship: newRel.trim() || 'Contact',
            color: AVATAR_COLORS[prev.length % AVATAR_COLORS.length],
        }]);
        setNewName(''); setNewNumber(''); setNewRel(''); setSelectedNetwork('MTN');
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Beneficiaries</Text>
                <TouchableOpacity style={styles.addIconBtn} onPress={() => setShowModal(true)} activeOpacity={0.7}>
                    <Ionicons name="add" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={[styles.card, SHADOWS.sm]}>
                    {items.map((item, index) => (
                        <View key={item.id}>
                            {index > 0 && <View style={styles.divider} />}
                            <View style={styles.row}>
                                <View style={[styles.avatarCircle, { backgroundColor: item.color }]}>
                                    <Text style={styles.avatarInitials}>{getInitials(item.name)}</Text>
                                </View>
                                <View style={styles.rowContent}>
                                    <View style={styles.rowTop}>
                                        <Text style={styles.rowLabel}>{item.name}</Text>
                                        <View style={styles.relBadge}><Text style={styles.relBadgeText}>{item.relationship}</Text></View>
                                    </View>
                                    <View style={styles.rowBottom}>
                                        <Text style={styles.rowSub}>{item.number}</Text>
                                        <View style={[styles.networkPill, { backgroundColor: NETWORK_COLORS[item.network].bg }]}>
                                            <Text style={[styles.networkPillText, { color: NETWORK_COLORS[item.network].text }]}>{item.network}</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => handleDelete(item.id)} activeOpacity={0.7} style={styles.deleteBtn}>
                                    <Ionicons name="trash-outline" size={16} color={COLORS.danger} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)} activeOpacity={0.75}>
                    <Ionicons name="person-add-outline" size={18} color={COLORS.textDark} />
                    <Text style={styles.addBtnText}>Add Beneficiary</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)} />
                <View style={styles.sheet}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Add Beneficiary</Text>

                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput style={styles.input} placeholder="e.g. Ama Boateng" placeholderTextColor={COLORS.textLight} value={newName} onChangeText={setNewName} />

                    <Text style={styles.inputLabel}>Relationship</Text>
                    <TextInput style={styles.input} placeholder="e.g. Mom, Friend, Work" placeholderTextColor={COLORS.textLight} value={newRel} onChangeText={setNewRel} />

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
                            style={[styles.confirmBtn, (!newName.trim() || newNumber.length < 9) && styles.confirmBtnOff]}
                            onPress={handleAdd} disabled={!newName.trim() || newNumber.length < 9} activeOpacity={0.8}
                        >
                            <Text style={styles.confirmBtnText}>Add</Text>
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

    content: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 12 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 70 },

    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14 },
    avatarCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
    avatarInitials: { fontSize: 14, fontWeight: '800', color: COLORS.white },
    rowContent: { flex: 1 },
    rowTop: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    relBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    relBadgeText: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
    rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    rowSub: { fontSize: 13, color: COLORS.textGrey },
    networkPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
    networkPillText: { fontSize: 10, fontWeight: '700' },
    deleteBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },

    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.white, borderRadius: 18, paddingVertical: 15, ...SHADOWS.sm,
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
    netChip: { flex: 1, paddingVertical: 11, borderRadius: 12, alignItems: 'center', backgroundColor: '#F7F7F7', borderWidth: 1, borderColor: '#EBEBEB' },
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

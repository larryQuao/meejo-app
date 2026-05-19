import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Modal, TextInput, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';

interface SavedCard { id: string; type: 'Visa' | 'Mastercard'; lastFour: string; holder: string; expiry: string; isDefault?: boolean; }
interface SavedCardsScreenProps { onBack: () => void; }

const CARD_GRADIENTS: Record<string, [string, string]> = {
    Visa: ['#1A45D8', '#2A65F8'],
    Mastercard: ['#1A1A2E', '#374151'],
};

const INITIAL: SavedCard[] = [
    { id: '1', type: 'Visa', lastFour: '4242', holder: 'REYNOLDS KOJO', expiry: '09/26', isDefault: true },
    { id: '2', type: 'Mastercard', lastFour: '8888', holder: 'REYNOLDS KOJO', expiry: '03/27' },
];

export default function SavedCardsScreen({ onBack }: SavedCardsScreenProps) {
    const [cards, setCards] = useState<SavedCard[]>(INITIAL);
    const [showModal, setShowModal] = useState(false);
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');

    const handleDelete = (id: string) => {
        const card = cards.find(c => c.id === id);
        if (card?.isDefault) { Alert.alert('Cannot Remove', 'Set another card as default first.'); return; }
        Alert.alert('Remove Card', `Remove ${card?.type} •••• ${card?.lastFour}?`, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Remove', style: 'destructive', onPress: () => setCards(prev => prev.filter(c => c.id !== id)) },
        ]);
    };

    const handleSetDefault = (id: string) => setCards(prev => prev.map(c => ({ ...c, isDefault: c.id === id })));

    const formatCardNumber = (t: string) => t.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');
    const formatExpiry = (t: string) => { const d = t.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };
    const detectedType = (): 'Visa' | 'Mastercard' => cardNumber.replace(/\s/g, '').startsWith('4') ? 'Visa' : 'Mastercard';

    const handleAdd = () => {
        const digits = cardNumber.replace(/\s/g, '');
        if (digits.length < 16 || !cardHolder.trim() || expiry.length < 5 || cvv.length < 3) return;
        setCards(prev => [...prev, { id: Date.now().toString(), type: detectedType(), lastFour: digits.slice(-4), holder: cardHolder.trim().toUpperCase(), expiry }]);
        setCardNumber(''); setCardHolder(''); setExpiry(''); setCvv('');
        setShowModal(false);
    };

    const canAdd = cardNumber.replace(/\s/g, '').length === 16 && cardHolder.trim().length > 0 && expiry.length === 5 && cvv.length >= 3;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Saved Cards</Text>
                <TouchableOpacity style={styles.addIconBtn} onPress={() => setShowModal(true)} activeOpacity={0.7}>
                    <Ionicons name="add" size={22} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {cards.map(card => (
                    <View key={card.id} style={[styles.cardWrap, SHADOWS.md]}>
                        <LinearGradient
                            colors={CARD_GRADIENTS[card.type] as [string, string]}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                            style={styles.cardFace}
                        >
                            <View style={styles.cardTop}>
                                <View style={styles.chip}><View style={styles.chipInner} /></View>
                                {card.isDefault && (
                                    <View style={styles.defaultBadge}>
                                        <Ionicons name="checkmark-circle" size={11} color="#10B981" />
                                        <Text style={styles.defaultText}>Default</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.cardNum}>•••• •••• •••• {card.lastFour}</Text>
                            <View style={styles.cardBottom}>
                                <View>
                                    <Text style={styles.cardLabelTiny}>Card Holder</Text>
                                    <Text style={styles.cardValueText}>{card.holder}</Text>
                                </View>
                                <View>
                                    <Text style={styles.cardLabelTiny}>Expires</Text>
                                    <Text style={styles.cardValueText}>{card.expiry}</Text>
                                </View>
                                {card.type === 'Visa'
                                    ? <Text style={styles.visaText}>VISA</Text>
                                    : <View style={styles.mcRow}>
                                        <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
                                        <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -12 }]} />
                                    </View>
                                }
                            </View>
                        </LinearGradient>

                        {/* Card actions */}
                        <View style={styles.cardActions}>
                            {!card.isDefault && (
                                <TouchableOpacity style={styles.cardActionBtn} onPress={() => handleSetDefault(card.id)} activeOpacity={0.7}>
                                    <Ionicons name="star-outline" size={15} color={COLORS.textGrey} />
                                    <Text style={styles.cardActionText}>Set Default</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={[styles.cardActionBtn, { marginLeft: 'auto' }]} onPress={() => handleDelete(card.id)} activeOpacity={0.7}>
                                <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
                                <Text style={[styles.cardActionText, { color: COLORS.danger }]}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}

                <TouchableOpacity style={[styles.addBtn, SHADOWS.sm]} onPress={() => setShowModal(true)} activeOpacity={0.75}>
                    <Ionicons name="add" size={18} color={COLORS.textDark} />
                    <Text style={styles.addBtnText}>Add New Card</Text>
                </TouchableOpacity>
            </ScrollView>

            <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
                <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setShowModal(false)} />
                <View style={styles.sheet}>
                    <View style={styles.sheetHandle} />
                    <Text style={styles.sheetTitle}>Add New Card</Text>

                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput style={styles.input} placeholder="0000 0000 0000 0000" placeholderTextColor={COLORS.textLight} value={cardNumber} onChangeText={t => setCardNumber(formatCardNumber(t))} keyboardType="number-pad" maxLength={19} />

                    <Text style={styles.inputLabel}>Card Holder Name</Text>
                    <TextInput style={styles.input} placeholder="As shown on card" placeholderTextColor={COLORS.textLight} value={cardHolder} onChangeText={setCardHolder} autoCapitalize="characters" />

                    <View style={styles.twoCol}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>Expiry</Text>
                            <TextInput style={styles.input} placeholder="MM/YY" placeholderTextColor={COLORS.textLight} value={expiry} onChangeText={t => setExpiry(formatExpiry(t))} keyboardType="number-pad" maxLength={5} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.inputLabel}>CVV</Text>
                            <TextInput style={styles.input} placeholder="•••" placeholderTextColor={COLORS.textLight} value={cvv} onChangeText={t => setCvv(t.replace(/\D/g, '').slice(0, 4))} keyboardType="number-pad" maxLength={4} secureTextEntry />
                        </View>
                    </View>

                    <View style={styles.sheetActions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)} activeOpacity={0.75}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.confirmBtn, !canAdd && styles.confirmBtnOff]} onPress={handleAdd} disabled={!canAdd} activeOpacity={0.8}>
                            <Text style={styles.confirmBtnText}>Add Card</Text>
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

    cardWrap: { marginBottom: 16, borderRadius: 20, overflow: 'hidden' },
    cardFace: { padding: 22, height: 186, justifyContent: 'space-between' },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    chip: { width: 34, height: 26, borderRadius: 5, backgroundColor: '#F59E0B', justifyContent: 'center', alignItems: 'center' },
    chipInner: { width: 20, height: 14, borderRadius: 3, backgroundColor: '#D97706', borderWidth: 1, borderColor: '#B45309' },
    defaultBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16,185,129,0.2)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
    defaultText: { fontSize: 11, fontWeight: '700', color: '#10B981' },
    cardNum: { fontSize: 19, fontWeight: '700', color: COLORS.white, letterSpacing: 3, textAlign: 'center' },
    cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
    cardLabelTiny: { fontSize: 9, color: 'rgba(255,255,255,0.6)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    cardValueText: { fontSize: 12, color: COLORS.white, fontWeight: '700', marginTop: 2 },
    visaText: { fontSize: 20, fontWeight: '900', color: COLORS.white, fontStyle: 'italic' },
    mcRow: { flexDirection: 'row', alignItems: 'center' },
    mcCircle: { width: 26, height: 26, borderRadius: 13, opacity: 0.9 },

    cardActions: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.white, paddingHorizontal: 16, paddingVertical: 12,
    },
    cardActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    cardActionText: { fontSize: 12, fontWeight: '700', color: COLORS.textGrey },

    addBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        backgroundColor: COLORS.white, borderRadius: 18, paddingVertical: 15,
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
    twoCol: { flexDirection: 'row', gap: 12 },
    sheetActions: { flexDirection: 'row', gap: 12, marginTop: 4 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 30, backgroundColor: '#F0F0F0', alignItems: 'center' },
    cancelBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textGrey },
    confirmBtn: { flex: 2, paddingVertical: 14, borderRadius: 30, backgroundColor: COLORS.textDark, alignItems: 'center' },
    confirmBtnOff: { opacity: 0.4 },
    confirmBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});

import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface FaqScreenProps { onBack: () => void; }

interface FaqItem {
    id: string;
    category: string;
    question: string;
    answer: string;
}

const FAQS: FaqItem[] = [
    // Exchanges
    { id: '1', category: 'Exchanges', question: 'How do I exchange airtime to data?', answer: 'Go to the Exchange tab, select "Airtime → Data", choose your network, enter the amount, select a recipient, and confirm with your PIN. The data is credited within 30 seconds.' },
    { id: '2', category: 'Exchanges', question: 'What networks are supported?', answer: 'Meejo currently supports MTN, Telecel (formerly Vodafone), and AT (AirtelTigo) for both airtime and data exchanges across all networks.' },
    { id: '3', category: 'Exchanges', question: 'Is there a minimum exchange amount?', answer: 'Yes. The minimum exchange is GHC 1 for airtime-to-airtime and GHC 5 for airtime-to-data exchanges. Maximum per transaction is GHC 500.' },
    { id: '4', category: 'Exchanges', question: 'Why did my exchange fail?', answer: 'Exchanges can fail due to insufficient airtime balance, network downtime, or exceeding daily limits. Check your balance and try again. If the issue persists, contact support.' },
    // Account
    { id: '5', category: 'Account', question: 'How do I verify my account?', answer: 'After registration, upload a valid Ghana Card or Passport in the verification section. Verification is usually completed within 24 hours.' },
    { id: '6', category: 'Account', question: 'Can I have multiple phone numbers?', answer: 'Yes! You can save up to 10 phone numbers across all networks in My Numbers. These can be used as sender or recipient in any transaction.' },
    { id: '7', category: 'Account', question: 'How do I reset my PIN?', answer: 'Go to More → Security → Change PIN. You\'ll need your current PIN or OTP verification via your registered phone number to set a new one.' },
    // Payments
    { id: '8', category: 'Payments', question: 'What payment methods are accepted?', answer: 'You can pay using saved airtime balance, MTN MoMo, Telecel Cash, AT Money, Visa or Mastercard debit/credit cards.' },
    { id: '9', category: 'Payments', question: 'Are there transaction fees?', answer: 'Meejo charges a small service fee of 2–5% depending on the exchange type. The fee is shown before you confirm any transaction.' },
    { id: '10', category: 'Payments', question: 'How do I get a receipt?', answer: 'Every transaction generates a receipt automatically. Go to Transaction History, tap any transaction, and tap "Download Receipt" to save or share it.' },
    // Security
    { id: '11', category: 'Security', question: 'Is my data safe with Meejo?', answer: 'Yes. Meejo uses industry-standard 256-bit AES encryption for all data. We are PCI-DSS compliant and never store full card numbers on our servers.' },
    { id: '12', category: 'Security', question: 'What should I do if I suspect fraud?', answer: 'Immediately change your PIN and contact our support team via Chat Support or call 0800-MEEJO (toll-free). We can freeze your account within minutes.' },
];

const CATEGORIES = ['All', 'Exchanges', 'Account', 'Payments', 'Security'];

function AccordionItem({ item }: { item: FaqItem }) {
    const [open, setOpen] = useState(false);
    return (
        <View>
            <TouchableOpacity style={styles.faqRow} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.textGrey} />
            </TouchableOpacity>
            {open && <Text style={styles.faqAnswer}>{item.answer}</Text>}
        </View>
    );
}

export default function FaqScreen({ onBack }: FaqScreenProps) {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');

    const filtered = FAQS.filter(f => {
        const matchCat = category === 'All' || f.category === category;
        const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
        return matchCat && matchSearch;
    });

    const grouped = CATEGORIES.filter(c => c !== 'All').reduce<Record<string, FaqItem[]>>((acc, cat) => {
        const items = filtered.filter(f => f.category === cat);
        if (items.length) acc[cat] = items;
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
                <View style={{ width: 38 }} />
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Ionicons name="search-outline" size={17} color={COLORS.textGrey} />
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search questions..."
                    placeholderTextColor={COLORS.textLight}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')}>
                        <Ionicons name="close-circle" size={17} color={COLORS.textGrey} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {CATEGORIES.map(c => (
                    <TouchableOpacity
                        key={c}
                        style={[styles.chip, category === c && styles.chipActive]}
                        onPress={() => setCategory(c)}
                        activeOpacity={0.75}
                    >
                        <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {Object.keys(grouped).length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="help-circle-outline" size={44} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No results for "{search}"</Text>
                    </View>
                ) : (
                    Object.entries(grouped).map(([cat, items]) => (
                        <View key={cat}>
                            <Text style={styles.sectionLabel}>{cat}</Text>
                            <View style={[styles.card, SHADOWS.sm]}>
                                {items.map((item, i) => (
                                    <View key={item.id}>
                                        {i > 0 && <View style={styles.divider} />}
                                        <AccordionItem item={item} />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                )}

                {/* Still need help? */}
                <View style={[styles.helpCard, SHADOWS.sm]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.primary} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.helpTitle}>Still need help?</Text>
                        <Text style={styles.helpSub}>Our support team replies in minutes</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
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

    searchWrap: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12,
        borderRadius: 12, paddingHorizontal: 14, paddingVertical: 2,
        borderWidth: 1, borderColor: '#EBEBEB',
    },
    searchInput: { flex: 1, paddingVertical: 12, fontSize: 14, color: COLORS.textDark },

    chips: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
    chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#EBEBEB' },
    chipActive: { backgroundColor: COLORS.textDark, borderColor: COLORS.textDark },
    chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textGrey },
    chipTextActive: { color: COLORS.white },

    content: { paddingHorizontal: 16, paddingBottom: 40 },
    sectionLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, marginTop: 4, paddingHorizontal: 2,
    },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 16 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 18 },

    faqRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 18, paddingVertical: 16, gap: 12,
    },
    faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark, lineHeight: 20 },
    faqAnswer: {
        fontSize: 13, color: COLORS.textGrey, lineHeight: 20,
        paddingHorizontal: 18, paddingBottom: 16, paddingTop: 0,
        backgroundColor: '#FAFAFA',
    },

    helpCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: COLORS.white, borderRadius: 18,
        padding: 16, marginTop: 4,
    },
    helpTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark },
    helpSub: { fontSize: 12, color: COLORS.textGrey, marginTop: 2 },

    empty: { alignItems: 'center', paddingTop: 60, gap: 10 },
    emptyText: { fontSize: 14, color: COLORS.textGrey },
});

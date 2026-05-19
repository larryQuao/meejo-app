import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ScrollView,
    TextInput, ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import TransactionSuccessState from '../components/TransactionSuccessState';
import TransactionErrorState from '../components/TransactionErrorState';

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface RecipientOption {
    id: string;
    label: string;
    number: string;
    network: string;
    type: 'self' | 'contact';
    initials?: string;
}

const RECIPIENT_OPTIONS: RecipientOption[] = [
    { id: 'self-1', label: 'My Phone Number', number: '+233 55 482 4425', network: 'MTN', type: 'self' },
    { id: 'self-2', label: 'My Second Number', number: '+233 44 444 4444', network: 'Telecel', type: 'self' },
    { id: 'contact-1', label: 'Mom', number: '+233 54 123 4567', network: 'MTN', type: 'contact', initials: 'M' },
    { id: 'contact-2', label: 'Work', number: '+233 20 987 6543', network: 'Telecel', type: 'contact', initials: 'W' },
];

const NETWORK_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
    MTN:    { bg: '#FEF9C3', text: '#92400E', dot: COLORS.mtn },
    Telecel:{ bg: '#FEE2E2', text: '#991B1B', dot: COLORS.telecel },
    AT:     { bg: '#DBEAFE', text: '#1E40AF', dot: COLORS.at },
};

const STEPS = ['Recipient', 'Amount', 'Payment', 'Confirm'];
type Step = 'recipient' | 'amount' | 'payment' | 'confirm' | 'processing' | 'success' | 'error';
const stepIndex: Record<string, number> = { recipient: 0, amount: 1, payment: 2, confirm: 3 };

// ─── Sub-components ───────────────────────────────────────────────────────────

function NetworkBadge({ network }: { network: string }) {
    const cfg = NETWORK_COLORS[network] ?? { bg: COLORS.primaryLight, text: COLORS.primary, dot: COLORS.primary };
    return (
        <View style={[styles.networkBadge, { backgroundColor: cfg.bg }]}>
            <View style={[styles.networkDot, { backgroundColor: cfg.dot }]} />
            <Text style={[styles.networkBadgeText, { color: cfg.text }]}>{network}</Text>
        </View>
    );
}

function RecipientCard({
    option, selected, onPress,
}: { option: RecipientOption; selected: boolean; onPress: () => void }) {
    return (
        <TouchableOpacity
            style={[styles.recipientCard, selected && styles.recipientCardActive]}
            onPress={onPress}
            activeOpacity={0.75}
        >
            {option.type === 'self' ? (
                <View style={[styles.recipientAvatar, { backgroundColor: COLORS.primaryLight }]}>
                    <Ionicons name="person" size={20} color={COLORS.primary} />
                </View>
            ) : (
                <View style={[styles.recipientAvatar, { backgroundColor: '#F1F5F9' }]}>
                    <Text style={styles.recipientInitials}>{option.initials}</Text>
                </View>
            )}
            <View style={{ flex: 1 }}>
                <Text style={[styles.recipientLabel, selected && { color: COLORS.primary }]}>{option.label}</Text>
                <View style={styles.recipientMeta}>
                    <Text style={styles.recipientNumber}>{option.number}</Text>
                    <NetworkBadge network={option.network} />
                </View>
            </View>
            <View style={[styles.radioCircle, selected && styles.radioCircleActive]}>
                {selected && <View style={styles.radioInner} />}
            </View>
        </TouchableOpacity>
    );
}

// "Recipient will get" toggle (Airtime | Data) — from wireframes 392:4565 & 568:3092
function RecipientGetsSelector({
    value, onChange,
}: { value: 'airtime' | 'data'; onChange: (v: 'airtime' | 'data') => void }) {
    return (
        <View style={styles.rgsContainer}>
            <Text style={styles.sectionLabel}>Recipient will get</Text>
            <View style={styles.rgsRow}>
                {(['airtime', 'data'] as const).map((opt) => {
                    const active = value === opt;
                    return (
                        <TouchableOpacity
                            key={opt}
                            style={[styles.rgsOption, active && styles.rgsOptionActive]}
                            onPress={() => onChange(opt)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.rgsIconWrap, active
                                ? { backgroundColor: COLORS.primary }
                                : { backgroundColor: COLORS.background }
                            ]}>
                                <Ionicons
                                    name={opt === 'airtime' ? 'call' : 'wifi'}
                                    size={22}
                                    color={active ? COLORS.white : COLORS.textGrey}
                                />
                            </View>
                            <Text style={[styles.rgsLabel, active && styles.rgsLabelActive]}>
                                {opt === 'airtime' ? 'Airtime' : 'Data'}
                            </Text>
                            <View style={[styles.rgsCheck, active && styles.rgsCheckActive]}>
                                {active && <Ionicons name="checkmark" size={12} color={COLORS.white} />}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

// ─── Main Flow ────────────────────────────────────────────────────────────────

export default function DataExchangeFlow({
    onDone,
    onPurchaseData,
}: { onDone: () => void; onPurchaseData?: () => void }) {

    const [step, setStep] = useState<Step>('recipient');
    const [selectedRecipientId, setSelectedRecipientId] = useState<string>('self-1');
    const [showAddNumber, setShowAddNumber] = useState(false);
    const [newNumber, setNewNumber] = useState('');
    const [newNetwork, setNewNetwork] = useState('MTN');
    const [amount, setAmount] = useState('1000');
    const [recipientGets, setRecipientGets] = useState<'airtime' | 'data'>('airtime');
    const [errorMsg, setErrorMsg] = useState('');

    const PRESET_AMOUNTS = ['500', '1000', '2000', '5000'];
    const NETWORKS = ['MTN', 'Telecel', 'AT'];
    const airtimeValue = (parseFloat(amount) || 0) * 0.01;

    const selectedRecipient = RECIPIENT_OPTIONS.find(r => r.id === selectedRecipientId);

    const handleContinue = () => {
        if (step === 'recipient') setStep('amount');
        else if (step === 'amount') setStep('payment');
        else if (step === 'payment') setStep('confirm');
        else if (step === 'confirm') {
            setStep('processing');
            setTimeout(() => setStep('success'), 2000);
        } else onDone();
    };

    const handleBack = () => {
        if (step === 'confirm') setStep('payment');
        else if (step === 'payment') setStep('amount');
        else if (step === 'amount') setStep('recipient');
        else onDone();
    };

    // ─ Terminal states
    if (step === 'success') {
        return (
            <TransactionSuccessState
                message="Exchange Successful!"
                subMessage={`${amount} MB data → ${recipientGets === 'airtime' ? `GHC ${airtimeValue.toFixed(2)} airtime` : `${amount} MB data`} for ${selectedRecipient?.label}`}
                onDone={onDone}
            />
        );
    }
    if (step === 'error') {
        return <TransactionErrorState message={errorMsg || 'Exchange failed. Please try again.'} onRetry={() => setStep('confirm')} onClose={onDone} />;
    }
    if (step === 'processing') {
        return (
            <View style={styles.processingContainer}>
                <LinearGradient colors={[COLORS.successLight, COLORS.background]} style={styles.processingGradient}>
                    <View style={styles.processingIconWrap}>
                        <ActivityIndicator size="large" color={COLORS.success} />
                    </View>
                    <Text style={styles.processingTitle}>Processing Exchange</Text>
                    <Text style={styles.processingSubtitle}>Please wait a moment...</Text>
                </LinearGradient>
            </View>
        );
    }

    const currentStepIndex = stepIndex[step] ?? 0;

    return (
        <View style={styles.container}>

            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Exchange Data</Text>
                    <Text style={styles.subtitle}>
                        {step === 'recipient' ? 'Choose who receives the exchange' : 'Swap data for airtime'}
                    </Text>
                </View>
            </View>

            {/* ── Step Indicator ── */}
            <View style={styles.stepRow}>
                {STEPS.map((label, i) => (
                    <React.Fragment key={label}>
                        <View style={styles.stepItem}>
                            <View style={[styles.stepDot, i <= currentStepIndex && styles.stepDotActive, i < currentStepIndex && styles.stepDotDone]}>
                                {i < currentStepIndex
                                    ? <Ionicons name="checkmark" size={12} color={COLORS.white} />
                                    : <Text style={[styles.stepNum, i <= currentStepIndex && styles.stepNumActive]}>{i + 1}</Text>
                                }
                            </View>
                            <Text style={[styles.stepLabel, i === currentStepIndex && styles.stepLabelActive]}>{label}</Text>
                        </View>
                        {i < STEPS.length - 1 && (
                            <View style={[styles.stepLine, i < currentStepIndex && styles.stepLineActive]} />
                        )}
                    </React.Fragment>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* ═══════════════════════════════════════
                    STEP 1 — RECIPIENT
                    Wireframes: 392:4192 (Myself) & 392:4260 (Others)
                    ─ Data balance card
                    ─ "Which number would receive?" checkable cards
                    ─ Add new number option
                ═══════════════════════════════════════ */}
                {step === 'recipient' && (
                    <>
                        {/* Data balance card — matches wireframe 392:4192 layout */}
                        <View style={[styles.balanceCard, SHADOWS.md]}>
                            <View style={styles.balanceCardBg} />
                            <View style={styles.balanceTop}>
                                <View style={[styles.balanceIconWrap, { backgroundColor: COLORS.successLight }]}>
                                    <Ionicons name="wifi" size={22} color={COLORS.success} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.balanceLabel}>Data Balance</Text>
                                    <Text style={styles.balanceValue}>12.50 GB</Text>
                                </View>
                                <TouchableOpacity
                                    style={[styles.buyDataBtn]}
                                    onPress={onPurchaseData}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.buyDataText}>Buy Data</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Recipient number selection — matches wireframe layout */}
                        <Text style={styles.sectionLabel}>Which number would receive the exchange?</Text>

                        {RECIPIENT_OPTIONS.map((option) => (
                            <RecipientCard
                                key={option.id}
                                option={option}
                                selected={selectedRecipientId === option.id}
                                onPress={() => setSelectedRecipientId(option.id)}
                            />
                        ))}

                        {/* Add new number */}
                        <TouchableOpacity
                            style={styles.addNumberBtn}
                            onPress={() => setShowAddNumber(true)}
                            activeOpacity={0.75}
                        >
                            <View style={styles.addNumberIcon}>
                                <Ionicons name="add" size={20} color={COLORS.primary} />
                            </View>
                            <Text style={styles.addNumberText}>Add New Number</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* ═══════════════════════════════════════
                    STEP 2 — AMOUNT
                    Wireframes: 392:4565 & 568:3092
                    ─ Data amount input
                    ─ Preset chips
                    ─ Conversion preview
                    ─ NEW: "Recipient will get: Airtime | Data" selector
                ═══════════════════════════════════════ */}
                {step === 'amount' && (
                    <>
                        <View style={[styles.amountCard, SHADOWS.md]}>
                            <Text style={styles.amountHint}>Enter data amount (MB) to transfer</Text>
                            <View style={styles.amountInputRow}>
                                <TextInput
                                    style={styles.amountInput}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textLight}
                                />
                                <Text style={styles.unitSymbol}>MB</Text>
                            </View>
                            <Text style={styles.amountMinHint}>Minimum: 200 MB</Text>
                        </View>

                        {/* Preset chips */}
                        <View style={styles.chipsRow}>
                            {PRESET_AMOUNTS.map((val) => (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.chip, amount === val && styles.chipActive]}
                                    onPress={() => setAmount(val)}
                                >
                                    <Text style={[styles.chipText, amount === val && styles.chipTextActive]}>{val} MB</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Conversion preview */}
                        <View style={[styles.conversionCard, SHADOWS.sm]}>
                            <View style={styles.conversionItem}>
                                <Text style={styles.conversionLabel}>You exchange</Text>
                                <Text style={[styles.conversionValue, { color: COLORS.success }]}>{amount || '0'} MB</Text>
                            </View>
                            <View style={styles.conversionArrow}>
                                <Ionicons name="swap-horizontal" size={22} color={COLORS.success} />
                            </View>
                            <View style={[styles.conversionItem, { alignItems: 'flex-end' }]}>
                                <Text style={styles.conversionLabel}>You get</Text>
                                <Text style={styles.conversionValue}>GHC {airtimeValue.toFixed(2)}</Text>
                            </View>
                        </View>

                        {/* "Recipient will get" — from wireframes 392:4565 & 568:3092 */}
                        <RecipientGetsSelector value={recipientGets} onChange={setRecipientGets} />
                    </>
                )}

                {/* ═══════════════════════════════════════
                    STEP 3 — PAYMENT
                ═══════════════════════════════════════ */}
                {step === 'payment' && (
                    <>
                        <View style={[styles.summaryCard, SHADOWS.sm]}>
                            <Text style={styles.summaryHeader}>Exchange Summary</Text>
                            <SummaryRow label="Recipient" value={selectedRecipient?.label ?? '—'} />
                            <SummaryRow label="Number" value={selectedRecipient?.number ?? '—'} />
                            <SummaryRow label="Network" value={selectedRecipient?.network ?? '—'} />
                            <View style={styles.summaryDivider} />
                            <SummaryRow label="Data Amount" value={`${amount} MB`} valueColor={COLORS.success} />
                            <SummaryRow label="Recipient Gets" value={recipientGets === 'airtime' ? `GHC ${airtimeValue.toFixed(2)} Airtime` : `${amount} MB Data`} />
                        </View>

                        <Text style={styles.sectionLabel}>Payment Method</Text>
                        <TouchableOpacity style={[styles.recipientCard, styles.recipientCardActive]}>
                            <View style={[styles.recipientAvatar, { backgroundColor: COLORS.successLight }]}>
                                <Ionicons name="wifi" size={20} color={COLORS.success} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.recipientLabel, { color: COLORS.success }]}>Data Bundle</Text>
                                <Text style={styles.recipientNumber}>12.50 GB available</Text>
                            </View>
                            <View style={[styles.radioCircle, styles.radioCircleActive]}>
                                <View style={styles.radioInner} />
                            </View>
                        </TouchableOpacity>
                    </>
                )}

                {/* ═══════════════════════════════════════
                    STEP 4 — CONFIRM
                ═══════════════════════════════════════ */}
                {step === 'confirm' && (
                    <>
                        <View style={[styles.receiptCard, SHADOWS.md]}>
                            <View style={[styles.receiptHeader, { backgroundColor: COLORS.successLight }]}>
                                <View style={styles.receiptIconWrap}>
                                    <Ionicons name="wifi" size={24} color={COLORS.success} />
                                </View>
                                <Text style={[styles.receiptTitle, { color: COLORS.success }]}>Data Exchange</Text>
                            </View>
                            {[
                                { label: 'Data Amount', value: `${amount} MB` },
                                { label: 'Recipient Gets', value: recipientGets === 'airtime' ? `GHC ${airtimeValue.toFixed(2)} Airtime` : `${amount} MB Data` },
                                { label: 'Recipient', value: `${selectedRecipient?.label} (${selectedRecipient?.number})` },
                                { label: 'Network', value: selectedRecipient?.network ?? '—' },
                                { label: 'Payment', value: 'Data Bundle' },
                            ].map((row, i, arr) => (
                                <View key={row.label} style={[styles.receiptRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                                    <Text style={styles.receiptLabel}>{row.label}</Text>
                                    <Text style={styles.receiptValue}>{row.value}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.noticeCard}>
                            <View style={styles.noticeIconWrap}>
                                <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.noticeTitle}>Please Note</Text>
                                <Text style={styles.noticeText}>This transaction is final and cannot be reversed once confirmed.</Text>
                            </View>
                        </View>
                    </>
                )}

            </ScrollView>

            {/* ── Footer CTA ── */}
            <View style={[styles.footer, SHADOWS.lg]}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={styles.continueBtnGradient}
                    >
                        <Text style={styles.continueBtnText}>
                            {step === 'confirm' ? 'Confirm & Exchange' : step === 'payment' ? 'Proceed to Confirm' : 'Continue'}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* ── Add Number Modal ── */}
            <Modal visible={showAddNumber} animationType="slide" transparent onRequestClose={() => setShowAddNumber(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHandle} />
                        <Text style={styles.modalTitle}>Add New Number</Text>

                        <Text style={styles.label}>Network</Text>
                        <View style={styles.networkChips}>
                            {NETWORKS.map(net => (
                                <TouchableOpacity
                                    key={net}
                                    style={[styles.networkChip, newNetwork === net && styles.networkChipActive]}
                                    onPress={() => setNewNetwork(net)}
                                >
                                    <View style={[styles.networkDot, { backgroundColor: NETWORK_COLORS[net]?.dot ?? COLORS.primary }]} />
                                    <Text style={[styles.networkChipText, newNetwork === net && { color: COLORS.white }]}>{net}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.label, { marginTop: 16 }]}>Phone Number</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newNumber}
                            onChangeText={setNewNumber}
                            placeholder="055 482 4425"
                            placeholderTextColor={COLORS.textLight}
                            keyboardType="phone-pad"
                        />

                        <TouchableOpacity
                            style={[styles.modalBtn, !newNumber && styles.modalBtnDisabled]}
                            disabled={!newNumber}
                            onPress={() => setShowAddNumber(false)}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.modalBtnText}>Add Number</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function SummaryRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
        <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={[styles.summaryValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    // Processing
    processingContainer: { flex: 1 },
    processingGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    processingIconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...SHADOWS.md },
    processingTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
    processingSubtitle: { fontSize: 14, color: COLORS.textGrey },

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 14 },
    backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
    headerText: {},
    title: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    subtitle: { fontSize: 13, color: COLORS.textGrey },

    // Step indicator
    stepRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    stepItem: { alignItems: 'center', gap: 4 },
    stepDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    stepDotActive: { backgroundColor: COLORS.primary },
    stepDotDone: { backgroundColor: COLORS.success },
    stepNum: { fontSize: 11, fontWeight: '700', color: COLORS.textGrey },
    stepNumActive: { color: COLORS.white },
    stepLabel: { fontSize: 10, color: COLORS.textGrey, fontWeight: '500' },
    stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
    stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4, marginBottom: 14 },
    stepLineActive: { backgroundColor: COLORS.success },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
    sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey, marginBottom: 12, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    label: { fontSize: 13, fontWeight: '600', color: COLORS.textMid, marginBottom: 8 },

    // ── Balance card (wireframe 392:4192 style) ──
    balanceCard: {
        backgroundColor: COLORS.primary, borderRadius: 20,
        padding: 20, marginBottom: 24, overflow: 'hidden',
    },
    balanceCardBg: {
        position: 'absolute', top: -30, right: -30,
        width: 140, height: 140, borderRadius: 70,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    balanceTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    balanceIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    balanceLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '500', marginBottom: 2 },
    balanceValue: { fontSize: 22, fontWeight: '900', color: COLORS.white },
    buyDataBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8,
        paddingHorizontal: 14, borderRadius: 12, borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    buyDataText: { fontSize: 13, fontWeight: '700', color: COLORS.white },

    // ── Recipient cards (wireframe 392:4192 / 392:4260 style) ──
    recipientCard: {
        backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 14,
        marginBottom: 10, borderWidth: 1.5, borderColor: 'transparent',
        ...SHADOWS.sm,
    },
    recipientCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '66' },
    recipientAvatar: {
        width: 44, height: 44, borderRadius: 22,
        alignItems: 'center', justifyContent: 'center',
    },
    recipientInitials: { fontSize: 16, fontWeight: '800', color: COLORS.textMid },
    recipientLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
    recipientMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    recipientNumber: { fontSize: 12, color: COLORS.textGrey },
    radioCircle: {
        width: 22, height: 22, borderRadius: 11,
        borderWidth: 2, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    radioCircleActive: { borderColor: COLORS.primary },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },

    // Add number button
    addNumberBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 12,
        padding: 16, borderRadius: 16, borderWidth: 1.5,
        borderStyle: 'dashed', borderColor: COLORS.primary,
        marginTop: 4,
    },
    addNumberIcon: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    },
    addNumberText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },

    // Network badge
    networkBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    networkDot: { width: 6, height: 6, borderRadius: 3 },
    networkBadgeText: { fontSize: 11, fontWeight: '700' },

    // ── Amount step ──
    amountCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
    amountHint: { fontSize: 13, color: COLORS.textGrey, fontWeight: '600', marginBottom: 12, textAlign: 'center' },
    amountInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    amountInput: { fontSize: 48, fontWeight: '800', color: COLORS.textDark, minWidth: 100, textAlign: 'center' },
    unitSymbol: { fontSize: 22, fontWeight: '700', color: COLORS.textGrey },
    amountMinHint: { fontSize: 12, color: COLORS.textGrey },
    chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    chip: { paddingVertical: 10, paddingHorizontal: 18, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border },
    chipActive: { backgroundColor: COLORS.success, borderColor: COLORS.success },
    chipText: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey },
    chipTextActive: { color: COLORS.white },
    conversionCard: { backgroundColor: COLORS.white, borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    conversionItem: { flex: 1 },
    conversionLabel: { fontSize: 12, color: COLORS.textGrey, fontWeight: '500', marginBottom: 4 },
    conversionValue: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    conversionArrow: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.successLight, alignItems: 'center', justifyContent: 'center', marginHorizontal: 8 },

    // ── "Recipient will get" selector (wireframes 392:4565 & 568:3092) ──
    rgsContainer: { marginBottom: 8 },
    rgsRow: { flexDirection: 'row', gap: 12 },
    rgsOption: {
        flex: 1, backgroundColor: COLORS.white, borderRadius: 16,
        padding: 16, alignItems: 'center', gap: 10,
        borderWidth: 1.5, borderColor: COLORS.border, ...SHADOWS.sm,
    },
    rgsOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight + '55' },
    rgsIconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    rgsLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textGrey },
    rgsLabelActive: { color: COLORS.primary },
    rgsCheck: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    rgsCheckActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

    // ── Payment step ──
    summaryCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20 },
    summaryHeader: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    summaryLabel: { fontSize: 14, color: COLORS.textGrey, fontWeight: '500' },
    summaryValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, textAlign: 'right', flex: 1, marginLeft: 16 },
    summaryDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },

    // ── Confirm step ──
    receiptCard: { backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', marginBottom: 16 },
    receiptHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18 },
    receiptIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
    receiptTitle: { fontSize: 16, fontWeight: '800' },
    receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    receiptLabel: { fontSize: 13, color: COLORS.textGrey, fontWeight: '500', flex: 1 },
    receiptValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, textAlign: 'right', flex: 1.5 },
    noticeCard: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: '#BFDBFE' },
    noticeIconWrap: { marginTop: 1 },
    noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
    noticeText: { fontSize: 12, color: COLORS.textMid, lineHeight: 18 },

    // ── Footer ──
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: COLORS.white, padding: 20, paddingBottom: 32, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
    continueBtn: { borderRadius: 16, overflow: 'hidden', ...SHADOWS.primary },
    continueBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    continueBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },

    // ── Add number modal ──
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
    modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
    modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textDark, marginBottom: 24 },
    networkChips: { flexDirection: 'row', gap: 10 },
    networkChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white },
    networkChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    networkChipText: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey },
    modalInput: { backgroundColor: COLORS.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 16, fontSize: 16, color: COLORS.textDark, marginTop: 4, borderWidth: 1.5, borderColor: COLORS.border },
    modalBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 24, ...SHADOWS.primary },
    modalBtnDisabled: { backgroundColor: '#CBD5E1', shadowOpacity: 0, elevation: 0 },
    modalBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
});

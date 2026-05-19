import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import TransactionSuccessState from '../components/TransactionSuccessState';
import TransactionErrorState from '../components/TransactionErrorState';

const MY_NUMBERS = [
    { id: '1', number: '+233 33 333 3333', network: 'MTN' },
    { id: '2', number: '+233 44 444 4444', network: 'TELECEL' },
];

const STEPS = ['Recipient', 'Amount', 'Payment', 'Confirm'];
type Step = 'recipient' | 'amount' | 'payment' | 'confirm' | 'processing' | 'success' | 'error';

const stepIndex: Record<string, number> = { recipient: 0, amount: 1, payment: 2, confirm: 3 };

export default function AirtimeExchangeFlow({ onDone, onPurchaseAirtime }: { onDone: () => void; onPurchaseAirtime?: () => void }) {
    const [recipientType, setRecipientType] = useState<'myself' | 'others'>('myself');
    const [selectedNumberId, setSelectedNumberId] = useState<string>(MY_NUMBERS[0].id);
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('MTN');
    const NETWORKS = ['MTN', 'Telecel', 'AT'];
    const [step, setStep] = useState<Step>('recipient');
    const [errorMsg, setErrorMsg] = useState('');
    const [amount, setAmount] = useState('10');
    const PRESET_AMOUNTS = ['10', '20', '30', '50'];
    const [othersPhoneNumber, setOthersPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'airtime'>('airtime');
    const dataAmount = (parseFloat(amount) || 0) * 14.5;

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

    if (step === 'success') {
        return (
            <TransactionSuccessState
                message="Exchange Successful!"
                subMessage={`GHC ${amount} airtime → ${Math.round(dataAmount)} MB data`}
                onDone={onDone}
            />
        );
    }
    if (step === 'error') {
        return <TransactionErrorState message={errorMsg || "Exchange failed. Please try again."} onRetry={() => setStep('confirm')} onClose={onDone} />;
    }
    if (step === 'processing') {
        return (
            <View style={styles.processingContainer}>
                <LinearGradient colors={[COLORS.primaryLight, COLORS.background]} style={styles.processingGradient}>
                    <View style={styles.processingIconWrap}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    <Text style={styles.processingTitle}>Processing Exchange</Text>
                    <Text style={styles.processingSubtitle}>Please wait a moment...</Text>
                </LinearGradient>
            </View>
        );
    }

    const currentStepIndex = stepIndex[step] ?? 0;
    const recipient = recipientType === 'myself'
        ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number
        : othersPhoneNumber || 'N/A';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Exchange Airtime</Text>
                    <Text style={styles.subtitle}>Swap airtime for data</Text>
                </View>
            </View>

            {/* Step Indicator */}
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

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* RECIPIENT STEP */}
                {step === 'recipient' && (
                    <>
                        {/* Balance card */}
                        <View style={[styles.balanceCard, SHADOWS.md]}>
                            <View style={styles.balanceLeft}>
                                <View style={styles.balanceIconWrap}>
                                    <Ionicons name="call" size={22} color={COLORS.primary} />
                                </View>
                                <View>
                                    <Text style={styles.balanceLabel}>Airtime Balance</Text>
                                    <Text style={styles.balanceValue}>GHC 783.00</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.addUpBtn} onPress={onPurchaseAirtime}>
                                <Text style={styles.addUpText}>Top Up</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionLabel}>Exchange for</Text>
                        <View style={styles.recipientToggle}>
                            {(['myself', 'others'] as const).map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.toggleBtn, recipientType === type && styles.toggleBtnActive]}
                                    onPress={() => setRecipientType(type)}
                                >
                                    <Ionicons
                                        name={type === 'myself' ? 'person' : 'people'}
                                        size={16}
                                        color={recipientType === type ? COLORS.white : COLORS.textGrey}
                                    />
                                    <Text style={[styles.toggleText, recipientType === type && styles.toggleTextActive]}>
                                        {type === 'myself' ? 'Myself' : 'Others'}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {recipientType === 'myself' && (
                            <>
                                <Text style={styles.sectionLabel}>Select your number</Text>
                                {MY_NUMBERS.map((item) => {
                                    const isSelected = selectedNumberId === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[styles.selectCard, isSelected && styles.selectCardActive]}
                                            onPress={() => setSelectedNumberId(item.id)}
                                        >
                                            <View style={[styles.selectIconWrap, { backgroundColor: isSelected ? COLORS.primaryLight : '#F1F5F9' }]}>
                                                <Ionicons name="call" size={20} color={isSelected ? COLORS.primary : COLORS.textGrey} />
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.selectCardTitle}>{item.number}</Text>
                                                <Text style={styles.selectCardSub}>{item.network}</Text>
                                            </View>
                                            <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                                                {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </>
                        )}

                        {recipientType === 'others' && (
                            <>
                                <Text style={styles.sectionLabel}>Choose network</Text>
                                <TouchableOpacity
                                    style={styles.dropdownBtn}
                                    onPress={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                >
                                    <View style={styles.networkDot} />
                                    <Text style={styles.dropdownText}>{selectedNetwork}</Text>
                                    <Ionicons name={isNetworkDropdownOpen ? 'chevron-up' : 'chevron-down'} size={20} color={COLORS.textGrey} />
                                </TouchableOpacity>
                                {isNetworkDropdownOpen && (
                                    <View style={[styles.dropdownList, SHADOWS.md]}>
                                        {NETWORKS.map((net) => (
                                            <TouchableOpacity
                                                key={net}
                                                style={styles.dropdownOption}
                                                onPress={() => { setSelectedNetwork(net); setIsNetworkDropdownOpen(false); }}
                                            >
                                                <Text style={styles.dropdownOptionText}>{net}</Text>
                                                {selectedNetwork === net && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Phone number</Text>
                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={[styles.input, { flex: 1 }]}
                                        value={othersPhoneNumber}
                                        onChangeText={setOthersPhoneNumber}
                                        placeholder="055 482 4425"
                                        placeholderTextColor={COLORS.textLight}
                                        keyboardType="phone-pad"
                                    />
                                    <TouchableOpacity style={styles.inputAction}>
                                        <MaterialCommunityIcons name="contacts" size={22} color={COLORS.primary} />
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </>
                )}

                {/* AMOUNT STEP */}
                {step === 'amount' && (
                    <>
                        <View style={styles.amountCard}>
                            <Text style={styles.amountHint}>Airtime amount (GHC)</Text>
                            <View style={styles.amountInputRow}>
                                <Text style={styles.currencySymbol}>GHC</Text>
                                <TextInput
                                    style={styles.amountInput}
                                    value={amount}
                                    onChangeText={setAmount}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={COLORS.textLight}
                                />
                            </View>
                            <Text style={styles.amountMinHint}>Minimum: GHC 5.00</Text>
                        </View>

                        <View style={styles.chipsRow}>
                            {PRESET_AMOUNTS.map((val) => (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.chip, amount === val && styles.chipActive]}
                                    onPress={() => setAmount(val)}
                                >
                                    <Text style={[styles.chipText, amount === val && styles.chipTextActive]}>GHC {val}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.conversionCard, SHADOWS.sm]}>
                            <View style={styles.conversionItem}>
                                <Text style={styles.conversionLabel}>You exchange</Text>
                                <Text style={styles.conversionValue}>GHC {amount || '0'}</Text>
                            </View>
                            <View style={styles.conversionArrow}>
                                <Ionicons name="swap-horizontal" size={22} color={COLORS.primary} />
                            </View>
                            <View style={[styles.conversionItem, { alignItems: 'flex-end' }]}>
                                <Text style={styles.conversionLabel}>You get</Text>
                                <Text style={[styles.conversionValue, { color: COLORS.success }]}>{Math.round(dataAmount)} MB</Text>
                            </View>
                        </View>
                    </>
                )}

                {/* PAYMENT STEP */}
                {step === 'payment' && (
                    <>
                        <View style={[styles.summaryCard, SHADOWS.sm]}>
                            <Text style={styles.summaryHeader}>Exchange Summary</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>For</Text>
                                <Text style={styles.summaryValue}>{recipientType === 'myself' ? 'Myself' : 'Others'}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Number</Text>
                                <Text style={styles.summaryValue}>{recipient}</Text>
                            </View>
                            {recipientType === 'others' && (
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Network</Text>
                                    <Text style={styles.summaryValue}>{selectedNetwork}</Text>
                                </View>
                            )}
                            <View style={[styles.summaryDivider]} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Airtime</Text>
                                <Text style={styles.summaryValue}>GHC {amount}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Data Value</Text>
                                <Text style={[styles.summaryValue, { color: COLORS.success }]}>{Math.round(dataAmount)} MB</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Payment Method</Text>
                        {[
                            { id: 'airtime', label: 'Airtime Balance', sub: 'GHC 783.00 available', iconBg: COLORS.primaryLight, iconColor: COLORS.primary, icon: 'call-outline' },
                            { id: 'momo', label: 'MTN Mobile Money', sub: MY_NUMBERS.find(n => n.network === 'MTN')?.number, iconBg: '#FFF9C4', iconColor: '#D97706', icon: 'phone-portrait-outline' },
                        ].map((method) => {
                            const isSelected = paymentMethod === method.id as any;
                            return (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[styles.selectCard, isSelected && styles.selectCardActive]}
                                    onPress={() => setPaymentMethod(method.id as any)}
                                >
                                    <View style={[styles.selectIconWrap, { backgroundColor: isSelected ? COLORS.primaryLight : '#F1F5F9' }]}>
                                        <Ionicons name={method.icon as any} size={20} color={isSelected ? COLORS.primary : COLORS.textGrey} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.selectCardTitle}>{method.label}</Text>
                                        {method.sub && <Text style={styles.selectCardSub}>{method.sub}</Text>}
                                    </View>
                                    <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                                        {isSelected && <Ionicons name="checkmark" size={14} color={COLORS.white} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </>
                )}

                {/* CONFIRM STEP */}
                {step === 'confirm' && (
                    <>
                        <View style={[styles.receiptCard, SHADOWS.md]}>
                            <View style={styles.receiptHeader}>
                                <View style={styles.receiptIconWrap}>
                                    <Ionicons name="swap-horizontal" size={24} color={COLORS.primary} />
                                </View>
                                <Text style={styles.receiptTitle}>Airtime Exchange</Text>
                            </View>
                            {[
                                { label: 'Airtime Amount', value: `GHC ${amount}` },
                                { label: 'Data You Receive', value: `${Math.round(dataAmount)} MB` },
                                { label: 'Recipient', value: `${recipient} (${recipientType === 'myself' ? 'Self' : 'Other'})` },
                                { label: 'Payment Method', value: paymentMethod === 'momo' ? 'MTN MoMo' : 'Airtime Balance' },
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

            {/* Footer */}
            <View style={[styles.footer, SHADOWS.lg]}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} activeOpacity={0.85}>
                    <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueBtnGradient}>
                        <Text style={styles.continueBtnText}>
                            {step === 'confirm' ? 'Confirm & Exchange' : step === 'payment' ? 'Proceed to Confirm' : 'Continue'}
                        </Text>
                        <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },

    processingContainer: { flex: 1 },
    processingGradient: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
    processingIconWrap: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        ...SHADOWS.md,
    },
    processingTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
    processingSubtitle: { fontSize: 14, color: COLORS.textGrey },

    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 14 },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
        ...SHADOWS.sm,
    },
    headerText: {},
    title: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    subtitle: { fontSize: 13, color: COLORS.textGrey },

    stepRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    stepItem: { alignItems: 'center', gap: 4 },
    stepDot: {
        width: 26, height: 26, borderRadius: 13,
        backgroundColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    stepDotActive: { backgroundColor: COLORS.primary },
    stepDotDone: { backgroundColor: COLORS.success },
    stepNum: { fontSize: 11, fontWeight: '700', color: COLORS.textGrey },
    stepNumActive: { color: COLORS.white },
    stepLabel: { fontSize: 10, color: COLORS.textGrey, fontWeight: '500' },
    stepLabelActive: { color: COLORS.primary, fontWeight: '700' },
    stepLine: { flex: 1, height: 2, backgroundColor: COLORS.border, marginHorizontal: 4, marginBottom: 14 },
    stepLineActive: { backgroundColor: COLORS.success },

    scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

    // Balance card
    balanceCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    balanceLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    balanceIconWrap: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
    },
    balanceLabel: { fontSize: 12, color: COLORS.textGrey, fontWeight: '500', marginBottom: 2 },
    balanceValue: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    addUpBtn: {
        backgroundColor: COLORS.primaryLight,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 12,
    },
    addUpText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

    sectionLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

    recipientToggle: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 4,
        marginBottom: 24,
        ...SHADOWS.sm,
    },
    toggleBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: 6, paddingVertical: 12, borderRadius: 12,
    },
    toggleBtnActive: { backgroundColor: COLORS.primary },
    toggleText: { fontSize: 14, fontWeight: '700', color: COLORS.textGrey },
    toggleTextActive: { color: COLORS.white },

    selectCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 12,
        borderWidth: 1.5,
        borderColor: 'transparent',
        ...SHADOWS.sm,
    },
    selectCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    selectIconWrap: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    selectCardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark, marginBottom: 2 },
    selectCardSub: { fontSize: 12, color: COLORS.textGrey },
    checkCircle: {
        width: 24, height: 24, borderRadius: 12,
        borderWidth: 2, borderColor: COLORS.border,
        alignItems: 'center', justifyContent: 'center',
    },
    checkCircleActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },

    dropdownBtn: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
        ...SHADOWS.sm,
    },
    networkDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.mtn },
    dropdownText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    dropdownList: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        overflow: 'hidden',
        marginBottom: 4,
    },
    dropdownOption: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14,
        borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    dropdownOptionText: { fontSize: 15, fontWeight: '600', color: COLORS.textDark },

    inputRow: {
        backgroundColor: COLORS.white,
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    input: { flex: 1, fontSize: 16, color: COLORS.textDark, paddingVertical: 14, fontWeight: '500' },
    inputAction: { padding: 8 },

    amountCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
        ...SHADOWS.md,
    },
    amountHint: { fontSize: 13, color: COLORS.textGrey, fontWeight: '600', marginBottom: 12 },
    amountInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    currencySymbol: { fontSize: 22, fontWeight: '700', color: COLORS.textGrey },
    amountInput: { fontSize: 48, fontWeight: '800', color: COLORS.textDark, minWidth: 100, textAlign: 'center' },
    amountMinHint: { fontSize: 12, color: COLORS.textGrey },

    chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
    chip: {
        paddingVertical: 10, paddingHorizontal: 18,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        borderWidth: 1.5, borderColor: COLORS.border,
    },
    chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey },
    chipTextActive: { color: COLORS.white },

    conversionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    conversionItem: { flex: 1 },
    conversionLabel: { fontSize: 12, color: COLORS.textGrey, fontWeight: '500', marginBottom: 4 },
    conversionValue: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    conversionArrow: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center',
        marginHorizontal: 8,
    },

    summaryCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    summaryHeader: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
    summaryLabel: { fontSize: 14, color: COLORS.textGrey, fontWeight: '500' },
    summaryValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, textAlign: 'right', flex: 1, marginLeft: 16 },
    summaryDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },

    receiptCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
    },
    receiptHeader: {
        backgroundColor: COLORS.primaryLight,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 18,
    },
    receiptIconWrap: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center',
        ...SHADOWS.sm,
    },
    receiptTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    receiptLabel: { fontSize: 13, color: COLORS.textGrey, fontWeight: '500', flex: 1 },
    receiptValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, textAlign: 'right', flex: 1.5 },

    noticeCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    noticeIconWrap: { marginTop: 1 },
    noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
    noticeText: { fontSize: 12, color: COLORS.textMid, lineHeight: 18 },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white,
        padding: 20,
        paddingBottom: 32,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    continueBtn: { borderRadius: 16, overflow: 'hidden', ...SHADOWS.primary },
    continueBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    continueBtnText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },
});

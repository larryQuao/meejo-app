import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Mock Data for "Your Numbers"
const MY_NUMBERS = [
    { id: '1', number: '+233 33 333 3333', network: 'MTN' },
    { id: '2', number: '+233 44 444 4444', network: 'TELECEL' },
];

export default function DataExchangeFlow({ onDone }: { onDone: () => void }) {
    const [recipientType, setRecipientType] = useState<'myself' | 'others'>('myself');
    const [selectedNumberId, setSelectedNumberId] = useState<string>(MY_NUMBERS[0].id);

    // Dropdown State
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('MTN');
    const NETWORKS = ['MTN', 'Telecel', 'AT'];

    // Flow State
    const [step, setStep] = useState<'recipient' | 'amount' | 'payment' | 'confirm'>('recipient');

    // Amount State (Input is in MB)
    const [amount, setAmount] = useState('1000'); // Default 1000MB (1GB)
    const PRESET_AMOUNTS = ['500', '1000', '2000', '5000'];
    const [othersPhoneNumber, setOthersPhoneNumber] = useState('');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'data'>('data');

    // Derived Data
    // Mock Rate: 100MB = 1 GHC. So 1MB = 0.01 GHC.
    const airtimeValue = (parseFloat(amount) || 0) * 0.01;

    // Handlers
    const handleContinue = () => {
        if (step === 'recipient') {
            setStep('amount');
        } else if (step === 'amount') {
            setStep('payment');
        } else if (step === 'payment') {
            setStep('confirm');
        } else {
            onDone(); // Exit after final confirmation
        }
    };

    const handleBack = () => {
        if (step === 'confirm') {
            setStep('payment');
        } else if (step === 'payment') {
            setStep('amount');
        } else if (step === 'amount') {
            setStep('recipient');
        } else {
            onDone(); // Exit flow
        }
    };

    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle-outline" size={32} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.title}>Exchange Data</Text>
                    <Text style={styles.subtitle}>
                        {step === 'amount'
                            ? `Exchange your data to airtime for ${recipientType === 'myself' ? 'self' : 'others'}`
                            : 'Exchange your data to airtime'
                        }
                    </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {step === 'recipient' && (
                    <>
                        {/* Balance Card Section */}
                        <View style={styles.balanceSection}>
                            <Text style={styles.balanceLabel}>Data Balance</Text>
                            <Text style={styles.balanceAmount}>12.5 GB</Text>
                            <TouchableOpacity style={styles.addUpButton}>
                                <Text style={styles.addUpText}>Buy Data</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Recipient Selector Section */}
                        <Text style={styles.sectionHeader}>Data to Airtime exchange for?</Text>

                        {/* Myself Card */}
                        <TouchableOpacity
                            style={[styles.radioCard, recipientType === 'myself' && styles.radioCardSelected]}
                            onPress={() => setRecipientType('myself')}
                        >
                            <View style={styles.radioCardContent}>
                                <View style={styles.radioIconCircle}>
                                    <Ionicons name="person" size={24} color={COLORS.textDark} />
                                </View>
                                <Text style={styles.radioCardLabel}>Myself</Text>
                            </View>
                            <View style={styles.radioOuter}>
                                {recipientType === 'myself' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        {/* Others Card */}
                        <TouchableOpacity
                            style={[styles.radioCard, recipientType === 'others' && styles.radioCardSelected]}
                            onPress={() => setRecipientType('others')}
                        >
                            <View style={styles.radioCardContent}>
                                <View style={styles.radioIconCircle}>
                                    <Ionicons name="person" size={24} color={COLORS.textDark} />
                                </View>
                                <Text style={styles.radioCardLabel}>Others</Text>
                            </View>
                            <View style={styles.radioOuter}>
                                {recipientType === 'others' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>


                        {/* Number Selection Section */}
                        {recipientType === 'myself' && (
                            <>
                                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Your Number</Text>

                                {MY_NUMBERS.map((item) => {
                                    const isSelected = selectedNumberId === item.id;
                                    return (
                                        <TouchableOpacity
                                            key={item.id}
                                            style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                                            onPress={() => setSelectedNumberId(item.id)}
                                        >
                                            <View style={styles.radioCardContent}>
                                                <View style={{ marginRight: 12 }}>
                                                    <Ionicons name="call" size={24} color={COLORS.textDark} />
                                                </View>
                                                <View>
                                                    <Text style={styles.phoneText}>{item.number}</Text>
                                                    <Text style={styles.networkText}>{item.network}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.radioOuter}>
                                                {isSelected && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </>
                        )}

                        {/* Others Selection Flow */}
                        {recipientType === 'others' && (
                            <View style={{ marginTop: 24 }}>
                                <Text style={styles.sectionHeader}>Choose networks</Text>

                                <TouchableOpacity
                                    style={styles.dropdownSelector}
                                    onPress={() => setIsNetworkDropdownOpen(!isNetworkDropdownOpen)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={styles.networkIconCircle} />
                                        <Text style={styles.dropdownText}>{selectedNetwork}</Text>
                                    </View>
                                    <Ionicons name={isNetworkDropdownOpen ? "chevron-up" : "chevron-down"} size={24} color={COLORS.textDark} />
                                </TouchableOpacity>

                                {/* Dropdown Options */}
                                {isNetworkDropdownOpen && (
                                    <View style={styles.dropdownList}>
                                        {NETWORKS.map((network) => (
                                            <TouchableOpacity
                                                key={network}
                                                style={styles.dropdownOption}
                                                onPress={() => {
                                                    setSelectedNetwork(network);
                                                    setIsNetworkDropdownOpen(false);
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {/* Placeholder icon for now */}
                                                    <View style={[styles.networkIconCircle, { width: 24, height: 24, borderRadius: 12, marginRight: 8 }]} />
                                                    <Text style={styles.dropdownOptionText}>{network}</Text>
                                                </View>
                                                {selectedNetwork === network && (
                                                    <Ionicons name="checkmark" size={20} color={COLORS.primary} />
                                                )}
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                <View style={{ marginTop: 20 }}>
                                    <Text style={styles.fieldLabel}>Enter phone number</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.inputText, { flex: 1 }]}
                                            value={othersPhoneNumber}
                                            onChangeText={setOthersPhoneNumber}
                                            placeholder="055 482 4425"
                                            keyboardType="phone-pad"
                                        />
                                        <TouchableOpacity>
                                            <MaterialCommunityIcons name="contacts" size={24} color={COLORS.textDark} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}

                    </>
                )}

                {/* AMOUNT ENTRY STEP  */}
                {step === 'amount' && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.fieldLabel}>Enter Amount of Data (MB) Exchange to Airtime</Text>
                        <Text style={styles.helperLabel}>Minimum amount: 200 MB</Text>

                        <View style={styles.amountInputContainer}>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>

                        {/* Quick Amounts */}
                        <View style={styles.chipsRow}>
                            {PRESET_AMOUNTS.map((val) => (
                                <TouchableOpacity
                                    key={val}
                                    style={[styles.chip, amount === val && styles.chipSelected]}
                                    onPress={() => setAmount(val)}
                                >
                                    <Text style={[styles.chipText, amount === val && styles.chipTextSelected]}>
                                        {val} MB
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Summary */}
                        <View style={styles.summaryRow}>
                            <View>
                                <Text style={styles.summaryLabel}>Data Exchange amount</Text>
                                <Text style={styles.summaryValue}>{amount || '0'} MB</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.summaryLabel}>Airtime Value</Text>
                                <Text style={styles.summaryValue}>GHC {airtimeValue.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>
                )}


                {/* PAYMENT METHOD STEP */}
                {step === 'payment' && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.sectionHeader}>Confirm Data Exchange</Text>

                        {/* Summary Card */}
                        <View style={styles.paymentSummaryCard}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                <View style={styles.paymentIconBox}>
                                    <MaterialCommunityIcons name="wifi" size={24} color={COLORS.textDark} />
                                </View>
                            </View>
                            <Text style={styles.paymentSummaryLabel}>
                                Data to Airtime Exchange For {recipientType === 'myself' ? 'Self' : 'Other'}
                            </Text>
                            <Text style={styles.paymentSummaryNumber}>
                                {recipientType === 'myself'
                                    ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number
                                    : othersPhoneNumber || 'N/A'}
                            </Text>

                            {recipientType === 'others' && (
                                <>
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={styles.paymentSummaryLabel}>Network</Text>
                                        <Text style={styles.paymentSummaryNumber}>{selectedNetwork}</Text>
                                    </View>
                                    <View style={{ marginTop: 12 }}>
                                        <Text style={styles.paymentSummaryLabel}>Charges Involved</Text>
                                        <Text style={styles.paymentSummaryNumber}>1.5%</Text>
                                    </View>
                                </>
                            )}

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                                <View>
                                    <Text style={styles.paymentSummaryValueLabel}>Data</Text>
                                    <Text style={styles.paymentSummaryValue}>{amount} MB</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text style={styles.paymentSummaryValueLabel}>Airtime</Text>
                                    <Text style={styles.paymentSummaryValue}>GHC {airtimeValue.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Payment Method Selection */}
                        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Payment Method</Text>

                        {/* Data Bundle Option (Selected) */}
                        <TouchableOpacity
                            style={[styles.paymentMethodCard, styles.paymentMethodSelected]}
                            onPress={() => setPaymentMethod('data')}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.paymentMethodIcon, { backgroundColor: '#BBF7D0' }]} />
                                <Text style={styles.paymentMethodText}>Data Bundle</Text>
                            </View>
                            <View style={styles.radioOuter}>
                                <View style={styles.radioInner} />
                            </View>
                        </TouchableOpacity>
                    </View>
                )}


                {/* CONFIRMATION STEP */}
                {step === 'confirm' && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.sectionHeader}>Confirm Transaction Details</Text>

                        <View style={styles.detailsContainer}>
                            {/* Data Amount */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Data Amount</Text>
                                <Text style={styles.detailValue}>{amount} MB</Text>
                            </View>

                            {/* Airtime Value */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Airtime Value</Text>
                                <Text style={styles.detailValue}>GHC {airtimeValue.toFixed(2)}</Text>
                            </View>

                            {/* Recipient Number */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Recipient Number ({recipientType === 'myself' ? 'Self' : 'Other'})</Text>
                                <Text style={styles.detailValue}>
                                    {recipientType === 'myself'
                                        ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number
                                        : othersPhoneNumber || 'N/A'}
                                </Text>
                            </View>

                            {/* Payment Method */}
                            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                                <Text style={styles.detailLabel}>Payment Method</Text>
                                <Text style={styles.detailValue}>Data Bundle</Text>
                            </View>
                        </View>

                        {/* Transaction Notice */}
                        <View style={styles.noticeCard}>
                            <View style={styles.noticeIconCircle} />
                            <Text style={styles.noticeTitle}>Transaction Notice</Text>
                            <Text style={styles.noticeText}>Note that transactions made is not reversible.</Text>
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                    <Text style={styles.continueText}>
                        {step === 'confirm' ? 'Pay' : step === 'payment' ? 'Proceed To Payment' : 'Continue'}
                    </Text>
                </TouchableOpacity>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Assuming white or light grey
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4, // Align visual circle
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textGrey,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },

    // Balance Section
    balanceSection: {
        backgroundColor: '#F0FDF4', // Very light green for Data
        borderWidth: 2,
        borderColor: '#16A34A', // Green border
        borderRadius: 4,
        paddingVertical: 24,
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 10,
    },
    balanceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 12,
    },
    addUpButton: {
        backgroundColor: '#BBF7D0', // Light green button
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 4,
    },
    addUpText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#14532D',
    },

    // Section Headers
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 12,
    },

    // Radio Cards
    radioCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderWidth: 2,
        borderColor: '#64748B',
        borderRadius: 4,
        padding: 16,
        marginBottom: 12,
    },
    radioCardSelected: {
        borderColor: '#1E293B',
        borderWidth: 2.5,
    },
    radioCardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioIconCircle: {
        marginRight: 12,
    },
    radioCardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
    },

    // Custom Radio Button
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#000',
    },

    // Phone list specific
    phoneText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    networkText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textGrey,
        textTransform: 'uppercase',
    },

    // Footer
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.background,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    continueButton: {
        backgroundColor: '#475569',
        paddingVertical: 18,
        borderRadius: 8,
        alignItems: 'center',
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },

    // Others Flow - Inputs
    dropdownSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    networkIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#64748B',
        marginRight: 12,
    },
    dropdownText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 16,
        backgroundColor: COLORS.white,
    },
    inputText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    dropdownList: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        backgroundColor: COLORS.white,
        marginTop: 8,
        overflow: 'hidden',
    },
    dropdownOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    dropdownOptionText: {
        fontSize: 14,
        color: COLORS.textDark,
        fontWeight: '500',
    },

    // Amount Step
    helperLabel: {
        fontSize: 12,
        color: COLORS.textGrey,
        marginBottom: 8,
    },
    amountInputContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
    },
    amountInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    chipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 8,
    },
    chip: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#E2E8F0',
        borderRadius: 4,
        alignItems: 'center',
    },
    chipSelected: {
        backgroundColor: '#BBF7D0', // Light Green
        borderWidth: 1,
        borderColor: '#16A34A',
    },
    chipText: {
        fontWeight: '600',
        color: COLORS.textDark,
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#14532D',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    summaryLabel: {
        fontSize: 12,
        color: COLORS.textDark,
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textDark,
    },

    // Payment Step
    paymentSummaryCard: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        padding: 16,
    },
    paymentIconBox: {
        backgroundColor: '#DCFCE7', // Light green bg
        padding: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    paymentSummaryLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },
    paymentSummaryNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    paymentSummaryValueLabel: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 2,
    },
    paymentSummaryValue: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.textDark,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        padding: 16,
    },
    paymentMethodSelected: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
    },
    paymentMethodIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 12,
    },
    paymentMethodText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textDark,
    },

    // Confirmation Step
    detailsContainer: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        marginBottom: 24,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textDark,
        textAlign: 'right',
        flex: 1,
    },
    noticeCard: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noticeIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#CBD5E1',
        marginBottom: 12,
    },
    noticeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 4,
    },
    noticeText: {
        fontSize: 12,
        color: COLORS.textDark,
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import TransactionSuccessState from '../components/TransactionSuccessState';
import TransactionErrorState from '../components/TransactionErrorState';
import PinEntryBottomSheet from '../components/PinEntryBottomSheet';
import OtpEntryBottomSheet from '../components/OtpEntryBottomSheet';

// Mock Data for "Your Numbers"
const MY_NUMBERS = [
    { id: '1', number: '+233 33 333 3333', network: 'MTN' },
    { id: '2', number: '+233 44 444 4444', network: 'TELECEL' },
];

// Mock Data for Saved Beneficiaries
const SAVED_BENEFICIARIES = [
    { id: 'b1', name: 'Mom', number: '054 123 4567', network: 'MTN' },
    { id: 'b2', name: 'Work', number: '020 987 6543', network: 'TELECEL' },
];

// Mock Data for Saved Cards
const SAVED_CARDS = [
    { id: 'c1', type: 'Visa', last4: '4242', expiry: '12/25' },
    { id: 'c2', type: 'Mastercard', last4: '8888', expiry: '01/26' },
];

export default function AirtimePurchaseFlow({ onDone }: { onDone: () => void }) {
    const [recipientType, setRecipientType] = useState<'myself' | 'others'>('myself');
    const [selectedNumberId, setSelectedNumberId] = useState<string>(MY_NUMBERS[0].id);

    // Dropdown State
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('MTN');
    const NETWORKS = ['MTN', 'Telecel', 'AT'];

    // Flow State
    const [step, setStep] = useState<'recipient' | 'amount' | 'payment' | 'confirm' | 'processing' | 'success' | 'error'>('recipient');
    const [errorMsg, setErrorMsg] = useState('');

    // Amount State
    const [amount, setAmount] = useState('10'); // Default 10 GHC
    const PRESET_AMOUNTS = ['10', '20', '50', '100'];
    const [othersPhoneNumber, setOthersPhoneNumber] = useState('');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'telecel' | 'at' | 'card'>('momo');
    const [showCardBottomSheet, setShowCardBottomSheet] = useState(false);

    // PIN & OTP State
    const [showPinSheet, setShowPinSheet] = useState(false);
    const [showOtpSheet, setShowOtpSheet] = useState(false);

    const mtnNumber = MY_NUMBERS.find(n => n.network === 'MTN')?.number;
    const telecelNumber = MY_NUMBERS.find(n => n.network === 'TELECEL')?.number;

    const PAYMENT_METHODS = [
        { id: 'momo', name: 'MTN Mobile Money', color: '#FCD34D', icon: 'phone-portrait-outline', subtitle: mtnNumber }, // Yellow
        { id: 'telecel', name: 'Telecel Cash', color: '#EF4444', icon: 'phone-portrait-outline', subtitle: telecelNumber }, // Red
        { id: 'at', name: 'AT Money', color: '#3B82F6', icon: 'phone-portrait-outline' }, // Blue
        { id: 'card', name: 'Credit Card', color: '#64748B', icon: 'card-outline' }, // Slate
    ];

    // Credit Card State
    const [selectedCardId, setSelectedCardId] = useState<string>('new');
    const [saveCard, setSaveCard] = useState(false);
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

    // Mock Saved Cards State
    const [savedCards] = useState(SAVED_CARDS);

    const handleSelectCard = (cardId: string) => {
        setSelectedCardId(cardId);
        // If selecting a saved card, you might auto-fill or just reference the ID
        if (cardId !== 'new') {
            // Logic to use saved card token, etc.
        }
    };

    // Save Number Feature
    const [saveNumber, setSaveNumber] = useState(false);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('new');

    // Mock Beneficiaries State (could be prop or fetched)
    const [savedBeneficiaries] = useState(SAVED_BENEFICIARIES);

    const handleSelectBeneficiary = (beneficiaryId: string, beneficiary?: typeof SAVED_BENEFICIARIES[0]) => {
        setSelectedBeneficiaryId(beneficiaryId);
        if (beneficiary) {
            setOthersPhoneNumber(beneficiary.number);
            setSelectedNetwork(beneficiary.network);
        } else {
            // Reset if 'new' is selected? Or keep previous? 
            // Usually reset to clean state or keep as is. Let's reset for clarity.
            setOthersPhoneNumber('');
            setSelectedNetwork('MTN');
        }
    };

    // Handlers
    const handleGoBack = () => {
        if (step === 'recipient') {
            onDone();
        } else if (step === 'amount') {
            setStep('recipient');
        } else if (step === 'payment') {
            setStep('amount');
        } else if (step === 'confirm') {
            setStep('payment');
        }
    };

    // PIN Verification Handler
    const handlePinVerify = (pin: string) => {
        console.log('PIN entered:', pin);
        setShowPinSheet(false);
        // Show OTP sheet after PIN
        setTimeout(() => setShowOtpSheet(true), 300);
    };

    // OTP Verification Handler
    const handleOtpVerify = (otp: string) => {
        console.log('OTP entered:', otp);
        setShowOtpSheet(false);
        // Process transaction
        setStep('processing');
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const handleContinue = () => {
        if (step === 'recipient') {
            setStep('amount');
        } else if (step === 'amount') {
            setStep('payment');
        } else if (step === 'payment') {
            setStep('confirm');
        } else if (step === 'confirm') {
            // Show PIN entry instead of directly processing
            setShowPinSheet(true);
        } else {
            onDone();
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
                <TouchableOpacity onPress={handleBack} style={styles.backButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.title}>Purchase Airtime</Text>
                    <Text style={styles.subtitle}>Buy airtime instantly</Text>
                </View>
            </View>

            {/* Success State */}
            {step === 'success' && (
                <TransactionSuccessState
                    message="Airtime Purchased Successfully"
                    subMessage={`GHC ${amount} airtime has been sent to ${recipientType === 'myself' ? 'your number' : othersPhoneNumber || 'the recipient'}.`}
                    onDone={onDone}
                />
            )}

            {/* Error State */}
            {step === 'error' && (
                <TransactionErrorState
                    message={errorMsg || "Something went wrong. Please try again."}
                    onRetry={() => setStep('confirm')}
                    onClose={onDone}
                />
            )}

            {/* Processing State */}
            {step === 'processing' && (
                <LinearGradient colors={[COLORS.primaryLight, COLORS.background]} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', marginBottom: 24, ...SHADOWS.md }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 }}>Processing...</Text>
                    <Text style={{ fontSize: 14, color: COLORS.textGrey }}>Please wait a moment</Text>
                </LinearGradient>
            )}

            {/* Main Content */}
            {step !== 'success' && step !== 'error' && step !== 'processing' && (
                <>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {step === 'recipient' && (
                            <>
                                {/* Recipient Selector Section */}
                                <Text style={styles.sectionHeader}>Who are you buying for?</Text>

                                {/* Myself Card */}
                                <TouchableOpacity
                                    style={[styles.radioCard, recipientType === 'myself' && styles.radioCardSelected]}
                                    onPress={() => setRecipientType('myself')}
                                >
                                    <View style={styles.radioCardContent}>
                                        <View style={styles.radioIconCircle}>
                                            <Ionicons name="person" size={24} color={recipientType === 'myself' ? COLORS.white : COLORS.textDark} />
                                        </View>
                                        <Text style={[styles.radioCardLabel, recipientType === 'myself' && { color: COLORS.white }]}>Myself</Text>
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
                                            <Ionicons name="person" size={24} color={recipientType === 'others' ? COLORS.white : COLORS.textDark} />
                                        </View>
                                        <Text style={[styles.radioCardLabel, recipientType === 'others' && { color: COLORS.white }]}>Others</Text>
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
                                                            <Ionicons name="call" size={24} color={isSelected ? COLORS.white : COLORS.textDark} />
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.phoneText, isSelected && { color: COLORS.white }]}>{item.number}</Text>
                                                            <Text style={[styles.networkText, isSelected && { color: COLORS.white }]}>{item.network}</Text>
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
                                        {/* Saved Beneficiaries Section */}
                                        <Text style={styles.sectionHeader}>Select Recipient</Text>

                                        {savedBeneficiaries.map((bene) => {
                                            const isSelected = selectedBeneficiaryId === bene.id;
                                            return (
                                                <TouchableOpacity
                                                    key={bene.id}
                                                    style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                                                    onPress={() => handleSelectBeneficiary(bene.id, bene)}
                                                >
                                                    <View style={styles.radioCardContent}>
                                                        <View style={{ marginRight: 12 }}>
                                                            <Ionicons name="person-circle-outline" size={32} color={isSelected ? COLORS.white : COLORS.textDark} />
                                                        </View>
                                                        <View>
                                                            <Text style={[styles.radioCardLabel, isSelected && { color: COLORS.white }]}>{bene.name}</Text>
                                                            <Text style={[styles.networkText, isSelected && { color: COLORS.white }]}>{bene.number} ({bene.network})</Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.radioOuter}>
                                                        {isSelected && <View style={styles.radioInner} />}
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })}

                                        {/* New Number Option */}
                                        <TouchableOpacity
                                            style={[styles.radioCard, selectedBeneficiaryId === 'new' && styles.radioCardSelected]}
                                            onPress={() => handleSelectBeneficiary('new')}
                                        >
                                            <View style={styles.radioCardContent}>
                                                <View style={{ marginRight: 12 }}>
                                                    <Ionicons name="add-circle-outline" size={32} color={selectedBeneficiaryId === 'new' ? COLORS.white : COLORS.textDark} />
                                                </View>
                                                <Text style={[styles.radioCardLabel, selectedBeneficiaryId === 'new' && { color: COLORS.white }]}>Enter New Number</Text>
                                            </View>
                                            <View style={styles.radioOuter}>
                                                {selectedBeneficiaryId === 'new' && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>

                                        {selectedBeneficiaryId === 'new' && (
                                            <View style={{ marginTop: 20, marginLeft: 8, borderLeftWidth: 2, borderLeftColor: '#E2E8F0', paddingLeft: 16 }}>
                                                <Text style={styles.fieldLabel}>Choose network</Text>

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

                                                    {/* Save Number Checkbox */}
                                                    <TouchableOpacity
                                                        style={styles.checkboxContainer}
                                                        onPress={() => setSaveNumber(!saveNumber)}
                                                    >
                                                        <Ionicons
                                                            name={saveNumber ? "checkbox" : "square-outline"}
                                                            size={24}
                                                            color={saveNumber ? COLORS.primary : COLORS.textGrey}
                                                        />
                                                        <Text style={styles.checkboxLabel}>Save number for future reference</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </>
                        )}

                        {/* AMOUNT ENTRY STEP  */}
                        {step === 'amount' && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.fieldLabel}>Enter Amount (GHC)</Text>
                                <Text style={styles.helperLabel}>Minimum amount: GHC 1.00</Text>

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
                                                GHC {val}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        )}


                        {/* PAYMENT METHOD STEP */}
                        {step === 'payment' && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.sectionHeader}>Confirm Purchase</Text>

                                {/* Summary Card */}
                                <View style={styles.paymentSummaryCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                                        <View style={styles.paymentIconBox}>
                                            <Ionicons name="phone-portrait-outline" size={24} color={COLORS.textDark} />
                                        </View>
                                    </View>
                                    <Text style={styles.paymentSummaryLabel}>
                                        Buying Airtime For {recipientType === 'myself' ? 'Self' : 'Other'}
                                    </Text>
                                    <Text style={styles.paymentSummaryNumber}>
                                        {recipientType === 'myself'
                                            ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number
                                            : othersPhoneNumber || 'N/A'}
                                    </Text>

                                    {recipientType === 'others' && (
                                        <View style={{ marginTop: 12 }}>
                                            <Text style={styles.paymentSummaryLabel}>Network</Text>
                                            <Text style={styles.paymentSummaryNumber}>{selectedNetwork}</Text>
                                        </View>
                                    )}

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                                        <View>
                                            <Text style={styles.paymentSummaryValueLabel}>Amount to Pay</Text>
                                            <Text style={styles.paymentSummaryValue}>GHC {amount}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Payment Method Selection */}
                                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>Payment Method</Text>

                                {/* Render Payment Methods */}
                                {PAYMENT_METHODS.map((method) => {
                                    const isSelected = paymentMethod === method.id;
                                    return (
                                        <TouchableOpacity
                                            key={method.id}
                                            style={[styles.paymentMethodCard, isSelected && styles.paymentMethodSelected, { marginBottom: 12 }]}
                                            onPress={() => {
                                                setPaymentMethod(method.id as any);
                                                if (method.id === 'card') {
                                                    setShowCardBottomSheet(true);
                                                }
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <View style={[styles.paymentMethodIcon, { backgroundColor: method.color, alignItems: 'center', justifyContent: 'center' }]}>
                                                    <Ionicons name={method.icon as any} size={14} color={COLORS.white} />
                                                </View>
                                                <View>
                                                    <Text style={[styles.paymentMethodText, isSelected && { color: COLORS.white }]}>{method.name}</Text>
                                                    {method.subtitle && (
                                                        <Text style={[styles.networkText, { fontSize: 13, marginTop: 2 }, isSelected && { color: COLORS.white }]}>{method.subtitle}</Text>
                                                    )}
                                                </View>
                                            </View>
                                            <View style={styles.radioOuter}>
                                                {isSelected && <View style={styles.radioInner} />}
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}


                            </View>
                        )}


                        {/* CONFIRMATION STEP */}
                        {step === 'confirm' && (
                            <View style={{ marginTop: 10 }}>
                                <Text style={styles.sectionHeader}>Confirm Details</Text>

                                <View style={styles.detailsContainer}>
                                    {/* Amount */}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Amount</Text>
                                        <Text style={styles.detailValue}>GHC {amount}</Text>
                                    </View>

                                    {/* Recipient Number */}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Recipient Number</Text>
                                        <Text style={styles.detailValue}>
                                            {recipientType === 'myself'
                                                ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number
                                                : othersPhoneNumber || 'N/A'}
                                        </Text>
                                    </View>

                                    {/* Payment Method */}
                                    <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
                                        <Text style={styles.detailLabel}>Payment Method</Text>
                                        <Text style={styles.detailValue}>
                                            {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}
                                        </Text>
                                    </View>
                                </View>

                                {/* Transaction Notice */}
                                <View style={styles.noticeCard}>
                                    <View style={styles.noticeIconCircle}>
                                        <Ionicons name="information-circle" size={22} color={COLORS.primary} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.noticeTitle}>Please Note</Text>
                                        <Text style={styles.noticeText}>This transaction is final and cannot be reversed once confirmed.</Text>
                                    </View>
                                </View>
                            </View>
                        )}


                    </ScrollView>

                    {/* Bottom Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.85}>
                            <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueGradient}>
                                <Text style={styles.continueText}>
                                    {step === 'confirm' ? 'Confirm & Pay' : step === 'payment' ? 'Proceed to Confirm' : 'Continue'}
                                </Text>
                                <Ionicons name="arrow-forward" size={18} color={COLORS.white} style={{ marginLeft: 8 }} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {/* Credit Card Bottom Sheet */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showCardBottomSheet}
                onRequestClose={() => setShowCardBottomSheet(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.bottomSheetContainer}>
                        {/* Header */}
                        <View style={styles.bottomSheetHeader}>
                            <Text style={styles.bottomSheetTitle}>Select Card</Text>
                            <TouchableOpacity onPress={() => setShowCardBottomSheet(false)}>
                                <Ionicons name="close" size={28} color={COLORS.textDark} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.bottomSheetContent} showsVerticalScrollIndicator={false}>
                            {/* Saved Cards */}
                            {savedCards.map((card) => {
                                const isSelected = selectedCardId === card.id;
                                return (
                                    <TouchableOpacity
                                        key={card.id}
                                        style={[styles.radioCard, isSelected && styles.radioCardSelected, { marginBottom: 12 }]}
                                        onPress={() => handleSelectCard(card.id)}
                                    >
                                        <View style={styles.radioCardContent}>
                                            <View style={{ marginRight: 12 }}>
                                                <Ionicons name="card" size={24} color={isSelected ? COLORS.white : COLORS.textDark} />
                                            </View>
                                            <View>
                                                <Text style={[styles.radioCardLabel, isSelected && { color: COLORS.white }]}>{card.type} **** {card.last4}</Text>
                                                <Text style={[styles.networkText, isSelected && { color: COLORS.white }]}>Expires {card.expiry}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.radioOuter}>
                                            {isSelected && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Add New Card Option */}
                            <TouchableOpacity
                                style={[styles.radioCard, selectedCardId === 'new' && styles.radioCardSelected, { marginBottom: 16 }]}
                                onPress={() => handleSelectCard('new')}
                            >
                                <View style={styles.radioCardContent}>
                                    <View style={{ marginRight: 12 }}>
                                        <Ionicons name="add-circle-outline" size={32} color={selectedCardId === 'new' ? COLORS.white : COLORS.textDark} />
                                    </View>
                                    <Text style={[styles.radioCardLabel, selectedCardId === 'new' && { color: COLORS.white }]}>Add New Card</Text>
                                </View>
                                <View style={styles.radioOuter}>
                                    {selectedCardId === 'new' && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>

                            {/* New Card Form */}
                            {selectedCardId === 'new' && (
                                <View style={{ marginTop: 8 }}>
                                    <Text style={styles.fieldLabel}>Card Number</Text>
                                    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
                                        <TextInput
                                            style={[styles.inputText, { flex: 1 }]}
                                            placeholder="0000 0000 0000 0000"
                                            keyboardType="numeric"
                                            value={cardDetails.number}
                                            onChangeText={(text) => setCardDetails({ ...cardDetails, number: text })}
                                        />
                                        <Ionicons name="card-outline" size={24} color={COLORS.textGrey} />
                                    </View>

                                    <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.fieldLabel}>Expiry Date</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={[styles.inputText, { flex: 1 }]}
                                                    placeholder="MM/YY"
                                                    value={cardDetails.expiry}
                                                    onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.fieldLabel}>CVV</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={[styles.inputText, { flex: 1 }]}
                                                    placeholder="123"
                                                    keyboardType="numeric"
                                                    maxLength={4}
                                                    value={cardDetails.cvc}
                                                    onChangeText={(text) => setCardDetails({ ...cardDetails, cvc: text })}
                                                />
                                                <Ionicons name="help-circle-outline" size={24} color={COLORS.textGrey} />
                                            </View>
                                        </View>
                                    </View>

                                    <Text style={styles.fieldLabel}>Cardholder Name</Text>
                                    <View style={[styles.inputContainer, { marginBottom: 16 }]}>
                                        <TextInput
                                            style={[styles.inputText, { flex: 1 }]}
                                            placeholder="John Doe"
                                            value={cardDetails.name}
                                            onChangeText={(text) => setCardDetails({ ...cardDetails, name: text })}
                                        />
                                    </View>

                                    {/* Save Card Checkbox */}
                                    <TouchableOpacity
                                        style={styles.checkboxContainer}
                                        onPress={() => setSaveCard(!saveCard)}
                                    >
                                        <Ionicons
                                            name={saveCard ? "checkbox" : "square-outline"}
                                            size={24}
                                            color={saveCard ? COLORS.primary : COLORS.textGrey}
                                        />
                                        <Text style={styles.checkboxLabel}>Save card for future</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </ScrollView>

                        {/* Confirm Button */}
                        <View style={styles.bottomSheetFooter}>
                            <TouchableOpacity style={styles.continueButton} onPress={() => setShowCardBottomSheet(false)} activeOpacity={0.85}>
                                <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.continueGradient}>
                                    <Text style={styles.continueText}>Confirm</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* PIN Entry Bottom Sheet */}
            <PinEntryBottomSheet
                visible={showPinSheet}
                onClose={() => setShowPinSheet(false)}
                onVerify={handlePinVerify}
            />

            {/* OTP Entry Bottom Sheet */}
            <OtpEntryBottomSheet
                visible={showOtpSheet}
                onClose={() => setShowOtpSheet(false)}
                onVerify={handleOtpVerify}
                phoneNumber={recipientType === 'myself' ? MY_NUMBERS.find(n => n.id === selectedNumberId)?.number : othersPhoneNumber}
            />

        </View >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 14 },
    backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', ...SHADOWS.sm },
    title: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    subtitle: { fontSize: 13, color: COLORS.textGrey },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 110 },

    sectionHeader: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

    radioCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16, padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 14,
        marginBottom: 12, borderWidth: 1.5, borderColor: 'transparent',
        ...SHADOWS.sm,
    },
    radioCardSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    radioCardContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    radioIconCircle: { marginRight: 12 },
    radioCardLabel: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
    radioOuter: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
    phoneText: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
    networkText: { fontSize: 12, fontWeight: '600', color: COLORS.textGrey },

    footer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: COLORS.white, padding: 20, paddingBottom: 32,
        borderTopLeftRadius: 20, borderTopRightRadius: 20, ...SHADOWS.lg,
    },
    continueButton: { borderRadius: 16, overflow: 'hidden', ...SHADOWS.primary },
    continueGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18 },
    continueText: { color: COLORS.white, fontSize: 17, fontWeight: '700' },

    dropdownSelector: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 14, padding: 16, backgroundColor: COLORS.white, ...SHADOWS.sm,
    },
    networkIconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.mtn, marginRight: 12 },
    dropdownText: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textDark },
    fieldLabel: { fontSize: 13, fontWeight: '700', color: COLORS.textGrey, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderRadius: 14, padding: 16, backgroundColor: COLORS.white, ...SHADOWS.sm,
    },
    inputText: { fontSize: 16, fontWeight: '500', color: COLORS.textDark },
    dropdownList: { borderRadius: 14, backgroundColor: COLORS.white, marginTop: 4, overflow: 'hidden', ...SHADOWS.md },
    dropdownOption: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    },
    dropdownOptionText: { fontSize: 15, color: COLORS.textDark, fontWeight: '600' },
    helperLabel: { fontSize: 12, color: COLORS.textGrey, marginBottom: 8 },

    amountInputContainer: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, ...SHADOWS.md },
    amountInput: { fontSize: 40, fontWeight: '800', color: COLORS.textDark, textAlign: 'center', minWidth: 100 },
    chipsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    chip: { flex: 1, paddingVertical: 11, backgroundColor: COLORS.white, borderRadius: 12, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.border },
    chipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { fontWeight: '700', color: COLORS.textGrey, fontSize: 13 },
    chipTextSelected: { color: COLORS.white },

    paymentSummaryCard: { backgroundColor: COLORS.white, borderRadius: 20, padding: 20, marginBottom: 20, ...SHADOWS.sm },
    paymentIconBox: { backgroundColor: COLORS.primaryLight, padding: 10, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
    paymentSummaryLabel: { fontSize: 12, color: COLORS.textGrey, marginBottom: 4 },
    paymentSummaryNumber: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
    paymentSummaryValueLabel: { fontSize: 12, color: COLORS.textGrey, marginBottom: 2 },
    paymentSummaryValue: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
    paymentMethodCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.white, borderRadius: 16, padding: 16,
        borderWidth: 1.5, borderColor: 'transparent', ...SHADOWS.sm,
    },
    paymentMethodSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    paymentMethodIcon: { width: 36, height: 36, borderRadius: 18, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
    paymentMethodText: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },

    detailsContainer: { backgroundColor: COLORS.white, borderRadius: 20, marginBottom: 16, overflow: 'hidden', ...SHADOWS.sm },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, alignItems: 'center' },
    detailLabel: { fontSize: 13, fontWeight: '500', color: COLORS.textGrey, flex: 1 },
    detailValue: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, textAlign: 'right', flex: 1.5 },
    noticeCard: { backgroundColor: '#EFF6FF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 16 },
    noticeIconCircle: { marginTop: 1 },
    noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 3 },
    noticeText: { fontSize: 12, color: COLORS.textMid, lineHeight: 18, flex: 1 },

    checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
    checkboxLabel: { fontSize: 14, color: COLORS.textMid, flex: 1 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    bottomSheetContainer: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', paddingTop: 8 },
    bottomSheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    bottomSheetTitle: { fontSize: 18, fontWeight: '800', color: COLORS.textDark },
    bottomSheetContent: { padding: 20, maxHeight: '70%' },
    bottomSheetFooter: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border },
    balanceSection: { backgroundColor: COLORS.primaryLight, borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 24 },
});

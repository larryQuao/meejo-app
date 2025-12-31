import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

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

// Mock Data Packages
const DATA_PACKAGES = [
    { id: 'd1', name: 'Daily Mashup', volume: '500MB', price: '3', validity: '24 Hours' },
    { id: 'd2', name: 'Weekly Surf', volume: '2.5GB', price: '15', validity: '7 Days' },
    { id: 'd3', name: 'Monthly Standard', volume: '10GB', price: '50', validity: '30 Days' },
    { id: 'd4', name: 'Streaming King', volume: '40GB', price: '150', validity: '30 Days' },
];

export default function DataPurchaseFlow({ onDone }: { onDone: () => void }) {
    const [recipientType, setRecipientType] = useState<'myself' | 'others'>('myself');
    const [selectedNumberId, setSelectedNumberId] = useState<string>(MY_NUMBERS[0].id);

    // Dropdown State
    const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false);
    const [selectedNetwork, setSelectedNetwork] = useState('MTN');
    const NETWORKS = ['MTN', 'Telecel', 'AT'];

    // Flow State
    const [step, setStep] = useState<'recipient' | 'package' | 'payment' | 'confirm'>('recipient');

    // Package State
    const [selectedPackageId, setSelectedPackageId] = useState<string>(DATA_PACKAGES[1].id);
    const [othersPhoneNumber, setOthersPhoneNumber] = useState('');

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState<'momo' | 'telecel' | 'at' | 'card'>('momo');

    const PAYMENT_METHODS = [
        { id: 'momo', name: 'MTN Mobile Money', color: '#FCD34D', icon: 'phone-portrait-outline' }, // Yellow
        { id: 'telecel', name: 'Telecel Cash', color: '#EF4444', icon: 'phone-portrait-outline' }, // Red
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
    };

    // Save Number Feature
    const [saveNumber, setSaveNumber] = useState(false);
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState<string>('new');

    // Mock Beneficiaries State
    const [savedBeneficiaries] = useState(SAVED_BENEFICIARIES);

    const handleSelectBeneficiary = (beneficiaryId: string, beneficiary?: typeof SAVED_BENEFICIARIES[0]) => {
        setSelectedBeneficiaryId(beneficiaryId);
        if (beneficiary) {
            setOthersPhoneNumber(beneficiary.number);
            setSelectedNetwork(beneficiary.network);
        } else {
            setOthersPhoneNumber('');
            setSelectedNetwork('MTN');
        }
    };

    // Handlers
    const handleContinue = () => {
        if (step === 'recipient') {
            setStep('package');
        } else if (step === 'package') {
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
            setStep('package');
        } else if (step === 'package') {
            setStep('recipient');
        } else {
            onDone(); // Exit flow
        }
    };

    const selectedPkg = DATA_PACKAGES.find(p => p.id === selectedPackageId);

    return (
        <View style={styles.container}>
            {/* Header Area */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back-circle-outline" size={32} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.title}>Purchase Data</Text>
                    <Text style={styles.subtitle}>
                        {step === 'package'
                            ? `Select data bundle for ${recipientType === 'myself' ? 'self' : 'others'}`
                            : 'Buy data instantly'}
                    </Text>
                </View>
            </View>

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
                                                    <Ionicons name="person-circle-outline" size={32} color={COLORS.textDark} />
                                                </View>
                                                <View>
                                                    <Text style={styles.radioCardLabel}>{bene.name}</Text>
                                                    <Text style={styles.networkText}>{bene.number} ({bene.network})</Text>
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
                                            <Ionicons name="add-circle-outline" size={32} color={COLORS.textDark} />
                                        </View>
                                        <Text style={styles.radioCardLabel}>Enter New Number</Text>
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

                {/* PACKAGE SELECTION STEP (Replaces Amount) */}
                {step === 'package' && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.fieldLabel}>Select Data Bundle</Text>
                        <Text style={styles.helperLabel}>Choose a package that suits your needs</Text>

                        {DATA_PACKAGES.map((pkg) => {
                            const isSelected = selectedPackageId === pkg.id;
                            return (
                                <TouchableOpacity
                                    key={pkg.id}
                                    style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                                    onPress={() => setSelectedPackageId(pkg.id)}
                                >
                                    <View style={[styles.radioCardContent, { flex: 1 }]}>
                                        <View style={{ marginRight: 12 }}>
                                            <Ionicons name="wifi" size={24} color={COLORS.textDark} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Text style={styles.radioCardLabel}>{pkg.name}</Text>
                                                <Text style={[styles.radioCardLabel, { color: COLORS.primary }]}>{pkg.volume}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                                                <Text style={styles.networkText}>{pkg.validity}</Text>
                                                <Text style={styles.networkText}>GHC {pkg.price}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.radioOuter, { marginLeft: 12 }]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
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
                                    <Ionicons name="wifi-outline" size={24} color={COLORS.textDark} />
                                </View>
                            </View>
                            <Text style={styles.paymentSummaryLabel}>
                                Buying Data ({selectedPkg?.volume}) For {recipientType === 'myself' ? 'Self' : 'Other'}
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
                                    <Text style={styles.paymentSummaryValue}>GHC {selectedPkg?.price}</Text>
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
                                    onPress={() => setPaymentMethod(method.id as any)}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={[styles.paymentMethodIcon, { backgroundColor: method.color, alignItems: 'center', justifyContent: 'center' }]}>
                                            <Ionicons name={method.icon as any} size={14} color={COLORS.white} />
                                        </View>
                                        <Text style={styles.paymentMethodText}>{method.name}</Text>
                                    </View>
                                    <View style={styles.radioOuter}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}

                        {/* Credit Card Specific Flow */}
                        {paymentMethod === 'card' && (
                            <View style={{ marginTop: 24 }}>
                                <Text style={styles.sectionHeader}>Select Card</Text>

                                {savedCards.map((card) => {
                                    const isSelected = selectedCardId === card.id;
                                    return (
                                        <TouchableOpacity
                                            key={card.id}
                                            style={[styles.radioCard, isSelected && styles.radioCardSelected]}
                                            onPress={() => handleSelectCard(card.id)}
                                        >
                                            <View style={styles.radioCardContent}>
                                                <View style={{ marginRight: 12 }}>
                                                    <Ionicons name="card" size={24} color={COLORS.textDark} />
                                                </View>
                                                <View>
                                                    <Text style={styles.radioCardLabel}>{card.type} **** {card.last4}</Text>
                                                    <Text style={styles.networkText}>Expires {card.expiry}</Text>
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
                                    style={[styles.radioCard, selectedCardId === 'new' && styles.radioCardSelected]}
                                    onPress={() => handleSelectCard('new')}
                                >
                                    <View style={styles.radioCardContent}>
                                        <View style={{ marginRight: 12 }}>
                                            <Ionicons name="add-circle-outline" size={32} color={COLORS.textDark} />
                                        </View>
                                        <Text style={styles.radioCardLabel}>Add New Card</Text>
                                    </View>
                                    <View style={styles.radioOuter}>
                                        {selectedCardId === 'new' && <View style={styles.radioInner} />}
                                    </View>
                                </TouchableOpacity>

                                {selectedCardId === 'new' && (
                                    <View style={{ marginTop: 20, marginLeft: 8, borderLeftWidth: 2, borderLeftColor: '#E2E8F0', paddingLeft: 16 }}>
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
                                        <View style={styles.inputContainer}>
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
                            </View>
                        )}
                    </View>
                )}


                {/* CONFIRMATION STEP */}
                {step === 'confirm' && (
                    <View style={{ marginTop: 10 }}>
                        <Text style={styles.sectionHeader}>Confirm Details</Text>

                        <View style={styles.detailsContainer}>
                            {/* Package */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Package</Text>
                                <Text style={styles.detailValue}>{selectedPkg?.name}</Text>
                            </View>
                            {/* Volume */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Volume</Text>
                                <Text style={styles.detailValue}>{selectedPkg?.volume}</Text>
                            </View>

                            {/* Amount */}
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Price</Text>
                                <Text style={styles.detailValue}>GHC {selectedPkg?.price}</Text>
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
                            <View style={styles.noticeIconCircle} />
                            <Text style={styles.noticeTitle}>Transaction Notice</Text>
                            <Text style={styles.noticeText}>Transactions are final and cannot be reversed.</Text>
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
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        alignSelf: 'flex-start',
        marginLeft: -4,
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

    // Use same styles as Exchange flows for consistency
    sectionHeader: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 12,
    },
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
    helperLabel: {
        fontSize: 12,
        color: COLORS.textGrey,
        marginBottom: 8,
    },
    paymentSummaryCard: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 4,
        padding: 16,
    },
    paymentIconBox: {
        backgroundColor: '#E0F2FE', // Light blue
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

    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 14,
        color: COLORS.textDark,
    },
});

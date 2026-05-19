import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface PinEntryBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onVerify: (pin: string) => void;
}

const PinEntryBottomSheet: React.FC<PinEntryBottomSheetProps> = ({ visible, onClose, onVerify }) => {
    const [pin, setPin] = useState(['', '', '', '']);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    // Reset PIN when modal opens
    useEffect(() => {
        if (visible) {
            setPin(['', '', '', '']);
            setTimeout(() => inputRefs[0].current?.focus(), 100);
        }
    }, [visible]);

    const handlePinChange = (value: string, index: number) => {
        if (value.length > 1) return; // Only allow single digit

        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !pin[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerify = () => {
        const fullPin = pin.join('');
        if (fullPin.length === 4) {
            onVerify(fullPin);
        }
    };

    const isPinComplete = pin.every(digit => digit !== '');

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.bottomSheetContainer}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={28} color={COLORS.textDark} />
                    </TouchableOpacity>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.logoText}>M</Text>
                    </View>
                    <Text style={styles.brandText}>meejo</Text>

                    {/* Title */}
                    <Text style={styles.title}>Enter Your Meejo Pin</Text>
                    <Text style={styles.subtitle}>Enter Pin</Text>

                    {/* PIN Inputs */}
                    <View style={styles.pinContainer}>
                        {pin.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs[index]}
                                style={styles.pinInput}
                                value={digit}
                                onChangeText={(value) => handlePinChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                secureTextEntry
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[styles.verifyButton, !isPinComplete && styles.verifyButtonDisabled]}
                        onPress={handleVerify}
                        disabled={!isPinComplete}
                    >
                        <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheetContainer: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
        padding: 8,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    brandText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginTop: 32,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textGrey,
        marginTop: 8,
        marginBottom: 32,
    },
    pinContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    pinInput: {
        width: 60,
        height: 60,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: COLORS.textDark,
    },
    verifyButton: {
        width: '100%',
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
    },
    verifyButtonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowOpacity: 0,
    },
    verifyButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
    },
});

export default PinEntryBottomSheet;

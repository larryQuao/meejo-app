import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface OtpEntryBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onVerify: (otp: string) => void;
    phoneNumber?: string;
}

const OtpEntryBottomSheet: React.FC<OtpEntryBottomSheetProps> = ({ visible, onClose, onVerify, phoneNumber }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const inputRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ];

    // Reset OTP when modal opens
    useEffect(() => {
        if (visible) {
            setOtp(['', '', '', '']);
            setTimeout(() => inputRefs[0].current?.focus(), 100);
        }
    }, [visible]);

    const handleOtpChange = (value: string, index: number) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            inputRefs[index + 1].current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    const handleVerify = () => {
        const fullOtp = otp.join('');
        if (fullOtp.length === 4) {
            onVerify(fullOtp);
        }
    };

    const isOtpComplete = otp.every(digit => digit !== '');

    // Mask phone number for display
    const maskedPhone = phoneNumber ? phoneNumber.replace(/(\d{4})(\d{2})(\d{3})(\d{4})/, '$1 $2 XXX $4') : '';

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
                    <Text style={styles.title}>Enter OTP</Text>
                    <Text style={styles.subtitle}>OTP sent to {maskedPhone}</Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs[index]}
                                style={styles.otpInput}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity
                        style={[styles.verifyButton, !isOtpComplete && styles.verifyButtonDisabled]}
                        onPress={handleVerify}
                        disabled={!isOtpComplete}
                    >
                        <Text style={styles.verifyButtonText}>Verify</Text>
                    </TouchableOpacity>

                    {/* Resend OTP */}
                    <TouchableOpacity style={styles.resendButton}>
                        <Text style={styles.resendText}>Resend OTP</Text>
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
    otpContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    otpInput: {
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
    resendButton: {
        marginTop: 16,
        padding: 8,
    },
    resendText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default OtpEntryBottomSheet;

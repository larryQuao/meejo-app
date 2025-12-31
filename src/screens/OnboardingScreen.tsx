import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface OnboardingScreenProps {
    onNext: () => void;
}

const { width } = Dimensions.get('window');

export default function OnboardingScreen({ onNext }: OnboardingScreenProps) {
    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Illustration Area */}
            <View style={styles.illustrationContainer}>
                {/* Abstract Network Logos with arrows */}
                <View style={styles.networkSwapContainer}>
                    <View style={[styles.networkCircle, { backgroundColor: '#E0E7FF' }]}>
                        <Text style={styles.networkText}>TELCO 1</Text>
                    </View>

                    <View style={styles.arrowsContainer}>
                        <Ionicons name="arrow-forward" size={32} color={COLORS.primary} style={[styles.arrow, { transform: [{ rotate: '-30deg' }] }]} />
                        <Ionicons name="arrow-back" size={32} color={COLORS.success} style={[styles.arrow, { transform: [{ rotate: '-30deg' }], marginTop: 8 }]} />
                    </View>

                    <View style={[styles.networkCircle, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.networkText, { color: COLORS.success }]}>TELCO 2</Text>
                    </View>
                </View>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                <Text style={styles.headline}>Exchange With Ease</Text>
                <Text style={styles.bodyText}>
                    Swap your airtime or data from one network to another, hassle-free.
                </Text>

                <View style={styles.progressContainer}>
                    <View style={styles.dot} />
                    <View style={[styles.dot, styles.activeDot]} />
                    <View style={styles.dot} />
                </View>

                <TouchableOpacity style={styles.button} onPress={onNext}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 24,
    },
    illustrationContainer: {
        flex: 0.6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    networkSwapContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    networkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    networkText: {
        fontWeight: '800',
        color: COLORS.primary,
        fontSize: 12,
    },
    arrowsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrow: {
        shadowColor: COLORS.white,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    contentContainer: {
        flex: 0.4,
        alignItems: 'center',
    },
    headline: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: 'System',
    },
    bodyText: {
        fontSize: 16,
        color: COLORS.textGrey,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 16,
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 40,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CBD5E1',
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 24,
    },
    button: {
        backgroundColor: COLORS.primary,
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

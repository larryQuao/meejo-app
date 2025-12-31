import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar as RNStatusBar } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import AirtimeExchangeFlow from './AirtimeExchangeFlow';
import DataExchangeFlow from './DataExchangeFlow';

// Mock Recent Activity for Exchange
const recentExchanges = [
    { id: 1, title: 'Airtime to Data', date: 'Today, 10:23 AM', amount: 'GHC 50.00', status: 'Success' },
    { id: 2, title: 'Data to Airtime', date: 'Yesterday', amount: '20 GB', status: 'Pending' },
];

// ... (imports remain the same, recentExchanges remains same)

interface ExchangeScreenProps {
    setTabBarVisible?: (visible: boolean) => void;
}

export default function ExchangeScreen({ setTabBarVisible }: ExchangeScreenProps) {
    const [viewMode, setViewMode] = useState<'menu' | 'airtime_flow' | 'data_flow'>('menu');

    // Manage Tab Bar Visibility
    React.useEffect(() => {
        if (viewMode === 'menu') {
            setTabBarVisible?.(true);
        } else {
            setTabBarVisible?.(false);
        }
    }, [viewMode]);

    // FLOW RENDERER
    if (viewMode === 'airtime_flow') {
        return (
            <View style={styles.container}>
                {/* Header is handled inside Flow usually, or we can keep a unified one here. 
                    AirtimeExchangeFlow has its own header now as per wireframe. 
                    So we just render the flow. 
                */}
                <AirtimeExchangeFlow onDone={() => setViewMode('menu')} />
            </View>
        );
    }

    // Data Flow
    if (viewMode === 'data_flow') {
        return (
            <View style={styles.container}>
                <DataExchangeFlow onDone={() => setViewMode('menu')} />
            </View>
        );
    }

    // MENU RENDERER
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Exchange</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Helper Text */}
                <Text style={styles.helperText}>Select exchange type to proceed</Text>

                {/* Action Cards Row */}
                <View style={styles.cardRow}>
                    {/* Airtime Card */}
                    <TouchableOpacity style={styles.actionCard} onPress={() => setViewMode('airtime_flow')}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="phone-portrait-outline" size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Exchange{"\n"}Airtime</Text>
                        <Text style={styles.cardSubtitle}>Swap airtime for data or cash</Text>
                    </TouchableOpacity>

                    {/* Data Card */}
                    <TouchableOpacity style={styles.actionCard} onPress={() => setViewMode('data_flow')}>
                        <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="wifi-outline" size={32} color={COLORS.success} />
                        </View>
                        <Text style={styles.cardTitle}>Exchange{"\n"}Data</Text>
                        <Text style={styles.cardSubtitle}>Turn your data bundle into airtime</Text>
                    </TouchableOpacity>
                </View>

                {/* CTA / Discount Card */}
                <View style={styles.promoCard}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.promoBadge}>
                            <Text style={styles.promoBadgeText}>Special Offer</Text>
                        </View>
                        <Text style={styles.promoTitle}>Get 5% Discount</Text>
                        <Text style={styles.promoText}>On all Data to Airtime exchanges this weekend!</Text>
                    </View>
                    <Ionicons name="gift-outline" size={48} color={COLORS.white} style={{ opacity: 0.9 }} />
                </View>

                {/* Recent Exchanges */}
                <Text style={styles.sectionTitle}>Recent Exchanges</Text>
                <View style={styles.recentList}>
                    {recentExchanges.map((item) => (
                        <View key={item.id} style={styles.recentItem}>
                            <View style={styles.recentIconCircle}>
                                <Ionicons name="swap-horizontal" size={20} color={COLORS.textGrey} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.recentTitle}>{item.title}</Text>
                                <Text style={styles.recentDate}>{item.date}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.recentAmount}>{item.amount}</Text>
                                <Text style={[styles.recentStatus, { color: item.status === 'Success' ? COLORS.success : '#F59E0B' }]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Support Link or FAQ Link */}
                <TouchableOpacity style={styles.faqLink}>
                    <Text style={styles.faqText}>Need help with exchange?</Text>
                    <Ionicons name="help-circle-outline" size={16} color={COLORS.primary} />
                </TouchableOpacity>

            </ScrollView>
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
        alignItems: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10,
    },
    backButton: {
        paddingRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    headerTitleInline: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    helperText: {
        textAlign: 'center',
        color: COLORS.textGrey,
        marginBottom: 24,
    },

    // Cards
    cardRow: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 11,
        color: COLORS.textGrey,
        textAlign: 'center',
    },

    // Promo
    promoCard: {
        backgroundColor: '#3B82F6', // A nice blue
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    promoBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    promoBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    promoTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    promoText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
    },

    // Recent
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 16,
    },
    recentList: {
        gap: 12,
        marginBottom: 24,
    },
    recentItem: {
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    recentIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDark,
    },
    recentDate: {
        fontSize: 12,
        color: COLORS.textGrey,
    },
    recentAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    recentStatus: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },

    // FAQ
    faqLink: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    faqText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});

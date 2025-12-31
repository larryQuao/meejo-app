import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import AirtimePurchaseFlow from './AirtimePurchaseFlow';
import DataPurchaseFlow from './DataPurchaseFlow';

interface PurchaseScreenProps {
    setTabBarVisible?: (visible: boolean) => void;
}

export default function PurchaseScreen({ setTabBarVisible }: PurchaseScreenProps) {
    const [viewMode, setViewMode] = useState<'menu' | 'airtime_flow' | 'data_flow'>('menu');

    // Manage Tab Bar Visibility
    React.useEffect(() => {
        if (viewMode === 'menu') {
            setTabBarVisible?.(true);
        } else {
            setTabBarVisible?.(false);
        }
    }, [viewMode]);

    if (viewMode === 'airtime_flow') {
        return (
            <View style={styles.container}>
                <AirtimePurchaseFlow onDone={() => setViewMode('menu')} />
            </View>
        );
    }

    if (viewMode === 'data_flow') {
        return (
            <View style={styles.container}>
                <DataPurchaseFlow onDone={() => setViewMode('menu')} />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Purchase</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Promo Banner */}
                <View style={styles.bannerContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.bannerTitle}>Buy More, Save More</Text>
                        <Text style={styles.bannerSubtitle}>Get 10% bonus on all data bundles above GHC 50</Text>
                    </View>
                    <MaterialCommunityIcons name="star-circle-outline" size={40} color={COLORS.white} />
                </View>

                {/* Purchase Options */}
                <Text style={styles.sectionTitle}>What do you want to buy?</Text>

                <View style={styles.optionsGrid}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => setViewMode('airtime_flow')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#E0F2FE' }]}>
                            <Ionicons name="phone-portrait-outline" size={32} color={COLORS.primary} />
                        </View>
                        <Text style={styles.optionTitle}>Airtime</Text>
                        <Text style={styles.optionSubtitle}>Top up for yourself or others</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => setViewMode('data_flow')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                            <Ionicons name="wifi-outline" size={32} color={COLORS.success} />
                        </View>
                        <Text style={styles.optionTitle}>Data Bundle</Text>
                        <Text style={styles.optionSubtitle}>Weekly, monthly, & mashup</Text>
                    </TouchableOpacity>
                </View>



                {/* Recent Transactions */}
                <View style={[styles.sectionHeader, { marginTop: 32 }]}>
                    <Text style={styles.sectionTitle}>Recent Purchases</Text>
                    <TouchableOpacity>
                        <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 12 }}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recentList}>
                    <View style={styles.recentItem}>
                        <View style={styles.recentIconCircle}>
                            <Ionicons name="phone-portrait-outline" size={20} color={COLORS.textGrey} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.recentTitle}>Airtime - MTN</Text>
                            <Text style={styles.recentDate}>Today, 09:41 AM</Text>
                        </View>
                        <Text style={styles.recentAmount}>GHC 10.00</Text>
                    </View>

                    <View style={styles.recentItem}>
                        <View style={styles.recentIconCircle}>
                            <Ionicons name="wifi-outline" size={20} color={COLORS.textGrey} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.recentTitle}>Data Bundle - 5GB</Text>
                            <Text style={styles.recentDate}>Yesterday, 2:30 PM</Text>
                        </View>
                        <Text style={styles.recentAmount}>GHC 25.00</Text>
                    </View>
                </View>

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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textDark,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    bannerContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    bannerTitle: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: '#94A3B8',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    // Grid
    optionsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    optionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
        textAlign: 'center',
    },

    optionSubtitle: {
        fontSize: 11,
        color: COLORS.textGrey,
        textAlign: 'center',
    },

    // Recent
    recentList: {
        gap: 12,
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
});

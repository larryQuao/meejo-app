import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import AirtimeExchangeFlow from './AirtimeExchangeFlow';
import DataExchangeFlow from './DataExchangeFlow';
import AirtimePurchaseFlow from './AirtimePurchaseFlow';
import DataPurchaseFlow from './DataPurchaseFlow';

const recentExchanges = [
    { id: 1, title: 'Airtime to Data', date: 'Today, 10:23 AM', amount: 'GHC 50.00', status: 'Success', statusColor: COLORS.success },
    { id: 2, title: 'Data to Airtime', date: 'Yesterday, 3:15 PM', amount: '20 GB', status: 'Pending', statusColor: COLORS.warning },
];

interface ExchangeScreenProps {
    setTabBarVisible?: (visible: boolean) => void;
}

export default function ExchangeScreen({ setTabBarVisible }: ExchangeScreenProps) {
    const [viewMode, setViewMode] = useState<'menu' | 'airtime_flow' | 'data_flow' | 'airtime_purchase' | 'data_purchase'>('menu');

    React.useEffect(() => {
        setTabBarVisible?.(viewMode === 'menu');
    }, [viewMode]);

    if (viewMode === 'airtime_purchase') {
        return <View style={styles.container}><AirtimePurchaseFlow onDone={() => setViewMode('menu')} /></View>;
    }
    if (viewMode === 'data_purchase') {
        return <View style={styles.container}><DataPurchaseFlow onDone={() => setViewMode('menu')} /></View>;
    }
    if (viewMode === 'airtime_flow') {
        return (
            <View style={styles.container}>
                <AirtimeExchangeFlow onDone={() => setViewMode('menu')} onPurchaseAirtime={() => setViewMode('airtime_purchase')} />
            </View>
        );
    }
    if (viewMode === 'data_flow') {
        return (
            <View style={styles.container}>
                <DataExchangeFlow onDone={() => setViewMode('menu')} onPurchaseData={() => setViewMode('data_purchase')} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Exchange</Text>
                <Text style={styles.headerSub}>Swap airtime and data instantly</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Action Cards */}
                <View style={styles.cardRow}>
                    <TouchableOpacity style={[styles.actionCard, SHADOWS.md]} onPress={() => setViewMode('airtime_flow')} activeOpacity={0.8}>
                        <LinearGradient colors={['#EEF3FF', '#DBEAFE']} style={styles.cardIconWrap}>
                            <Ionicons name="phone-portrait-outline" size={30} color={COLORS.primary} />
                        </LinearGradient>
                        <Text style={styles.cardTitle}>Exchange{"\n"}Airtime</Text>
                        <Text style={styles.cardSub}>Swap airtime for data</Text>
                        <View style={styles.cardArrow}>
                            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionCard, SHADOWS.md]} onPress={() => setViewMode('data_flow')} activeOpacity={0.8}>
                        <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={styles.cardIconWrap}>
                            <Ionicons name="wifi-outline" size={30} color={COLORS.success} />
                        </LinearGradient>
                        <Text style={styles.cardTitle}>Exchange{"\n"}Data</Text>
                        <Text style={styles.cardSub}>Turn data into airtime</Text>
                        <View style={[styles.cardArrow, { backgroundColor: COLORS.successLight }]}>
                            <Ionicons name="arrow-forward" size={14} color={COLORS.success} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Promo Card */}
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.promoCard, SHADOWS.primary]}
                >
                    <View style={styles.promoDec} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.promoBadge}>
                            <Text style={styles.promoBadgeText}>Limited Time</Text>
                        </View>
                        <Text style={styles.promoTitle}>5% Bonus This Weekend</Text>
                        <Text style={styles.promoSub}>On all Data to Airtime exchanges</Text>
                    </View>
                    <Ionicons name="gift-outline" size={44} color="rgba(255,255,255,0.25)" />
                </LinearGradient>

                {/* Recent Exchanges */}
                <Text style={styles.sectionTitle}>Recent Exchanges</Text>
                <View style={styles.recentList}>
                    {recentExchanges.map((item) => (
                        <View key={item.id} style={[styles.recentCard, SHADOWS.sm]}>
                            <View style={styles.recentIconWrap}>
                                <Ionicons name="swap-horizontal" size={20} color={COLORS.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.recentTitle}>{item.title}</Text>
                                <Text style={styles.recentDate}>{item.date}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.recentAmount}>{item.amount}</Text>
                                <Text style={[styles.recentStatus, { color: item.statusColor }]}>{item.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.faqRow}>
                    <Ionicons name="help-circle-outline" size={18} color={COLORS.primary} />
                    <Text style={styles.faqText}>Need help with exchanges?</Text>
                    <Ionicons name="chevron-forward" size={16} color={COLORS.textLight} />
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
    headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
    headerSub: { fontSize: 14, color: COLORS.textGrey },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },

    cardRow: { flexDirection: 'row', gap: 14, marginBottom: 20 },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 18,
        alignItems: 'flex-start',
    },
    cardIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    cardTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, lineHeight: 21, marginBottom: 4 },
    cardSub: { fontSize: 11, color: COLORS.textGrey, marginBottom: 14 },
    cardArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    promoCard: {
        borderRadius: 20,
        padding: 22,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        overflow: 'hidden',
    },
    promoDec: {
        position: 'absolute',
        top: -30,
        right: 80,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    promoBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    promoBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
    promoTitle: { color: COLORS.white, fontSize: 17, fontWeight: '800', marginBottom: 4 },
    promoSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

    sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
    recentList: { gap: 12, marginBottom: 20 },
    recentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    recentIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 3 },
    recentDate: { fontSize: 12, color: COLORS.textGrey },
    recentAmount: { fontSize: 14, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
    recentStatus: { fontSize: 11, fontWeight: '700' },

    faqRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'center',
        paddingVertical: 12,
    },
    faqText: { color: COLORS.primary, fontSize: 14, fontWeight: '600', flex: 1 },
});

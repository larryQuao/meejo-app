import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import AirtimePurchaseFlow from './AirtimePurchaseFlow';
import DataPurchaseFlow from './DataPurchaseFlow';

interface PurchaseScreenProps {
    setTabBarVisible?: (visible: boolean) => void;
}

const recentPurchases = [
    { id: 1, title: 'Airtime · MTN', date: 'Today, 09:41 AM', amount: 'GHC 10.00', icon: 'phone-portrait-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
    { id: 2, title: 'Data Bundle · 5GB', date: 'Yesterday, 2:30 PM', amount: 'GHC 25.00', icon: 'wifi-outline', iconBg: COLORS.successLight, iconColor: COLORS.success },
];

export default function PurchaseScreen({ setTabBarVisible }: PurchaseScreenProps) {
    const [viewMode, setViewMode] = useState<'menu' | 'airtime_flow' | 'data_flow'>('menu');

    React.useEffect(() => {
        setTabBarVisible?.(viewMode === 'menu');
    }, [viewMode]);

    if (viewMode === 'airtime_flow') {
        return <View style={styles.container}><AirtimePurchaseFlow onDone={() => setViewMode('menu')} /></View>;
    }
    if (viewMode === 'data_flow') {
        return <View style={styles.container}><DataPurchaseFlow onDone={() => setViewMode('menu')} /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Purchase Hub</Text>
                <Text style={styles.headerSub}>Buy airtime & data in seconds</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Promo Banner */}
                <LinearGradient
                    colors={[COLORS.primaryDark, COLORS.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.banner, SHADOWS.primary]}
                >
                    <View style={styles.bannerDec} />
                    <View style={{ flex: 1 }}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Buy More, Save More</Text>
                        </View>
                        <Text style={styles.bannerTitle}>10% Bonus on Data</Text>
                        <Text style={styles.bannerSub}>On all bundles above GHC 50</Text>
                    </View>
                    <Ionicons name="star-outline" size={44} color="rgba(255,255,255,0.2)" />
                </LinearGradient>

                {/* What to buy */}
                <Text style={styles.sectionTitle}>What would you like to buy?</Text>

                <View style={styles.optionsRow}>
                    <TouchableOpacity style={[styles.optionCard, SHADOWS.md]} onPress={() => setViewMode('airtime_flow')} activeOpacity={0.8}>
                        <LinearGradient colors={['#EEF3FF', '#DBEAFE']} style={styles.optionIconWrap}>
                            <Ionicons name="phone-portrait-outline" size={30} color={COLORS.primary} />
                        </LinearGradient>
                        <Text style={styles.optionTitle}>Airtime</Text>
                        <Text style={styles.optionSub}>Top up yourself or others</Text>
                        <View style={styles.optionArrow}>
                            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.optionCard, SHADOWS.md]} onPress={() => setViewMode('data_flow')} activeOpacity={0.8}>
                        <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={styles.optionIconWrap}>
                            <Ionicons name="wifi-outline" size={30} color={COLORS.success} />
                        </LinearGradient>
                        <Text style={styles.optionTitle}>Data Bundle</Text>
                        <Text style={styles.optionSub}>Weekly, monthly & mashup</Text>
                        <View style={[styles.optionArrow, { backgroundColor: COLORS.successLight }]}>
                            <Ionicons name="arrow-forward" size={14} color={COLORS.success} />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Recent Purchases */}
                <View style={styles.sectionRow}>
                    <Text style={styles.sectionTitle}>Recent Purchases</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAll}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.recentList}>
                    {recentPurchases.map((item) => (
                        <View key={item.id} style={[styles.recentCard, SHADOWS.sm]}>
                            <View style={[styles.recentIcon, { backgroundColor: item.iconBg }]}>
                                <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.recentTitle}>{item.title}</Text>
                                <Text style={styles.recentDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.recentAmount}>{item.amount}</Text>
                        </View>
                    ))}
                </View>

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

    banner: {
        borderRadius: 20,
        padding: 22,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        overflow: 'hidden',
    },
    bannerDec: {
        position: 'absolute',
        top: -30,
        right: 60,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    badgeText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
    bannerTitle: { color: COLORS.white, fontSize: 18, fontWeight: '800', marginBottom: 4 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },

    sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, marginTop: 8 },
    viewAll: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },

    optionsRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
    optionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 18,
        alignItems: 'flex-start',
    },
    optionIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },
    optionTitle: { fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 4 },
    optionSub: { fontSize: 11, color: COLORS.textGrey, marginBottom: 14 },
    optionArrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },

    recentList: { gap: 12 },
    recentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 18,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    recentIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    recentTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 3 },
    recentDate: { fontSize: 12, color: COLORS.textGrey },
    recentAmount: { fontSize: 15, fontWeight: '800', color: COLORS.textDark },
});

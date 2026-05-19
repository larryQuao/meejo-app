import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar as RNStatusBar, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import ExchangeScreen from './ExchangeScreen';
import PurchaseScreen from './PurchaseScreen';
import MoreScreen from './MoreScreen';
import NotificationsScreen from './NotificationsScreen';
import AdsCarousel from '../components/AdsCarousel';
import AdBanner from '../components/AdBanner';
import TransactionHistoryScreen from './TransactionHistoryScreen';
import TransactionDetailScreen from './TransactionDetailScreen';
import EditProfileScreen from './EditProfileScreen';
import MyNumbersScreen from './MyNumbersScreen';
import SavedBeneficiariesScreen from './SavedBeneficiariesScreen';
import SavedCardsScreen from './SavedCardsScreen';
import ChangePinScreen from './ChangePinScreen';
import AccountScreen from './AccountScreen';
import SecurityScreen from './SecurityScreen';
import PreferencesScreen from './PreferencesScreen';
import FaqScreen from './FaqScreen';
import ChatSupportScreen from './ChatSupportScreen';
import RateAppScreen from './RateAppScreen';
import TermsPrivacyScreen from './TermsPrivacyScreen';
import ReportBugScreen from './ReportBugScreen';
import SubscriptionScreen from './SubscriptionScreen';
import type { Transaction } from './TransactionHistoryScreen';


const history = [
    { id: 1, title: 'Data Exchange', subtitle: '20 GB · MTN → AT', icon: 'swap-horizontal', iconBg: COLORS.primaryLight, iconColor: COLORS.primary, amount: '2.0 GB', positive: true },
    { id: 2, title: 'Airtime to Data', subtitle: 'GHC 20.00 exchanged', icon: 'phone-portrait-outline', iconBg: '#FFF7ED', iconColor: '#F97316', amount: '290 MB', positive: true },
    { id: 3, title: 'Airtime Purchase', subtitle: 'MTN · Self', icon: 'wallet-outline', iconBg: COLORS.successLight, iconColor: COLORS.success, amount: 'GHC 20', positive: false },
];

const QUICK_ACTIONS = [
    { label: 'Purchase\nHub', icon: 'basket-outline', screen: 'Purchase', bg: COLORS.primaryLight, color: COLORS.primary },
    { label: 'Swap\nAirtime', icon: 'swap-horizontal', screen: 'Exchange', bg: '#FFF7ED', color: '#F97316' },
    { label: 'Swap\nData', icon: 'swap-vertical', screen: 'Exchange', bg: COLORS.successLight, color: COLORS.success },
];

function Dashboard({ onNavigate, onViewAllActivity }: { onNavigate: (screen: string) => void; onViewAllActivity: () => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Ads Carousel */}
            <AdsCarousel onAdPress={() => onNavigate('Exchange')} />

            {/* Balance Cards */}
            <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Your Balances</Text>
                <TouchableOpacity style={styles.refreshChip}>
                    <Ionicons name="refresh" size={13} color={COLORS.primary} />
                    <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.balanceRow}>
                <View style={[styles.balanceCard, SHADOWS.md]}>
                    <View style={[styles.balanceIconWrap, { backgroundColor: COLORS.primaryLight }]}>
                        <Ionicons name="call" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.balanceType}>Airtime</Text>
                    <Text style={styles.balanceValue}>GHC 783</Text>
                    <TouchableOpacity style={[styles.topUpBtn, { backgroundColor: COLORS.primaryLight }]}>
                        <Text style={[styles.topUpText, { color: COLORS.primary }]}>Top Up</Text>
                    </TouchableOpacity>
                </View>

                <View style={[styles.balanceCard, SHADOWS.md]}>
                    <View style={[styles.balanceIconWrap, { backgroundColor: COLORS.successLight }]}>
                        <Ionicons name="wifi" size={20} color={COLORS.success} />
                    </View>
                    <Text style={styles.balanceType}>Data</Text>
                    <Text style={styles.balanceValue}>783 GB</Text>
                    <TouchableOpacity style={[styles.topUpBtn, { backgroundColor: COLORS.successLight }]}>
                        <Text style={[styles.topUpText, { color: COLORS.success }]}>Top Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>Quick Actions</Text>
            <View style={styles.actionsRow}>
                {QUICK_ACTIONS.map((action) => (
                    <TouchableOpacity
                        key={action.label}
                        style={[styles.actionCard, SHADOWS.sm]}
                        onPress={() => onNavigate(action.screen)}
                        activeOpacity={0.75}
                    >
                        <View style={[styles.actionIconWrap, { backgroundColor: action.bg }]}>
                            <Ionicons name={action.icon as any} size={26} color={action.color} />
                        </View>
                        <Text style={styles.actionLabel}>{action.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Inline Ad */}
            <AdBanner variant="partner" />

            {/* Recent Activity */}
            <View style={[styles.sectionRow, { marginTop: 20 }]}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity onPress={onViewAllActivity} activeOpacity={0.75}>
                    <Text style={styles.viewAllText}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
                {history.map((item) => (
                    <View key={item.id} style={[styles.historyCard, SHADOWS.sm]}>
                        <View style={[styles.historyIconWrap, { backgroundColor: item.iconBg }]}>
                            <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyTitle}>{item.title}</Text>
                            <Text style={styles.historySubtitle}>{item.subtitle}</Text>
                        </View>
                        <Text style={[styles.historyAmount, { color: item.positive ? COLORS.success : COLORS.textDark }]}>
                            {item.amount}
                        </Text>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

type Overlay =
    | null
    | 'notifications'
    | 'txHistory'
    | 'account'
    | 'security'
    | 'preferences'
    | 'editProfile'
    | 'myNumbers'
    | 'savedBeneficiaries'
    | 'savedCards'
    | 'changePin'
    | 'faq'
    | 'chatSupport'
    | 'rateApp'
    | 'termsPrivacy'
    | 'reportBug'
    | 'subscription'
    | { screen: 'txDetail'; tx: Transaction };

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);
    const [overlay, setOverlay] = useState<Overlay>(null);

    // Overlay screens take priority over tab content
    if (overlay === 'notifications') {
        return <NotificationsScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'txHistory') {
        return (
            <TransactionHistoryScreen
                onBack={() => setOverlay(null)}
                onSelectTransaction={(tx) => setOverlay({ screen: 'txDetail', tx })}
            />
        );
    }
    if (overlay !== null && typeof overlay === 'object' && overlay.screen === 'txDetail') {
        return (
            <TransactionDetailScreen
                transaction={overlay.tx}
                onBack={() => setOverlay('txHistory')}
            />
        );
    }
    if (overlay === 'editProfile') {
        return <EditProfileScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'myNumbers') {
        return <MyNumbersScreen onBack={() => setOverlay(null)} onUpgrade={() => setOverlay('subscription')} />;
    }
    if (overlay === 'savedBeneficiaries') {
        return <SavedBeneficiariesScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'savedCards') {
        return <SavedCardsScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'changePin') {
        return <ChangePinScreen onBack={() => setOverlay(null)} onDone={() => setOverlay(null)} />;
    }
    if (overlay === 'account') {
        return <AccountScreen onBack={() => setOverlay(null)} onNavigate={(s) => setOverlay(s as Overlay)} />;
    }
    if (overlay === 'security') {
        return <SecurityScreen onBack={() => setOverlay(null)} onNavigate={(s) => setOverlay(s as Overlay)} />;
    }
    if (overlay === 'preferences') {
        return <PreferencesScreen onBack={() => setOverlay(null)} onNavigate={(s) => setOverlay(s as Overlay)} />;
    }
    if (overlay === 'faq') {
        return <FaqScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'chatSupport') {
        return <ChatSupportScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'rateApp') {
        return <RateAppScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'termsPrivacy') {
        return <TermsPrivacyScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'reportBug') {
        return <ReportBugScreen onBack={() => setOverlay(null)} />;
    }
    if (overlay === 'subscription') {
        return <SubscriptionScreen onBack={() => setOverlay(null)} />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'Home': return <Dashboard onNavigate={setActiveTab} onViewAllActivity={() => setOverlay('txHistory')} />;
            case 'Exchange': return <ExchangeScreen setTabBarVisible={setIsTabBarVisible} />;
            case 'Purchase': return <PurchaseScreen setTabBarVisible={setIsTabBarVisible} />;
            case 'More': return <MoreScreen onNavigate={(s) => setOverlay(s as Overlay)} />;
            default: return <Dashboard onNavigate={setActiveTab} onViewAllActivity={() => setOverlay('txHistory')} />;
        }
    };

    const NAV_ITEMS = [
        { id: 'Home', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
        { id: 'Exchange', label: 'Exchange', icon: 'swap-horizontal', iconOutline: 'swap-horizontal-outline' },
        { id: 'Purchase', label: 'Purchase', icon: 'basket', iconOutline: 'basket-outline' },
        { id: 'More', label: 'More', icon: 'grid', iconOutline: 'grid-outline' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea}>

                {/* Home Header */}
                {activeTab === 'Home' && (
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <View style={styles.avatarWrap}>
                                <Ionicons name="person" size={20} color={COLORS.primary} />
                            </View>
                            <View>
                                <Text style={styles.greetingSmall}>Good morning</Text>
                                <Text style={styles.greetingName}>Reynolds 👋</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.notifBtn} onPress={() => setOverlay('notifications')} activeOpacity={0.75}>
                            <Ionicons name="notifications-outline" size={22} color={COLORS.textDark} />
                            <View style={styles.notifDot} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Content */}
                <View style={{ flex: 1 }}>{renderContent()}</View>

                {/* Bottom Nav */}
                {isTabBarVisible && (
                    <View style={[styles.bottomNav, SHADOWS.lg]}>
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeTab === item.id;
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.navItem}
                                    onPress={() => setActiveTab(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.navIconWrap, isActive && styles.navIconWrapActive]}>
                                        <Ionicons
                                            name={(isActive ? item.icon : item.iconOutline) as any}
                                            size={22}
                                            color={isActive ? COLORS.white : COLORS.textGrey}
                                        />
                                    </View>
                                    <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    safeArea: { flex: 1, paddingTop: RNStatusBar.currentHeight || 40 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 120 },
    placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    placeholderText: { fontSize: 16, color: COLORS.textGrey, fontWeight: '500' },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarWrap: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greetingSmall: { fontSize: 12, color: COLORS.textGrey, fontWeight: '500' },
    greetingName: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
    notifBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.sm,
    },
    notifDot: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.danger,
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },

    // Section Headers
    sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
    sectionTitle: { fontSize: 17, fontWeight: '800', color: COLORS.textDark },
    viewAllText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
    refreshChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: COLORS.primaryLight,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    refreshText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },

    // Balance Cards
    balanceRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
    balanceCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 18,
        alignItems: 'flex-start',
    },
    balanceIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    balanceType: { fontSize: 13, fontWeight: '600', color: COLORS.textGrey, marginBottom: 4 },
    balanceValue: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 14 },
    topUpBtn: {
        width: '100%',
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
    },
    topUpText: { fontSize: 12, fontWeight: '700' },

    // Quick Actions
    actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
    actionCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 10,
        alignItems: 'center',
        minHeight: 110,
        justifyContent: 'center',
    },
    actionIconWrap: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    actionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', lineHeight: 17 },

    // History
    historyList: { gap: 12, paddingBottom: 8 },
    historyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    historyIconWrap: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTitle: { fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 3 },
    historySubtitle: { fontSize: 12, color: COLORS.textGrey },
    historyAmount: { fontSize: 14, fontWeight: '800' },

    // Bottom Nav
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        paddingBottom: 22,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderTopWidth: 0,
    },
    navItem: { alignItems: 'center', gap: 4, paddingHorizontal: 8 },
    navIconWrap: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    navIconWrapActive: { backgroundColor: COLORS.primary },
    navLabel: { fontSize: 10, fontWeight: '600', color: COLORS.textGrey },
    navLabelActive: { color: COLORS.primary, fontWeight: '700' },
});

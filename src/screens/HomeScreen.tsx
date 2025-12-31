import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar as RNStatusBar, SafeAreaView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import ExchangeScreen from './ExchangeScreen';
import PurchaseScreen from './PurchaseScreen';

const { width } = Dimensions.get('window');

// Mock Data
const history = [
    { id: 1, title: 'Data Exchange', subtitle: '20 GB from AT to MTN', icon: 'swap-horizontal', color: '#94A3B8' },
    { id: 2, title: 'Airtime Exchange to Data', subtitle: 'GHC 20.00', icon: 'phone-portrait-outline', color: '#94A3B8' },
    { id: 3, title: 'Airtime Purchase', subtitle: 'GHC 20.00', icon: 'wallet-outline', color: '#94A3B8' },
];

function Dashboard({ onNavigate }: { onNavigate: (screen: string) => void }) {
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

            {/* Banner / Carousel - Now Primary Blue */}
            <View style={styles.bannerContainer}>
                <View style={styles.bannerContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.bannerTitle}>Get discount when you exchange data</Text>
                        <Text style={styles.bannerSubtitle}>Get up to 50% discount</Text>
                    </View>
                    <MaterialCommunityIcons name="star-circle-outline" size={48} color="rgba(255,255,255,0.2)" />
                </View>
                <TouchableOpacity style={styles.bannerButton} onPress={() => onNavigate('Exchange')}>
                    <Text style={styles.bannerButtonText}>Exchange Now</Text>
                </TouchableOpacity>

                {/* Carousel Indicators */}
                <View style={styles.carouselIndicators}>
                    <View style={[styles.indicator, styles.indicatorActive]} />
                    <View style={styles.indicator} />
                    <View style={styles.indicator} />
                </View>
            </View>

            {/* Balances Section */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Data & Airtime Balances</Text>
                <TouchableOpacity style={styles.refreshButton}>
                    <Text style={styles.refreshText}>Refresh</Text>
                    <Ionicons name="refresh" size={14} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.balanceContainer}>
                {/* Airtime Card */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceIconBg}>
                        <Ionicons name="call" size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.balanceLabel}>Airtime</Text>
                    <Text style={styles.balanceValue}>GHC 783.00</Text>
                    <TouchableOpacity style={styles.addUpButton}>
                        <Text style={styles.addUpText}>Top Up</Text>
                    </TouchableOpacity>
                </View>

                {/* Data Card */}
                <View style={styles.balanceCard}>
                    <View style={[styles.balanceIconBg, { backgroundColor: '#F0FDF4' }]}>
                        <Ionicons name="wifi" size={20} color={COLORS.success} />
                    </View>
                    <Text style={styles.balanceLabel}>Data</Text>
                    <Text style={styles.balanceValue}>783 GB</Text>
                    <TouchableOpacity style={[styles.addUpButton, { backgroundColor: '#DCFCE7' }]}>
                        <Text style={[styles.addUpText, { color: COLORS.success }]}>Top Up</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Quick Actions Grid */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.actionsGrid}>
                <TouchableOpacity style={styles.actionItem} onPress={() => onNavigate('Purchase')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#E0F2FE' }]}>
                        <MaterialCommunityIcons name="basket-outline" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={styles.actionLabel}>Purchase{"\n"}Hub</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onNavigate('Exchange')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#F0F9FF' }]}>
                        <Ionicons name="swap-horizontal" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={styles.actionLabel}>Swap{"\n"}Airtime</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem} onPress={() => onNavigate('Exchange')}>
                    <View style={[styles.actionIconCircle, { backgroundColor: '#F0F9FF' }]}>
                        <Ionicons name="swap-vertical" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={styles.actionLabel}>Swap{"\n"}Data</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Purchases */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                    <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 14 }}>View All</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.historyList}>
                {history.map((item) => (
                    <View key={item.id} style={styles.historyItem}>
                        <View style={styles.historyIconCircle}>
                            <Ionicons name={item.icon as any} size={20} color={COLORS.textGrey} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.historyTitle}>{item.title}</Text>
                            <Text style={styles.historySubtitle}>{item.subtitle}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

export default function HomeScreen() {
    const [activeTab, setActiveTab] = useState('Home');
    const [isTabBarVisible, setIsTabBarVisible] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case 'Home':
                return <Dashboard onNavigate={setActiveTab} />;
            case 'Exchange':
                return <ExchangeScreen setTabBarVisible={setIsTabBarVisible} />;
            case 'Purchase':
                return <PurchaseScreen setTabBarVisible={setIsTabBarVisible} />;
            case 'More':
                return (
                    <View style={styles.placeholderContainer}>
                        <Text style={styles.placeholderText}>More Settings Screen</Text>
                    </View>
                );
            default:
                return <Dashboard onNavigate={setActiveTab} />;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" backgroundColor={COLORS.background} />
            <SafeAreaView style={styles.safeArea}>

                {/* Header - Profile & Greeting (Only show on Home, or customize for others. Let's keep for Home only or show simplified) */}
                {activeTab === 'Home' ? (
                    <View style={styles.header}>
                        <View style={styles.profileRow}>
                            <Ionicons name="person-circle" size={32} color={COLORS.textDark} />
                            <View style={styles.phoneContainer}>
                                <Text style={styles.phoneNumber}>055 482 4425</Text>
                                <Ionicons name="chevron-down" size={16} color={COLORS.textDark} />
                            </View>
                        </View>
                        <Text style={styles.greeting}>Hey Reynolds!</Text>
                    </View>
                ) : null}

                {/* Content Area */}
                <View style={{ flex: 1 }}>
                    {renderContent()}
                </View>

                {/* Bottom Navigation */}
                {isTabBarVisible && (
                    <View style={styles.bottomNav}>
                        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Home')}>
                            <View style={[styles.navIconContainer, activeTab === 'Home' && styles.navIconActive]}>
                                <Ionicons name="home" size={24} color={activeTab === 'Home' ? COLORS.white : COLORS.textGrey} />
                            </View>
                            <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Exchange')}>
                            <View style={[styles.navIconContainer, activeTab === 'Exchange' && styles.navIconActive]}>
                                <Ionicons name="swap-horizontal" size={24} color={activeTab === 'Exchange' ? COLORS.white : COLORS.textGrey} />
                            </View>
                            <Text style={[styles.navText, activeTab === 'Exchange' && styles.navTextActive]}>Exchange</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Purchase')}>
                            <View style={[styles.navIconContainer, activeTab === 'Purchase' && styles.navIconActive]}>
                                <Ionicons name="basket-outline" size={24} color={activeTab === 'Purchase' ? COLORS.white : COLORS.textGrey} />
                            </View>
                            <Text style={[styles.navText, activeTab === 'Purchase' && styles.navTextActive]}>Purchase</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('More')}>
                            <View style={[styles.navIconContainer, activeTab === 'More' && styles.navIconActive]}>
                                <Ionicons name="grid-outline" size={24} color={activeTab === 'More' ? COLORS.white : COLORS.textGrey} />
                            </View>
                            <Text style={[styles.navText, activeTab === 'More' && styles.navTextActive]}>More</Text>
                        </TouchableOpacity>
                    </View>
                )}

            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    safeArea: {
        flex: 1,
        paddingTop: RNStatusBar.currentHeight || 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 110, // Space for bottom nav
    },
    placeholderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: 18,
        color: COLORS.textGrey,
    },

    // Header
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
        justifyContent: 'center', // Centering based on mockup
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    phoneNumber: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.textDark,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textDark,
        textAlign: 'center',
    },

    // Banner
    bannerContainer: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
        // Shadow
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 8,
        lineHeight: 26,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 0,
    },
    bannerButton: {
        backgroundColor: COLORS.white,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignSelf: 'flex-start',
        borderRadius: 12,
    },
    bannerButtonText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    carouselIndicators: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 20,
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    indicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    indicatorActive: {
        backgroundColor: COLORS.white,
        width: 18,
    },

    // Sections Common
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textDark,
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        gap: 4,
    },
    refreshText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },
    viewAllButton: {
        // Obsolete
    },
    viewAllText: {
        // Obsolete
    },

    // Balance Cards
    balanceContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    balanceCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 24,
        alignItems: 'flex-start',
        // Shadow
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    balanceIconBg: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    balanceLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textGrey,
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.textDark,
        marginBottom: 16,
    },
    addUpButton: {
        backgroundColor: '#E0F2FE',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    addUpText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.primary,
    },

    // Quick Actions
    actionsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        gap: 12,
    },
    actionItem: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 110,
        // Shadow
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    actionIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textDark,
        textAlign: 'center',
        lineHeight: 16,
    },

    // History
    historyList: {
        gap: 16,
        paddingBottom: 20,
    },
    historyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 20,
        gap: 16,
        // Shadow
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },
    historyIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    historyTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textDark,
        marginBottom: 2,
    },
    historySubtitle: {
        fontSize: 12,
        color: COLORS.textGrey,
    },

    // Bottom Nav
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#F1F5F9',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    navIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CBD5E1',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navIconActive: {
        backgroundColor: COLORS.primary,
    },
    navText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textGrey,
    },
    navTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});

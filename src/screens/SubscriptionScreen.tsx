import React, { useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import { Tier, TIER_CONFIG, TIERS_ORDER } from '../constants/tiers';
import { useTier } from '../context/TierContext';

interface SubscriptionScreenProps {
    onBack: () => void;
}

const TIER_GRADIENTS: Record<Tier, [string, string]> = {
    free:     ['#64748B', '#94A3B8'],
    standard: ['#1A45D8', '#2A65F8'],
    premium:  ['#B45309', '#D97706'],
};

export default function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
    const { tier: currentTier, setTier } = useTier();
    const [confirming, setConfirming] = useState<Tier | null>(null);

    const handleSelect = (selected: Tier) => {
        if (selected === currentTier) return;

        const cfg = TIER_CONFIG[selected];
        const isDowngrade = TIERS_ORDER.indexOf(selected) < TIERS_ORDER.indexOf(currentTier);

        Alert.alert(
            isDowngrade ? 'Downgrade Plan' : `Upgrade to ${cfg.name}`,
            isDowngrade
                ? `Downgrading to ${cfg.name} will reduce your phone number slots and restore ads. Continue?`
                : `Subscribe to ${cfg.name} for ${cfg.price}${cfg.priceNote}. You can cancel anytime.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: isDowngrade ? 'Downgrade' : 'Subscribe',
                    style: isDowngrade ? 'destructive' : 'default',
                    onPress: () => {
                        setConfirming(selected);
                        // Simulate a brief processing delay
                        setTimeout(() => {
                            setTier(selected);
                            setConfirming(null);
                        }, 600);
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Subscription</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* Hero */}
                <View style={styles.hero}>
                    <View style={styles.heroIcon}>
                        <Ionicons name="diamond-outline" size={28} color={COLORS.primary} />
                    </View>
                    <Text style={styles.heroTitle}>Choose your plan</Text>
                    <Text style={styles.heroSub}>
                        Upgrade to unlock more phone numbers and reduce or remove ads.
                    </Text>
                </View>

                {/* Tier cards */}
                {TIERS_ORDER.map((tierId) => {
                    const cfg = TIER_CONFIG[tierId];
                    const isCurrent = tierId === currentTier;
                    const isProcessing = confirming === tierId;
                    const gradient = TIER_GRADIENTS[tierId];

                    return (
                        <View key={tierId} style={[styles.tierCard, isCurrent && styles.tierCardActive, SHADOWS.md]}>

                            {/* Popular badge */}
                            {cfg.popular && (
                                <View style={styles.popularBadge}>
                                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                                </View>
                            )}

                            {/* Card header */}
                            <LinearGradient
                                colors={gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.cardHeader}
                            >
                                <View style={styles.cardHeaderLeft}>
                                    <Text style={styles.tierName}>{cfg.name}</Text>
                                    <Text style={styles.tierTagline}>{cfg.tagline}</Text>
                                </View>
                                <View style={styles.priceWrap}>
                                    <Text style={styles.tierPrice}>{cfg.price}</Text>
                                    <Text style={styles.tierPriceNote}>{cfg.priceNote}</Text>
                                </View>
                            </LinearGradient>

                            {/* Features list */}
                            <View style={styles.featuresList}>
                                {cfg.features.map((f, i) => (
                                    <View key={i} style={styles.featureRow}>
                                        <View style={[
                                            styles.featureIcon,
                                            { backgroundColor: f.included ? cfg.bgColor : '#F1F5F9' }
                                        ]}>
                                            <Ionicons
                                                name={f.included ? 'checkmark' : 'close'}
                                                size={12}
                                                color={f.included ? cfg.color : COLORS.textLight}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.featureLabel,
                                            !f.included && styles.featureLabelOff,
                                        ]}>
                                            {f.label}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            {/* CTA */}
                            {isCurrent ? (
                                <View style={[styles.currentBadge, { backgroundColor: cfg.bgColor }]}>
                                    <Ionicons name="checkmark-circle" size={16} color={cfg.color} />
                                    <Text style={[styles.currentBadgeText, { color: cfg.color }]}>Current Plan</Text>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.ctaBtn, { backgroundColor: cfg.color }, isProcessing && { opacity: 0.6 }]}
                                    onPress={() => handleSelect(tierId)}
                                    disabled={isProcessing}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.ctaBtnText}>
                                        {isProcessing ? 'Processing…' : (
                                            TIERS_ORDER.indexOf(tierId) < TIERS_ORDER.indexOf(currentTier)
                                                ? `Downgrade to ${cfg.name}`
                                                : `Upgrade to ${cfg.name}`
                                        )}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                })}

                {/* Fine print */}
                <View style={styles.finePrint}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textLight} />
                    <Text style={styles.finePrintText}>
                        Payments processed securely. Cancel anytime from this screen. No hidden charges.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F7F7F7' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: COLORS.white, paddingHorizontal: 8,
        paddingTop: 56, paddingBottom: 14,
        borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    },
    backBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },

    content: { padding: 16, paddingBottom: 48 },

    hero: { alignItems: 'center', paddingVertical: 24 },
    heroIcon: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 14,
    },
    heroTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
    heroSub: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 21, maxWidth: 280 },

    tierCard: {
        backgroundColor: COLORS.white,
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    tierCardActive: {
        borderColor: COLORS.primary,
    },

    popularBadge: {
        position: 'absolute', top: 14, right: 14, zIndex: 10,
        backgroundColor: '#F59E0B', paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 20,
    },
    popularBadgeText: { fontSize: 10, fontWeight: '800', color: COLORS.white, letterSpacing: 0.3 },

    cardHeader: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 18,
    },
    cardHeaderLeft: { flex: 1 },
    tierName: { fontSize: 20, fontWeight: '900', color: COLORS.white, marginBottom: 3 },
    tierTagline: { fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 16 },
    priceWrap: { alignItems: 'flex-end' },
    tierPrice: { fontSize: 22, fontWeight: '900', color: COLORS.white },
    tierPriceNote: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 1 },

    featuresList: { paddingHorizontal: 20, paddingVertical: 16, gap: 12 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureIcon: {
        width: 22, height: 22, borderRadius: 11,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    featureLabel: { flex: 1, fontSize: 13, color: COLORS.textDark, fontWeight: '500', lineHeight: 18 },
    featureLabelOff: { color: COLORS.textLight, textDecorationLine: 'line-through' },

    currentBadge: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
        marginHorizontal: 20, marginBottom: 18, paddingVertical: 13, borderRadius: 30,
    },
    currentBadgeText: { fontSize: 14, fontWeight: '700' },

    ctaBtn: {
        marginHorizontal: 20, marginBottom: 18,
        paddingVertical: 14, borderRadius: 30,
        alignItems: 'center',
    },
    ctaBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },

    finePrint: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 8,
        paddingHorizontal: 4, paddingTop: 4,
    },
    finePrintText: { flex: 1, fontSize: 11, color: COLORS.textLight, lineHeight: 17 },
});

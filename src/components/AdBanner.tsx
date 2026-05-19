import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SHADOWS } from '../constants/theme';
import { useTier } from '../context/TierContext';

interface AdBannerProps {
    variant?: 'mtn' | 'telecel' | 'at' | 'meejo' | 'partner';
    onPress?: () => void;
}

const VARIANTS = {
    mtn: {
        gradient: ['#92400E', '#D97706', '#FCD34D'] as [string, string, string],
        tag: 'MTN · Sponsored',
        title: 'Double your data every weekend',
        cta: 'Learn More',
        icon: 'wifi-outline',
    },
    telecel: {
        gradient: ['#7F1D1D', '#DC2626', '#FCA5A5'] as [string, string, string],
        tag: 'Telecel · Sponsored',
        title: '5GB bundle for just GHC 25/month',
        cta: 'Subscribe',
        icon: 'cellular-outline',
    },
    at: {
        gradient: ['#1E3A8A', '#2563EB', '#93C5FD'] as [string, string, string],
        tag: 'AT · Sponsored',
        title: 'Unlimited night browsing — free!',
        cta: 'Activate',
        icon: 'moon-outline',
    },
    meejo: {
        gradient: ['#4C1D95', '#7C3AED', '#C4B5FD'] as [string, string, string],
        tag: 'Meejo Promo',
        title: 'Invite friends, earn GHC 5 each',
        cta: 'Invite Now',
        icon: 'gift-outline',
    },
    partner: {
        gradient: ['#064E3B', '#059669', '#6EE7B7'] as [string, string, string],
        tag: 'Fido · Sponsored',
        title: 'Get an instant loan up to GHC 500',
        cta: 'Apply Now',
        icon: 'card-outline',
    },
};

export default function AdBanner({ variant = 'mtn', onPress }: AdBannerProps) {
    const { config } = useTier();
    if (!config.showInlineAds) return null;
    const ad = VARIANTS[variant];

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={SHADOWS.sm}>
            <LinearGradient
                colors={ad.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.banner}
            >
                <View style={styles.dec} />
                <View style={styles.left}>
                    <View style={styles.tagRow}>
                        <View style={styles.adDot}><Text style={styles.adDotText}>AD</Text></View>
                        <Text style={styles.tagText}>{ad.tag}</Text>
                    </View>
                    <Text style={styles.title} numberOfLines={1}>{ad.title}</Text>
                </View>
                <View style={styles.right}>
                    <Ionicons name={ad.icon as any} size={20} color="rgba(255,255,255,0.7)" style={{ marginBottom: 6 }} />
                    <View style={styles.ctaBtn}>
                        <Text style={styles.ctaText}>{ad.cta}</Text>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    banner: {
        borderRadius: 16, padding: 14,
        flexDirection: 'row', alignItems: 'center',
        overflow: 'hidden',
    },
    dec: {
        position: 'absolute', top: -25, right: 80,
        width: 90, height: 90, borderRadius: 45,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    left: { flex: 1, marginRight: 12 },
    tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
    adDot: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 5, paddingVertical: 1,
        borderRadius: 4,
    },
    adDotText: { fontSize: 9, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
    tagText: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '600' },
    title: { fontSize: 13, fontWeight: '800', color: COLORS.white, lineHeight: 18 },
    right: { alignItems: 'center' },
    ctaBtn: {
        backgroundColor: COLORS.white,
        paddingVertical: 5, paddingHorizontal: 10,
        borderRadius: 12,
    },
    ctaText: { fontSize: 11, fontWeight: '800', color: COLORS.textDark },
});

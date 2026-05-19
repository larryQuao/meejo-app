import React, { useRef, useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Dimensions, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';
import { useTier } from '../context/TierContext';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_W = SCREEN_W - 40; // 20px padding each side

interface Ad {
    id: string;
    tag: string;
    tagBg: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    gradient: [string, string, string];
    icon: string;
    sponsored?: boolean;
}

const ADS: Ad[] = [
    {
        id: '1',
        tag: 'Special Offer',
        tagBg: 'rgba(255,255,255,0.22)',
        title: 'Get up to 50% off on every data exchange',
        subtitle: 'Limited time deal — this weekend only!',
        ctaLabel: 'Exchange Now',
        gradient: [COLORS.primaryDark, COLORS.primary, '#4F8EF8'],
        icon: 'swap-horizontal',
    },
    {
        id: '2',
        tag: 'MTN Promo',
        tagBg: 'rgba(255,255,255,0.2)',
        title: 'Double your data this weekend',
        subtitle: 'Exchange GHC 10 airtime and get 2 GB instead of 1 GB',
        ctaLabel: 'Claim Offer',
        gradient: ['#B45309', '#F59E0B', '#FCD34D'],
        icon: 'wifi',
        sponsored: true,
    },
    {
        id: '3',
        tag: 'Telecel Deal',
        tagBg: 'rgba(255,255,255,0.2)',
        title: '5 GB monthly bundle for just GHC 25',
        subtitle: 'Best value data bundle in Ghana — subscribe now',
        ctaLabel: 'Subscribe',
        gradient: ['#991B1B', '#EF4444', '#F87171'],
        icon: 'cellular',
        sponsored: true,
    },
    {
        id: '4',
        tag: 'AT Night Pack',
        tagBg: 'rgba(255,255,255,0.2)',
        title: 'Browse unlimited 12AM – 6AM free',
        subtitle: 'Activate AT Night Pack and never run out of data',
        ctaLabel: 'Activate',
        gradient: ['#1E40AF', '#3B82F6', '#60A5FA'],
        icon: 'moon',
        sponsored: true,
    },
    {
        id: '5',
        tag: 'Refer & Earn',
        tagBg: 'rgba(255,255,255,0.2)',
        title: 'Invite friends and earn GHC 5 each',
        subtitle: 'No limit — the more you invite, the more you earn!',
        ctaLabel: 'Invite Now',
        gradient: ['#5B21B6', '#7C3AED', '#A78BFA'],
        icon: 'gift',
    },
];

interface AdsCarouselProps {
    onAdPress?: (ad: Ad) => void;
}

export default function AdsCarousel({ onAdPress }: AdsCarouselProps) {
    const { config } = useTier();
    const scrollRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

    const startAutoScroll = () => {
        autoScrollTimer.current = setInterval(() => {
            setActiveIndex(prev => {
                const next = (prev + 1) % ADS.length;
                scrollRef.current?.scrollTo({ x: next * CARD_W, animated: true });
                return next;
            });
        }, 4000);
    };

    const stopAutoScroll = () => {
        if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };

    useEffect(() => {
        if (!config.showCarouselAds) return;
        startAutoScroll();
        return () => stopAutoScroll();
    }, [config.showCarouselAds]);

    // Premium tier — no ads at all
    if (!config.showCarouselAds) return null;

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_W);
        setActiveIndex(idx);
    };

    const handleDotPress = (idx: number) => {
        stopAutoScroll();
        scrollRef.current?.scrollTo({ x: idx * CARD_W, animated: true });
        setActiveIndex(idx);
        startAutoScroll();
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                onScrollBeginDrag={stopAutoScroll}
                onScrollEndDrag={startAutoScroll}
                snapToInterval={CARD_W}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
            >
                {ADS.map(ad => (
                    <TouchableOpacity
                        key={ad.id}
                        style={{ width: CARD_W }}
                        onPress={() => onAdPress?.(ad)}
                        activeOpacity={0.92}
                    >
                        <LinearGradient
                            colors={ad.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.card}
                        >
                            {/* Decorative circles */}
                            <View style={styles.dec1} />
                            <View style={styles.dec2} />

                            {/* Top row */}
                            <View style={styles.cardTop}>
                                <View style={[styles.tagPill, { backgroundColor: ad.tagBg }]}>
                                    {ad.sponsored && (
                                        <Text style={styles.sponsoredDot}>●</Text>
                                    )}
                                    <Text style={styles.tagText}>{ad.tag}</Text>
                                </View>
                                <View style={styles.adIconWrap}>
                                    <Ionicons name={ad.icon as any} size={22} color="rgba(255,255,255,0.9)" />
                                </View>
                            </View>

                            {/* Text */}
                            <Text style={styles.adTitle}>{ad.title}</Text>
                            <Text style={styles.adSubtitle}>{ad.subtitle}</Text>

                            {/* CTA */}
                            <TouchableOpacity style={styles.ctaBtn} onPress={() => onAdPress?.(ad)} activeOpacity={0.85}>
                                <Text style={styles.ctaText}>{ad.ctaLabel}</Text>
                                <Ionicons name="arrow-forward" size={13} color={ad.gradient[1]} style={{ marginLeft: 4 }} />
                            </TouchableOpacity>
                        </LinearGradient>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Dot indicators */}
            <View style={styles.dots}>
                {ADS.map((_, i) => (
                    <TouchableOpacity key={i} onPress={() => handleDotPress(i)} activeOpacity={0.8}>
                        <View style={[styles.dot, i === activeIndex && styles.dotActive]} />
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: 8 },
    scrollContent: { paddingHorizontal: 0 },

    card: {
        borderRadius: 24,
        padding: 22,
        minHeight: 170,
        overflow: 'hidden',
        justifyContent: 'space-between',
    },
    dec1: {
        position: 'absolute', top: -40, right: -40,
        width: 160, height: 160, borderRadius: 80,
        backgroundColor: 'rgba(255,255,255,0.07)',
    },
    dec2: {
        position: 'absolute', bottom: -30, left: -20,
        width: 110, height: 110, borderRadius: 55,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },

    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    tagPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    },
    sponsoredDot: { fontSize: 7, color: 'rgba(255,255,255,0.7)' },
    tagText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
    adIconWrap: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },

    adTitle: {
        fontSize: 17, fontWeight: '800', color: COLORS.white,
        lineHeight: 23, maxWidth: '85%', marginBottom: 5,
    },
    adSubtitle: {
        fontSize: 12, color: 'rgba(255,255,255,0.78)',
        lineHeight: 17, maxWidth: '80%', marginBottom: 16,
    },

    ctaBtn: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 9, paddingHorizontal: 16,
        borderRadius: 20, alignSelf: 'flex-start',
    },
    ctaText: { fontSize: 13, fontWeight: '800', color: COLORS.textDark },

    dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 12 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
    dotActive: { width: 20, borderRadius: 3, backgroundColor: COLORS.primary },
});

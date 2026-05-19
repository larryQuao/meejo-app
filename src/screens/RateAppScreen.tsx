import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput,
    KeyboardAvoidingView, Platform, Alert, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface RateAppScreenProps { onBack: () => void; }

const CATEGORIES = [
    { id: 'ease', label: 'Ease of Use', icon: 'hand-left-outline' },
    { id: 'speed', label: 'Speed', icon: 'flash-outline' },
    { id: 'support', label: 'Support', icon: 'chatbubbles-outline' },
    { id: 'design', label: 'Design', icon: 'color-palette-outline' },
];

export default function RateAppScreen({ onBack }: RateAppScreenProps) {
    const [overallRating, setOverallRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
    const [review, setReview] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const starLabel = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];
    const starColors = ['', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#2A65F8'];

    const handleSubmit = () => {
        if (!overallRating) {
            Alert.alert('Select a rating', 'Please tap a star to rate the app.');
            return;
        }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <View style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Rate the App</Text>
                    <View style={{ width: 38 }} />
                </View>
                <View style={styles.thankWrap}>
                    <View style={styles.thankIcon}>
                        <Ionicons name="heart" size={40} color="#EF4444" />
                    </View>
                    <Text style={styles.thankTitle}>Thank you! 🎉</Text>
                    <Text style={styles.thankSub}>
                        Your {overallRating}-star review means a lot to the Meejo team. We'll keep improving just for you!
                    </Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <Ionicons key={s} name="star" size={28} color={s <= overallRating ? '#F59E0B' : '#E5E7EB'} />
                        ))}
                    </View>
                    <TouchableOpacity style={styles.doneBtn} onPress={onBack} activeOpacity={0.8}>
                        <Text style={styles.doneBtnText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rate the App</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* App identity */}
                <View style={styles.appCard}>
                    <View style={styles.appIcon}>
                        <Text style={styles.appIconText}>M</Text>
                    </View>
                    <Text style={styles.appName}>Meejo</Text>
                    <Text style={styles.appTagline}>Ghana's Airtime & Data Exchange App</Text>
                </View>

                {/* Overall stars */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <Text style={styles.sectionLabel}>Overall Rating</Text>
                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map(s => (
                            <TouchableOpacity
                                key={s}
                                onPress={() => setOverallRating(s)}
                                onPressIn={() => setHoveredStar(s)}
                                onPressOut={() => setHoveredStar(0)}
                                activeOpacity={0.8}
                            >
                                <Ionicons
                                    name="star"
                                    size={44}
                                    color={s <= (hoveredStar || overallRating) ? '#F59E0B' : '#E5E7EB'}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    {overallRating > 0 && (
                        <Text style={[styles.starLabel, { color: starColors[overallRating] }]}>
                            {starLabel[overallRating]}
                        </Text>
                    )}
                </View>

                {/* Category ratings */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <Text style={styles.sectionLabel}>Rate by category</Text>
                    {CATEGORIES.map((cat, i) => (
                        <View key={cat.id}>
                            {i > 0 && <View style={styles.divider} />}
                            <View style={styles.catRow}>
                                <Ionicons name={cat.icon as any} size={18} color={COLORS.textGrey} style={{ width: 24 }} />
                                <Text style={styles.catLabel}>{cat.label}</Text>
                                <View style={styles.miniStars}>
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <TouchableOpacity key={s} onPress={() => setCategoryRatings(prev => ({ ...prev, [cat.id]: s }))} activeOpacity={0.8}>
                                            <Ionicons name="star" size={20} color={s <= (categoryRatings[cat.id] ?? 0) ? '#F59E0B' : '#E5E7EB'} />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Written review */}
                <View style={[styles.card, SHADOWS.sm]}>
                    <Text style={styles.sectionLabel}>Leave a review (optional)</Text>
                    <TextInput
                        style={styles.reviewInput}
                        value={review}
                        onChangeText={setReview}
                        placeholder="Tell us what you love or what could be improved..."
                        placeholderTextColor={COLORS.textLight}
                        multiline
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text style={styles.charCount}>{review.length}/500</Text>
                </View>

                <TouchableOpacity
                    style={[styles.submitBtn, !overallRating && styles.submitBtnOff]}
                    onPress={handleSubmit}
                    activeOpacity={0.8}
                >
                    <Text style={styles.submitBtnText}>Submit Review</Text>
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
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

    content: { padding: 16, paddingBottom: 40 },

    appCard: { alignItems: 'center', paddingVertical: 24 },
    appIcon: {
        width: 72, height: 72, borderRadius: 20,
        backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
        marginBottom: 10,
    },
    appIconText: { fontSize: 32, fontWeight: '900', color: COLORS.white },
    appName: { fontSize: 20, fontWeight: '800', color: COLORS.textDark },
    appTagline: { fontSize: 13, color: COLORS.textGrey, marginTop: 4 },

    card: { backgroundColor: COLORS.white, borderRadius: 18, padding: 18, marginBottom: 14 },
    sectionLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 16,
    },
    starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 8 },
    starLabel: { textAlign: 'center', fontSize: 16, fontWeight: '800', marginTop: 4 },

    divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 2 },
    catRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
    catLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.textDark },
    miniStars: { flexDirection: 'row', gap: 3 },

    reviewInput: {
        backgroundColor: '#F7F7F7', borderRadius: 12,
        padding: 14, fontSize: 14, color: COLORS.textDark,
        borderWidth: 1, borderColor: '#EBEBEB',
        minHeight: 100,
    },
    charCount: { fontSize: 11, color: COLORS.textLight, alignSelf: 'flex-end', marginTop: 6 },

    submitBtn: { backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 16, alignItems: 'center' },
    submitBtnOff: { opacity: 0.35 },
    submitBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },

    // Thank you
    thankWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
    thankIcon: {
        width: 88, height: 88, borderRadius: 44,
        backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
    },
    thankTitle: { fontSize: 26, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
    thankSub: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center', lineHeight: 21, marginBottom: 24 },
    doneBtn: { backgroundColor: COLORS.textDark, borderRadius: 30, paddingVertical: 14, paddingHorizontal: 48, marginTop: 8 },
    doneBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.white },
});

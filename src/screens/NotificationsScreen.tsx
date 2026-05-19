import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import AdBanner from '../components/AdBanner';

interface Notification {
    id: string;
    type: 'exchange' | 'purchase' | 'promo' | 'security' | 'system';
    title: string;
    body: string;
    time: string;
    read: boolean;
}

interface NotificationsScreenProps { onBack: () => void; }

const ICONS: Record<Notification['type'], string> = {
    exchange: 'swap-horizontal', purchase: 'basket-outline',
    promo: 'pricetag-outline', security: 'shield-checkmark-outline',
    system: 'information-circle-outline',
};

const MOCK: Notification[] = [
    { id: '1', type: 'exchange', read: false, title: 'Exchange Successful', body: 'Your airtime exchange of GHC 20 from MTN → AT has been completed.', time: '2 min ago' },
    { id: '2', type: 'promo', read: false, title: 'Weekend Special! 🎉', body: 'Get 50% more data when you exchange airtime this weekend. Valid till Sunday.', time: '1 hr ago' },
    { id: '3', type: 'purchase', read: false, title: 'Airtime Delivered', body: 'GHC 20 airtime successfully delivered to +233 55 482 4425 (MTN).', time: '3 hrs ago' },
    { id: '4', type: 'security', read: true, title: 'New Login Detected', body: 'A new login was detected on your account. If this was you, no action needed.', time: 'Yesterday' },
    { id: '5', type: 'exchange', read: true, title: 'Exchange Completed', body: '290 MB data credited to your Telecel account. Airtime exchanged: GHC 20.', time: 'Yesterday' },
    { id: '6', type: 'system', read: true, title: 'App Updated', body: 'Meejo has been updated with new features including faster exchanges.', time: '3 days ago' },
    { id: '7', type: 'promo', read: true, title: 'Refer & Earn', body: 'Invite a friend to Meejo and earn GHC 5 when they complete their first exchange.', time: '5 days ago' },
];

function NotifItem({ notif, onPress }: { notif: Notification; onPress: () => void }) {
    return (
        <TouchableOpacity
            style={[styles.notifRow, !notif.read && styles.notifRowUnread]}
            onPress={onPress}
            activeOpacity={0.6}
        >
            <Ionicons name={ICONS[notif.type] as any} size={20} color={notif.read ? COLORS.textGrey : COLORS.textDark} style={styles.notifIcon} />
            <View style={styles.notifBody}>
                <View style={styles.notifTop}>
                    <Text style={[styles.notifTitle, !notif.read && styles.notifTitleUnread]} numberOfLines={1}>
                        {notif.title}
                    </Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                </View>
                <Text style={styles.notifText} numberOfLines={2}>{notif.body}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
    );
}

export default function NotificationsScreen({ onBack }: NotificationsScreenProps) {
    const [notifications, setNotifications] = useState(MOCK);

    const unreadCount = notifications.filter(n => !n.read).length;
    const markAllRead = () => setNotifications(n => n.map(item => ({ ...item, read: true })));
    const markRead = (id: string) => setNotifications(n => n.map(item => item.id === id ? { ...item, read: true } : item));

    const unread = notifications.filter(n => !n.read);
    const read = notifications.filter(n => n.read);

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0
                    ? <TouchableOpacity onPress={markAllRead} activeOpacity={0.7}><Text style={styles.markAll}>Mark all read</Text></TouchableOpacity>
                    : <View style={{ width: 72 }} />
                }
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="notifications-off-outline" size={44} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No notifications yet</Text>
                        <Text style={styles.emptySub}>Activity on your account will appear here.</Text>
                    </View>
                ) : (
                    <>
                        {unread.length > 0 && (
                            <View>
                                <Text style={styles.groupLabel}>New</Text>
                                <View style={[styles.card, SHADOWS.sm]}>
                                    {unread.map((n, i) => (
                                        <View key={n.id}>
                                            {i > 0 && <View style={styles.divider} />}
                                            <NotifItem notif={n} onPress={() => markRead(n.id)} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                        {/* Ad between notification groups */}
                        {unread.length > 0 && read.length > 0 && (
                            <View style={styles.adWrap}>
                                <AdBanner variant="telecel" />
                            </View>
                        )}

                        {read.length > 0 && (
                            <View>
                                <Text style={styles.groupLabel}>Earlier</Text>
                                <View style={[styles.card, SHADOWS.sm]}>
                                    {read.map((n, i) => (
                                        <View key={n.id}>
                                            {i > 0 && <View style={styles.divider} />}
                                            <NotifItem notif={n} onPress={() => {}} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                )}
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
    markAll: { fontSize: 13, fontWeight: '700', color: COLORS.primary, paddingHorizontal: 10 },

    content: { padding: 16, paddingBottom: 40 },
    groupLabel: {
        fontSize: 12, fontWeight: '600', color: COLORS.textGrey,
        textTransform: 'uppercase', letterSpacing: 0.6,
        marginBottom: 8, paddingHorizontal: 2,
    },
    card: { backgroundColor: COLORS.white, borderRadius: 18, overflow: 'hidden', marginBottom: 20 },
    divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 56 },

    notifRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 18, paddingVertical: 14 },
    notifRowUnread: { backgroundColor: '#FAFCFF' },
    notifIcon: { marginRight: 14, marginTop: 2, width: 22 },
    notifBody: { flex: 1 },
    notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 },
    notifTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textGrey, flex: 1, marginRight: 8 },
    notifTitleUnread: { fontWeight: '700', color: COLORS.textDark },
    notifTime: { fontSize: 11, color: COLORS.textLight, flexShrink: 0 },
    notifText: { fontSize: 13, color: COLORS.textGrey, lineHeight: 18 },
    unreadDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 6, marginLeft: 8 },

    adWrap: { marginBottom: 8 },
    empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textMid },
    emptySub: { fontSize: 14, color: COLORS.textGrey, textAlign: 'center' },
});

import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

interface ChatSupportScreenProps { onBack: () => void; }

interface Message {
    id: string;
    from: 'user' | 'agent';
    text: string;
    time: string;
    status?: 'sending' | 'sent' | 'read';
}

const now = () => new Date().toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGES: Message[] = [
    {
        id: '0',
        from: 'agent',
        text: '👋 Hi Reynolds! I\'m Ama from Meejo Support. How can I help you today?',
        time: '11:30 AM',
    },
    {
        id: '1',
        from: 'agent',
        text: 'You can ask me about exchanges, account issues, billing, or anything else. I usually reply within a few minutes.',
        time: '11:30 AM',
    },
];

const QUICK_REPLIES = [
    'My exchange failed',
    'I was charged but got nothing',
    'How do I change my PIN?',
    'I want to verify my account',
];

const AGENT_REPLIES: Record<string, string> = {
    'My exchange failed': 'I\'m sorry to hear that! Could you please share the transaction reference number? You can find it in your Transaction History. I\'ll look into it right away.',
    'I was charged but got nothing': 'That\'s concerning — I\'ll escalate this immediately. Please share your transaction reference and the amount charged so I can investigate and arrange a refund if applicable.',
    'How do I change my PIN?': 'Sure! Go to More → Security → Change PIN. You\'ll need your current PIN. If you\'ve forgotten it, select "Forgot PIN" and we\'ll verify via OTP to your registered number.',
    'I want to verify my account': 'Great! To verify your account, go to More → Edit Profile → Verify Identity. You\'ll need a valid Ghana Card or Passport. Verification takes up to 24 hours.',
};

const DEFAULT_REPLY = 'Thanks for reaching out! Let me check that for you. Could you provide more details so I can assist you better?';

export default function ChatSupportScreen({ onBack }: ChatSupportScreenProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const listRef = useRef<FlatList>(null);

    const sendMessage = (text: string) => {
        if (!text.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            from: 'user',
            text: text.trim(),
            time: now(),
            status: 'sent',
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate agent typing + reply
        setTimeout(() => {
            setIsTyping(false);
            const replyText = AGENT_REPLIES[text.trim()] ?? DEFAULT_REPLY;
            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                from: 'agent',
                text: replyText,
                time: now(),
            };
            setMessages(prev => [...prev, agentMsg]);
        }, 1800);
    };

    useEffect(() => {
        setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }, [messages, isTyping]);

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.from === 'user';
        return (
            <View style={[styles.msgWrap, isUser && styles.msgWrapUser]}>
                {!isUser && (
                    <View style={styles.agentAvatar}>
                        <Text style={styles.agentAvatarText}>A</Text>
                    </View>
                )}
                <View style={{ maxWidth: '75%' }}>
                    <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAgent]}>
                        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>{item.text}</Text>
                    </View>
                    <View style={[styles.msgMeta, isUser && { alignSelf: 'flex-end' }]}>
                        <Text style={styles.msgTime}>{item.time}</Text>
                        {isUser && item.status === 'sent' && (
                            <Ionicons name="checkmark-done" size={12} color={COLORS.primary} style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
                    <Ionicons name="chevron-back" size={24} color={COLORS.textDark} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <View style={styles.agentMiniAvatar}>
                        <Text style={styles.agentMiniAvatarText}>A</Text>
                    </View>
                    <View>
                        <Text style={styles.headerTitle}>Meejo Support</Text>
                        <View style={styles.onlineRow}>
                            <View style={styles.onlineDot} />
                            <Text style={styles.onlineText}>Online · replies in minutes</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.callBtn} activeOpacity={0.7}>
                    <Ionicons name="call-outline" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
                ref={listRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={m => m.id}
                contentContainerStyle={styles.msgList}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    isTyping ? (
                        <View style={styles.typingWrap}>
                            <View style={styles.agentAvatar}>
                                <Text style={styles.agentAvatarText}>A</Text>
                            </View>
                            <View style={styles.typingBubble}>
                                <View style={styles.typingDots}>
                                    {[0, 1, 2].map(i => <View key={i} style={styles.typingDot} />)}
                                </View>
                            </View>
                        </View>
                    ) : null
                }
            />

            {/* Quick replies — show only if last message is from agent */}
            {messages[messages.length - 1]?.from === 'agent' && !isTyping && (
                <View style={styles.quickRepliesWrap}>
                    <ScrollRow>
                        {QUICK_REPLIES.map(q => (
                            <TouchableOpacity key={q} style={styles.quickReply} onPress={() => sendMessage(q)} activeOpacity={0.75}>
                                <Text style={styles.quickReplyText}>{q}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollRow>
                </View>
            )}

            {/* Input bar */}
            <View style={styles.inputBar}>
                <TextInput
                    style={styles.input}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Type a message..."
                    placeholderTextColor={COLORS.textLight}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendBtn, !input.trim() && styles.sendBtnOff]}
                    onPress={() => sendMessage(input)}
                    disabled={!input.trim()}
                    activeOpacity={0.8}
                >
                    <Ionicons name="send" size={17} color={input.trim() ? COLORS.white : COLORS.textLight} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// Tiny horizontal scroll helper
import { ScrollView } from 'react-native';
function ScrollRow({ children }: { children: React.ReactNode }) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
            {children}
        </ScrollView>
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
    headerCenter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    agentMiniAvatar: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
    },
    agentMiniAvatarText: { fontSize: 14, fontWeight: '800', color: COLORS.white },
    headerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textDark },
    onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
    onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.success },
    onlineText: { fontSize: 11, color: COLORS.success, fontWeight: '600' },
    callBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },

    msgList: { paddingHorizontal: 16, paddingVertical: 16, paddingBottom: 8 },

    msgWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 14 },
    msgWrapUser: { flexDirection: 'row-reverse' },

    agentAvatar: {
        width: 30, height: 30, borderRadius: 15,
        backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    agentAvatarText: { fontSize: 12, fontWeight: '800', color: COLORS.white },

    bubble: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
    bubbleAgent: { backgroundColor: COLORS.white, borderBottomLeftRadius: 4, ...SHADOWS.sm },
    bubbleUser: { backgroundColor: COLORS.textDark, borderBottomRightRadius: 4 },
    bubbleText: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
    bubbleTextUser: { color: COLORS.white },

    msgMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingHorizontal: 4 },
    msgTime: { fontSize: 11, color: COLORS.textLight },

    typingWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
    typingBubble: { backgroundColor: COLORS.white, borderRadius: 18, borderBottomLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 12, ...SHADOWS.sm },
    typingDots: { flexDirection: 'row', gap: 4, alignItems: 'center' },
    typingDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.textLight },

    quickRepliesWrap: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: COLORS.white },
    quickReply: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
        borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.white,
    },
    quickReplyText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

    inputBar: {
        flexDirection: 'row', alignItems: 'flex-end', gap: 10,
        backgroundColor: COLORS.white, paddingHorizontal: 16,
        paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 28 : 14,
        borderTopWidth: 1, borderTopColor: '#F0F0F0',
    },
    input: {
        flex: 1, backgroundColor: '#F7F7F7', borderRadius: 22,
        paddingHorizontal: 16, paddingVertical: 10,
        fontSize: 14, color: COLORS.textDark,
        borderWidth: 1, borderColor: '#EBEBEB',
        maxHeight: 100,
    },
    sendBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: COLORS.textDark, alignItems: 'center', justifyContent: 'center',
    },
    sendBtnOff: { backgroundColor: '#E5E7EB' },
});

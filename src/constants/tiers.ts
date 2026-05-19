export type Tier = 'free' | 'standard' | 'premium';

export interface TierConfig {
    id: Tier;
    name: string;
    tagline: string;
    price: string;
    priceNote: string;
    color: string;
    bgColor: string;
    /** Total personal numbers allowed (including primary registered number) */
    maxNumbers: number;
    showCarouselAds: boolean;
    showInlineAds: boolean;
    popular?: boolean;
    features: Array<{ label: string; included: boolean }>;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
    free: {
        id: 'free',
        name: 'Free',
        tagline: 'Get started at no cost',
        price: 'GHC 0',
        priceNote: 'forever',
        color: '#8A94A6',
        bgColor: '#F1F5F9',
        maxNumbers: 1,
        showCarouselAds: true,
        showInlineAds: true,
        features: [
            { label: '1 personal number', included: true },
            { label: 'All exchange & purchase features', included: true },
            { label: 'Transaction history', included: true },
            { label: 'Reduced ads', included: false },
            { label: 'Additional personal numbers', included: false },
            { label: 'Ad-free experience', included: false },
        ],
    },
    standard: {
        id: 'standard',
        name: 'Standard',
        tagline: 'More numbers, fewer interruptions',
        price: 'GHC 9.99',
        priceNote: '/ month',
        color: '#2A65F8',
        bgColor: '#EEF3FF',
        maxNumbers: 3,
        showCarouselAds: true,
        showInlineAds: false,
        popular: true,
        features: [
            { label: '3 personal numbers (+ 2 extra)', included: true },
            { label: 'All exchange & purchase features', included: true },
            { label: 'Transaction history', included: true },
            { label: 'Reduced ads (home banner only)', included: true },
            { label: 'Ad-free experience', included: false },
            { label: 'Priority support', included: true },
        ],
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        tagline: 'Full power, zero interruptions',
        price: 'GHC 24.99',
        priceNote: '/ month',
        color: '#D97706',
        bgColor: '#FFFBEB',
        maxNumbers: 5,
        showCarouselAds: false,
        showInlineAds: false,
        features: [
            { label: '5 personal numbers (+ 4 extra)', included: true },
            { label: 'All exchange & purchase features', included: true },
            { label: 'Transaction history', included: true },
            { label: 'Completely ad-free experience', included: true },
            { label: 'Priority support', included: true },
            { label: 'Early access to new features', included: true },
        ],
    },
};

export const TIERS_ORDER: Tier[] = ['free', 'standard', 'premium'];

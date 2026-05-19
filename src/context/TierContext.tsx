import React, { createContext, useContext, useState } from 'react';
import { Tier, TierConfig, TIER_CONFIG } from '../constants/tiers';

interface TierContextValue {
    tier: Tier;
    config: TierConfig;
    setTier: (tier: Tier) => void;
}

const TierContext = createContext<TierContextValue>({
    tier: 'free',
    config: TIER_CONFIG.free,
    setTier: () => {},
});

export function TierProvider({ children }: { children: React.ReactNode }) {
    const [tier, setTier] = useState<Tier>('free');
    return (
        <TierContext.Provider value={{ tier, config: TIER_CONFIG[tier], setTier }}>
            {children}
        </TierContext.Provider>
    );
}

export function useTier() {
    return useContext(TierContext);
}

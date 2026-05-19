import React, { useState } from 'react';
import { TierProvider } from './src/context/TierContext';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import CreatePinScreen from './src/screens/CreatePinScreen';

type Screen =
    | 'splash'
    | 'onboarding'
    | 'login'
    | 'register'
    | 'otp-login'       // OTP step during login
    | 'otp-register'    // OTP step during registration
    | 'createPin'
    | 'home';

export default function App() {
    const [screen, setScreen] = useState<Screen>('splash');
    const [phone, setPhone] = useState('');

    if (screen === 'splash') {
        return <SplashScreen onFinish={() => setScreen('onboarding')} />;
    }

    if (screen === 'onboarding') {
        return <OnboardingScreen onNext={() => setScreen('login')} />;
    }

    if (screen === 'login') {
        return (
            <LoginScreen
                onLogin={() => setScreen('otp-login')}
                onCreateAccount={() => setScreen('register')}
            />
        );
    }

    if (screen === 'register') {
        return (
            <RegisterScreen
                onNext={() => setScreen('otp-register')}
                onBack={() => setScreen('login')}
            />
        );
    }

    if (screen === 'otp-login') {
        return (
            <OtpVerificationScreen
                phone={phone}
                onVerified={() => setScreen('home')}
                onBack={() => setScreen('login')}
            />
        );
    }

    if (screen === 'otp-register') {
        return (
            <OtpVerificationScreen
                phone={phone}
                onVerified={() => setScreen('createPin')}
                onBack={() => setScreen('register')}
            />
        );
    }

    if (screen === 'createPin') {
        return (
            <CreatePinScreen
                onDone={() => setScreen('home')}
                onBack={() => setScreen('otp-register')}
            />
        );
    }

    return (
        <TierProvider>
            <HomeScreen />
        </TierProvider>
    );
}

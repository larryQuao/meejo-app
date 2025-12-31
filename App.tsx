import React, { useState } from 'react';
import HomeScreen from './src/screens/HomeScreen';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'onboarding' | 'home'>('splash');

  if (currentScreen === 'splash') {
    return <SplashScreen onFinish={() => setCurrentScreen('onboarding')} />;
  }

  if (currentScreen === 'onboarding') {
    return <OnboardingScreen onNext={() => setCurrentScreen('home')} />;
  }

  return <HomeScreen />;
}


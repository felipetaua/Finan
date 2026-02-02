import React from 'react';
import { useFonts } from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './src/screens/appNavegation';
import { OnboardingProvider } from './src/context/OnboardingContext';

export default function App() {
  const [fontsLoaded] = useFonts({
    'MadimiOne-Regular': require('./assets/fonts/MadimiOne-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <AppNavigation />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}


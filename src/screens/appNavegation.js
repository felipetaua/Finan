import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import SplashScreen from './splash/SplashScreen';
import WelcomeScreen from './welcome/WelcomeScreen';

export default function AppNavigation() {
    const [isLoading, setIsLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(true);

    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }

    if (showWelcome) {
        return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
    }

    return (
        <NavigationContainer>
        <BottomTabNavigator />
        <StatusBar style="auto" />
        </NavigationContainer>
    );
}

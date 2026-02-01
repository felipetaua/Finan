import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import BottomTabNavigator from '../navigation/BottomTabNavigator';
import AuthStackNavigator from '../navigation/AuthStackNavigator';
import SplashScreen from './splash/SplashScreen';

export default function AppNavigation() {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(true);// deixar falso para sair do app

    if (isLoading) {
        return <SplashScreen onFinish={() => setIsLoading(false)} />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <BottomTabNavigator /> : <AuthStackNavigator />}
            <StatusBar style="auto" />
        </NavigationContainer>
    );
}

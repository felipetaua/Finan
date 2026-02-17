import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/welcome/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import PhoneAuthScreen from '../screens/auth/PhoneAuthScreen';
import StepScreen1 from '../screens/onBoarding/StepScreen-1';
import StepScreen2 from '../screens/onBoarding/StepScreen-2';
import StepScreen3 from '../screens/onBoarding/StepScreen-3';
import StepScreen4 from '../screens/onBoarding/StepScreen-4';
import StepScreen5 from '../screens/onBoarding/StepScreen-5';
import RankingsScreen from '../screens/rankings/RankingsScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="PhoneAuth" component={PhoneAuthScreen} />
            <Stack.Screen name="RankingsScreen" component={RankingsScreen} />
            <Stack.Screen name="StepScreen1" component={StepScreen1} />
            <Stack.Screen name="StepScreen2" component={StepScreen2} />
            <Stack.Screen name="StepScreen3" component={StepScreen3} />
            <Stack.Screen name="StepScreen4" component={StepScreen4} />
            <Stack.Screen name="StepScreen5" component={StepScreen5} />
        </Stack.Navigator>
    );
};

export default AuthStackNavigator;
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FinanceScreen from '../screens/finance/FinanceScreen';
import AnalyticsScreen from '../screens/finance/AnalyticsScreen';

const Stack = createStackNavigator();

const FinanceStackNavigator = () => {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
        >
        <Stack.Screen name="FinanceHome" component={FinanceScreen} />
        <Stack.Screen name="AnalyticsScreen" component={AnalyticsScreen} />
        </Stack.Navigator>
    );
};

export default FinanceStackNavigator;

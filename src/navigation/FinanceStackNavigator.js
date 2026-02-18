import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FinanceScreen from '../screens/finance/FinanceScreen';
import AnalyticsScreen from '../screens/finance/AnalyticsScreen';
import AddTransactionScreen from '../screens/finance/AddTransactionScreen';
import TransactionsScreen from '../screens/finance/TransactionsScreen';
import AddChallengesScreen from '../screens/finance/AddChallengesScreen';

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
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
        <Stack.Screen name="Transactions" component={TransactionsScreen} />
        <Stack.Screen name="AddChallenges" component={AddChallengesScreen} />
        </Stack.Navigator>
    );
};

export default FinanceStackNavigator;

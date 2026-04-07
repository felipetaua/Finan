import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import BottomTab from '../components/common/BottomTab';

import HomeScreen from '../screens/home/HomeScreen';
import FinanceStackNavigator from './FinanceStackNavigator';
import GoalsScreen from '../screens/investment/GoalsScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import RankingsStackNavigator from './RankingsStackNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomTab {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Progress"
        component={HomeScreen}
        options={{ title: 'Trilha' }}
      />
      <Tab.Screen
        name="Wallet"
        component={FinanceStackNavigator}
        options={{ title: 'Carteira' }}
      />
      <Tab.Screen
        name="Finance"
        component={GoalsScreen}
        options={{ title: 'Investimentos' }}
      />
      <Tab.Screen
        name="Goals"
        component={RankingsStackNavigator}
        options={{ title: 'Ranques' }}
      />
      <Tab.Screen
        name="Profile" 
        component={ProfileStackNavigator}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import BottomTab from '../components/common/BottomTab';

import HomeScreen from '../screens/home/HomeScreen';
import FinanceScreen from '../screens/finance/FinanceScreen';
import GoalsScreen from '../screens/finance/GoalsScreen';
import ProgressScreen from '../screens/finance/ProgressScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

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
        component={FinanceScreen}
        options={{ title: 'Carteira' }}
      />
      <Tab.Screen 
        name="Finance" 
        component={GoalsScreen}
        options={{ title: 'Investimentos' }}
      />
      <Tab.Screen 
        name="Goals" 
        component={FinanceScreen}
        options={{ title: 'Investimentos' }}
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

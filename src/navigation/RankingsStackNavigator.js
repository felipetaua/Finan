import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RankingsScreen from '../screens/rankings/RankingsScreen';
import MissionsScreen from '../screens/rankings/MissionsScreen';

const Stack = createStackNavigator();

const RankingsStackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="RankingsMain" component={RankingsScreen} />
            <Stack.Screen name="Missions" component={MissionsScreen} />
        </Stack.Navigator>
    );
};

export default RankingsStackNavigator;
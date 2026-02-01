import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

const HomeHeader = ({ streak = 0, coins = 0, hearts = 0 }) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.courseSwitcher}>
                <View style={styles.courseIconContainer}>
                    <MaterialCommunityIcons name="wallet" size={24} color={theme.colors.primary} />
                </View>
            </TouchableOpacity>
            
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="fire" size={24} color={streak > 0 ? "#FF9600" : "#E5E5E5"} />
                    <Text style={[styles.statText, { color: streak > 0 ? "#FF9600" : "#AFAFAF" }]}>{streak}</Text>
                </View>
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="hexagon-multiple" size={24} color="#1CB0F6" />
                    <Text style={[styles.statText, { color: '#1CB0F6' }]}>{coins}</Text>
                </View>
                <View style={styles.statItem}>
                    <MaterialCommunityIcons name="heart" size={24} color="#FF4B4B" />
                    <Text style={[styles.statText, { color: '#FF4B4B' }]}>{hearts}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#E5E5E5',
        backgroundColor: '#FFFFFF',
    },
    courseSwitcher: {
        padding: 2,
    },
    courseIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#bcddfcee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeHeader;

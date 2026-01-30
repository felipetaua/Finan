import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme/theme';
import { FontAwesome6 } from '@expo/vector-icons';

const OnboardingHeader = ({ currentStep, totalSteps, onBack }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <FontAwesome6 name="chevron-left" size={20} color={theme.colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.progressBackground}>
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>

            <Text style={styles.indicatorText}>{currentStep}/{totalSteps}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 18,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    progressBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 15,
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: 4,
    },
    indicatorText: {
        fontSize: 14,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        minWidth: 35,
        textAlign: 'right',
    },
});

export default OnboardingHeader;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

const RankingsScreen = () => {
    const insets = useSafeAreaInsets();
    
    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <View style={styles.container}>
                <Text style={styles.title}>Ranques de Trofeus</Text>
                <Text style={styles.subtitle}>Gerencie suas transações</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: theme.fontSizes.xl,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textPrimary,
        fontFamily: theme.fonts.bold,
        marginBottom: theme.spacing.sm,
    },
    subtitle: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textSecondary,
        fontFamily: theme.fonts.regular,
    },
});

export default RankingsScreen;

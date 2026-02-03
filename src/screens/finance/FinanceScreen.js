import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import FloatingActionButton from '../../components/finance/FloatingActionButton';

const FinanceScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Finanças</Text>
        <Text style={styles.subtitle}>Gerencie suas transações</Text>
      </View>
      <FloatingActionButton />
    </SafeAreaView>
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

export default FinanceScreen;

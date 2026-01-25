import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FinanceScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finanças</Text>
      <Text style={styles.subtitle}>Gerencie suas transações</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default FinanceScreen;

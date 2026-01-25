import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas</Text>
      <Text style={styles.subtitle}>Alcance seus objetivos financeiros</Text>
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

export default GoalsScreen;

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invista em seus objetivos</Text>
      <Text style={styles.subtitle}>A liberdade financeira é um resultado!</Text>
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

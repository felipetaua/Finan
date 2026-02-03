import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../components/common/Button'

export default function LoginScreen ({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>login page</Text>
            <Text style={styles.subtitle}>crie contas</Text>
            <Button
                onPress={() => {}} 
                title="Entrar" 
                type='secondary'
            />
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
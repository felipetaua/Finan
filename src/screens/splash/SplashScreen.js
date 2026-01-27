import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';

const SplashScreen = ({ onFinish }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
        onFinish();
        }, 280); 

    return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={[styles.title, { 
                    color: theme.colors.primary,
                    fontFamily: theme.fonts.medium 
                }]}>Finan</Text>
                <Text style={[styles.subtitle, { 
                    color: theme.colors.textSecondary,
                    fontFamily: theme.fonts.regular 
                }]}>Educação Financeira</Text>
                <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
    },
    title: {
        fontSize: 48,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 40,
    },
    loader: {
        marginTop: 20,
    },
});

export default SplashScreen;

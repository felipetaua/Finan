import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../theme/theme';

const Button = ({ onPress, title, type = 'primary' }) => {
    const buttonStyle = type === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary;
    const textStyle = type === 'secondary' ? styles.buttonTextSecondary : styles.buttonTextPrimary;

    return (
        <TouchableOpacity 
            style={buttonStyle}
            onPress={onPress}
        >
            <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: theme.radius.full,
        width: '100%',
        marginBottom: 16,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.grayLight,
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: theme.radius.full,
        width: '100%',
        marginBottom: 16,
    },
    buttonTextPrimary: {
        color: theme.colors.surface,
        fontSize: theme.fontSizes.lg,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonTextSecondary: {
        color: theme.colors.grayLight,
        fontSize: theme.fontSizes.lg,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default Button;
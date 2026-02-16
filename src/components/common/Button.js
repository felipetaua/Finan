import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { theme } from '../../theme/theme';

const Button = ({ onPress, title, type = 'primary', icon, children, disabled, isLoading }) => {
    let buttonStyle;
    let textStyle;

    const colors = {
        primary: theme.colors.primary,
        surface: theme.colors.surface,
    };

    switch (type) {
        case 'secondary':
            buttonStyle = [styles.buttonSecondary, (disabled || isLoading) && styles.buttonDisabled];
            textStyle = styles.buttonTextSecondary;
            break;
        case 'outline':
            buttonStyle = [styles.buttonOutline, (disabled || isLoading) && styles.buttonDisabled];
            textStyle = styles.buttonTextOutline;
            break;
        default:
            buttonStyle = [styles.buttonPrimary, (disabled || isLoading) && styles.buttonDisabled];
            textStyle = styles.buttonTextPrimary;
    }

    return (
        <TouchableOpacity 
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || isLoading}
        >
            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator color={type === 'primary' ? "#FFF" : colors.primary} />
                ) : (
                    <>
                        {icon && <View style={styles.iconContainer}>{icon}</View>}
                        {title ? <Text style={textStyle}>{title}</Text> : null}
                        {children}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: theme.radius.lg,
        width: '100%',
        marginBottom: 16,
    },
    buttonSecondary: {
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.grayLight,
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: theme.radius.lg,
        width: '100%',
        marginBottom: 16,
    },
    buttonOutline: {
        backgroundColor: theme.colors.surface,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: theme.radius.md,
        width: '100%',
        marginBottom: 12,
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
    buttonTextOutline: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSizes.md,
        fontWeight: '600',
        textAlign: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        marginRight: 10,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
})

export default Button;
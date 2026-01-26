import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../theme/theme';

const PrimaryBtn = ({ onPress, title = 'Começar' }) => {
    return (
        <TouchableOpacity 
            style={styles.button}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 15,
        borderRadius: theme.radius.full,
        width: '100%',
    },
    buttonText: {
        color: theme.colors.surface,
        fontSize: theme.fontSizes.lg,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default PrimaryBtn;
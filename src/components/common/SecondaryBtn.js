import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../theme/theme';

const SecondaryBtn = ({ onPress, title = 'Começar' }) => {
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
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.grayLight,
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: theme.radius.full,
        width: '100%',
        marginBottom: 16,
    },
    buttonText: {
        color: theme.colors.grayLight,
        fontSize: theme.fontSizes.lg,
        fontWeight: '600',
        textAlign: 'center',
    },
})

export default SecondaryBtn;
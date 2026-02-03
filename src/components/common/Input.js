import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { theme } from '../../theme/theme';

const Input = ({ placeholder, secureTextEntry, value, onChangeText, keyboardType }) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 56,
        backgroundColor: '#E5E5E5', // Matching the light grey background in image
        borderRadius: theme.radius.md,
        paddingHorizontal: 16,
        marginBottom: 16,
        justifyContent: 'center',
    },
    input: {
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
})

export default Input;

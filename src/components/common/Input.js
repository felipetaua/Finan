import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../theme/theme';

const Input = ({
    placeholder,
    secureTextEntry,
    value,
    onChangeText,
    keyboardType,
    rightIcon,
    onRightIconPress,
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.input, rightIcon ? styles.inputWithIcon : null]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={secureTextEntry}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
            {rightIcon ? (
                <TouchableOpacity
                    style={styles.rightIconButton}
                    onPress={onRightIconPress}
                    hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                    {rightIcon}
                </TouchableOpacity>
            ) : null}
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
    inputWithIcon: {
        paddingRight: 36,
    },
    rightIconButton: {
        position: 'absolute',
        right: 14,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Input;

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { theme } from '../../theme/theme';

const SelectableOption = ({ title, icon, isSelected, onPress }) => {
    return (
        <TouchableOpacity 
            activeOpacity={0.7}
            style={[
                styles.container,
                isSelected && styles.selectedContainer
            ]}
            onPress={onPress}
        >
            <View style={[
                styles.radioButton,
                isSelected && styles.radioButtonActive
            ]}>
                {isSelected && <View style={styles.radioButtonInner} />}
            </View>
            
            {icon && (
                <Image
                    source={icon}
                    style={styles.icon}
                />
            )}

            <Text style={[
                styles.text,
                isSelected && styles.selectedText
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 12,
        width: '100%',
    },
    icon: {
        width: 24, 
        height: 24,
        marginRight: 12,
        resizeMode: 'contain',
    },
    selectedContainer: {
        borderColor: theme.colors.primary,
        backgroundColor: '#EFF6FF',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonActive: {
        borderColor: theme.colors.primary,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: theme.colors.primary,
    },
    text: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        flex: 1,
    },
    selectedText: {
        color: theme.colors.primary,
        fontWeight: '600',
    }
});

export default SelectableOption;

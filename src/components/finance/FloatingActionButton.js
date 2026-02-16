import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleMenu = () => {
        const toValue = isOpen ? 0 : 1;
        Animated.spring(animation, {
            toValue,
            friction: 5,
            useNativeDriver: true,
        }).start();
        setIsOpen(!isOpen);
    };

    const expenseStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -70],
                }),
            },
        ],
    };

    const incomeStyle = {
        transform: [
            { scale: animation },
            {
                translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -130],
                }),
            },
        ],
    };

    const rotation = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.item, incomeStyle]}>
                <TouchableOpacity style={[styles.subButton, { backgroundColor: theme.colors.success }]}>
                    <MaterialCommunityIcons name="trending-up" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.label}>Receita</Text>
            </Animated.View>

            <Animated.View style={[styles.item, expenseStyle]}>
                <TouchableOpacity style={[styles.subButton, { backgroundColor: theme.colors.error }]}>
                    <MaterialCommunityIcons name="trending-down" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.label}>Despesa</Text>
            </Animated.View>

            <TouchableOpacity 
                style={[styles.mainButton, { backgroundColor: theme.colors.primary }]} 
                onPress={toggleMenu}
                activeOpacity={0.8}
            >
                <Animated.View style={{ transform: [{ rotate: rotation }] }}>
                    <MaterialCommunityIcons name="plus" size={32} color="white" />
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        alignItems: 'center',
    },
    mainButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
            }
        })
    },
    item: {
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        right: 0,
    },
    subButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2.62,
            },
            android: {
                elevation: 4,
            },
            web: {
                boxShadow: '0px 2px 2.62px rgba(0, 0, 0, 0.2)',
            }
        })
    },
    label: {
        position: 'absolute',
        right: 60,
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 'bold',
        overflow: 'hidden',
    },
});

export default FloatingActionButton;

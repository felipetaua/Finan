import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import TrailIcon from '../../assets/icons/trail.svg';
import WalletIcon from '../../assets/icons/wallet.svg';
import GraphIcon from '../../assets/icons/graph.svg';
import TrofeuIcon from '../../assets/icons/trofeu.svg';
import ProfileIcon from '../../assets/icons/profile.svg';

const BottomTab = ({ state, descriptors, navigation }) => {
    const icons = {
        Progress: TrailIcon,
        Wallet: WalletIcon,
        Finance: GraphIcon,
        Goals: TrofeuIcon,
        Profile: ProfileIcon,
    };

    return (
        <View style={styles.container}>
        {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
            };

            const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
            };

            const Icon = icons[route.name];

            return (
            <TouchableOpacity
                key={index}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
            >
                <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                {Icon && (
                    <Icon
                    width={24}
                    height={24}
                    fill={isFocused ? '#2F6BFF' : '#6B7280'}
                    />
                )}
                </View>
            </TouchableOpacity>
            );
        })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 84,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingVertical: 8,
        paddingHorizontal: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainerActive: {
        transform: [{ scale: 1.1 }],
    },
});

export default BottomTab;

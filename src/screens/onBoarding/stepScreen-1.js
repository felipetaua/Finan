import React from 'react';
import { View, Text, StyleSheet, Image, SafeArea} from 'react-native';
import { theme } from '../../theme/theme';

export default function StepScreen1() {
    return (
        <View style={styles.container}>
            <Text>StepScreen1</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 18,
    },
});
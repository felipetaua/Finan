import React from 'react';
import { View, Text, StyleSheet, Image, SafeArea} from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';

export default function StepScreen2({ navigation }) {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/images/fin-2.png')}
                style={styles.imageScreen}
            />
            <Text>StepScreen2</Text>
            <Button  
                onPress={() => navigation.navigate('StepScreen3')} 
                title="Continuar" 
                type='primary'
            />
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
    imageScreen: {
        width: 170, 
        height: "45%",
        resizeMode: 'contain',
    }
});
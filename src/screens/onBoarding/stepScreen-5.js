import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, SafeArea, ScrollView} from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';
import SelectableOption from '../../components/common/SelectableOption';
import { use } from 'react';


export default function StepScreen5({ navigation }) {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const options = [
        { id: '1', icon: require('../../assets/icons/seeding.png'), title: 'Aprender a Investir' },
        { id: '2', icon: require('../../assets/icons/wallet.png'), title: 'Controle Financeiro' },
        { id: '3', icon: require('../../assets/icons/clock.png'), title: 'Planejar Aposentadoria' },
        { id: '4', icon: require('../../assets/icons/bank.png'), title: 'Organizar a Vida Financeira' },
    ];


    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/images/fin-3.png')}
                style={styles.imageScreen}
            />
            
            <View style={styles.content}>
                <Text style={styles.title}>Como conheceu o Finan?</Text>
                
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {options.map((item) => (
                        <SelectableOption 
                            key={item.id}
                            title={item.title}
                            icon={item.icon}
                            isSelected={selectedOption === item.id}
                            onPress={() => setSelectedOption(item.id)}
                        />
                    ))}
                </ScrollView>
            </View>

            <View style={styles.footer}>
                <Button  
                    onPress={() => navigation.navigate('login')} 
                    title="Continuar" 
                    type='primary'
                    disabled={!selectedOption}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 60,
    },
    imageScreen: {
        width: 170, 
        height: 120,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginBottom: 20,
    },
    content: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 18,
    },
    title: {
        fontSize: theme.fontSizes.xl,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    footer: {
        borderTopColor: '#E5E7EB',
        borderTopWidth: 1,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 18,
    }
});
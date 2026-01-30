import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';
import SelectableOption from '../../components/common/SelectableOption';

export default function StepScreen3({ navigation }) {
    const [selectedOption, setSelectedOption] = useState(null);

    const options = [
        { id: '1', icon: require('../../assets/icons/family.png'), title: 'Amigos/Família' },
        { id: '2', icon: require('../../assets/icons/social.png'), title: 'Redes Sociais' },
        { id: '3', icon: require('../../assets/icons/tiktok.png'), title: 'Vídeos curtos do TikTok' },
        { id: '4', icon: require('../../assets/icons/youtube.png'), title: 'Vídeos do Youtube' },
        { id: '5', icon: require('../../assets/icons/google.png'), title: 'Pesquisa no Google' }, 
        { id: '6', icon: require('../../assets/icons/newsletter.png'), title: 'Newsletter, Blogs e Sites'}
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
                    onPress={() => navigation.navigate('StepScreen4')} 
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
        paddingHorizontal: 18,
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
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
    }
});
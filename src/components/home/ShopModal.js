import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import LottieView from 'lottie-react-native';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebaseConfig';

const ShopModal = ({ visible, onClose, coins }) => {
    const [activeTab, setActiveTab] = useState('Impulsionadores');
    
    const tabs = ['Impulsionadores', 'Títulos', 'Temas', 'Avatares'];

    const items = [
        {
            id: 'bau',
            title: 'Baú Grátis',
            category: 'Impulsionadores',
            icon: 'treasure-chest',
            iconColor: '#1CB0F6',
            buttonText: 'Abrir',
            subtext: '08:38:32',
            price: null,
        },
        {
            id: 'freeze',
            title: 'Congelamento de Sequência',
            category: 'Impulsionadores',
            icon: 'snowflake',
            iconColor: '#1CB0F6',
            buttonText: 'Obter:',
            price: 132,
        },
        {
            id: 'recharge',
            title: 'Recarregar Cargas',
            category: 'Impulsionadores',
            icon: 'battery-charging',
            iconColor: '#FF9600',
            buttonText: 'Obter:',
            price: 132,
        },
        {
            id: 'energy',
            title: 'Energia Ilimitada',
            category: 'Impulsionadores',
            icon: 'infinity',
            iconColor: '#8A2BE2',
            buttonText: 'Obter:',
            price: 132,
        },
        {
            id: 'title_1',
            title: 'Investidor Novato',
            category: 'Títulos',
            icon: 'medal-outline',
            iconColor: '#FFD700',
            buttonText: 'Equipar',
            price: null,
        },
        {
            id: 'title_2',
            title: 'Lobo de Wall Street',
            category: 'Títulos',
            icon: 'star-circle-outline',
            iconColor: '#1CB0F6',
            buttonText: 'Obter:',
            price: 500,
        },
        {
            id: 'theme_dark',
            title: 'Tema Escuro (Premium)',
            category: 'Temas',
            icon: 'moon-waning-crescent',
            iconColor: '#2C3E50',
            buttonText: 'Obter:',
            price: 1000,
        }
    ];

    const filteredItems = items.filter(item => item.category === activeTab);

    const handlePurchase = async (item) => {
        if (item.price === null) {
            Alert.alert("Sucesso", `Você abriu: ${item.title}!`);
            return;
        }

        if (coins < item.price) {
            Alert.alert("Saldo Insuficiente", "Você não possui moedas suficientes para adquirir este item.");
            return;
        }

        const user = auth.currentUser;
        if (!user) return;

        try {
            const economyRef = doc(db, 'users', user.uid, 'gamification', 'economy');
            const docSnap = await getDoc(economyRef);
            
            let currentCoins = coins;
            if (docSnap.exists()) {
                currentCoins = docSnap.data().coins || 0;
            }

            if (currentCoins < item.price) {
                Alert.alert("Saldo Insuficiente", "Seu saldo no servidor não é suficiente.");
                return;
            }

            await setDoc(economyRef, {
                coins: currentCoins - item.price,
                lastUpdated: new Date().toISOString()
            }, { merge: true });

            Alert.alert("Compra Realizada!", `Você adquiriu ${item.title} com sucesso.`);
        } catch (error) {
            console.error("Erro ao salvar moedas:", error);
            // Handling adblock edge cases optimistically is possible but using Alert is safer 
            Alert.alert("Erro", "Ocorreu um erro de conexão ao realizar a compra.");
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.md }]} pointerEvents="none">
                            <Text style={styles.headerTitle}>Loja</Text>
                        </View>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <MaterialCommunityIcons name="close" size={24} color={theme.colors.textPrimary} />
                        </TouchableOpacity>

                        <View style={styles.coinsContainer}>
                            <Text style={styles.coinsText}>{coins}</Text>
                            <View style={{ width: 48, height: 48, justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    autoPlay
                                    loop={true}
                                    style={{ width: 60, height: 60, transform: [{ scale: 0.5 }] }}
                                    source={require('../../assets/lottie/Diamond-azul.json')}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={styles.tabsWrapper}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false} 
                            contentContainerStyle={styles.tabsContainer}
                        >
                            {tabs.map((tab) => (
                                <TouchableOpacity 
                                    key={tab} 
                                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                                    onPress={() => setActiveTab(tab)}
                                >
                                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                        {tab}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {filteredItems.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <MaterialCommunityIcons name="cube-scan" size={60} color="#AFAFAF" />
                                <Text style={styles.emptyTitle}>Nenhum item encontrado</Text>
                                <Text style={styles.emptyText}>Novos itens para esta categoria chegarão em breve!</Text>
                            </View>
                        ) : (
                            filteredItems.map((item) => (
                                <View key={item.id} style={styles.itemCard}>
                                    <View style={styles.imageContainer}>
                                        <MaterialCommunityIcons name={item.icon} size={50} color={item.iconColor} />
                                    </View>
                                    
                                    <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    
                                    <TouchableOpacity 
                                        style={[
                                            styles.itemButton, 
                                            item.price === null ? styles.itemButtonBlue : styles.itemButtonGray
                                        ]}
                                        onPress={() => handlePurchase(item)}
                                    >
                                        <Text style={[
                                            styles.buttonText, 
                                            item.price === null ? styles.buttonTextWhite : styles.buttonTextBlue
                                        ]}>
                                            {item.buttonText}
                                        </Text>
                                        
                                        {item.price !== null && (
                                            <>
                                                <Text style={styles.buttonPriceText}> {item.price} </Text>
                                                <View style={{ width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
                                                    <LottieView
                                                        autoPlay
                                                        loop={true}
                                                        style={{ width: 50, height: 50, transform: [{ scale: 0.35 }] }}
                                                        source={require('../../assets/lottie/Diamond-azul.json')}
                                                    />
                                                </View>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                    
                                    {item.subtext && (
                                        <Text style={styles.subtext}>{item.subtext}</Text>
                                    )}
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity style={[styles.buyTokenButton, { opacity: 0.5 }]} disabled={true}>
                            <Text style={styles.buyTokenText}>Comprar Tokens</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: theme.colors.background || '#F7F7F7',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    closeButton: {
        padding: 5,
        zIndex: 10,
    },
    headerTitle: {
        textAlign: 'center',
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.title,
        color: '#1CB0F6',
    },
    coinsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    coinsText: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: '#1CB0F6',
        marginRight: 4,
    },
    tabsWrapper: {
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
    },
    tab: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        marginRight: theme.spacing.sm,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#1CB0F6',
    },
    tabText: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.bold,
        color: '#AFAFAF',
    },
    activeTabText: {
        color: '#111',
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    },
    emptyTitle: {
        fontSize: theme.fontSizes.lg,
        fontFamily: theme.fonts.bold,
        color: '#111',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.regular,
        color: '#AFAFAF',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    itemCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        ...Platform.select({
            web: {
                boxShadow: '0px 2px 3.84px rgba(0,0,0,0.05)'
            },
            default: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 3.84,
            }
        }),
        elevation: 2,
    },
    imageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    itemDetails: {
        flex: 1,
        alignItems: 'flex-start',
    },
    itemTitle: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.bold,
        color: '#111',
        marginBottom: theme.spacing.sm,
    },
    itemButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        minWidth: 120,
        justifyContent: 'center',
    },
    itemButtonBlue: {
        backgroundColor: '#bcddfc',
    },
    itemButtonGray: {
        backgroundColor: '#E5E5E5',
    },
    buttonText: {
        fontFamily: theme.fonts.bold,
        fontSize: theme.fontSizes.md,
    },
    buttonTextWhite: {
        color: '#1CB0F6', // Blue text for "Abrir"
    },
    buttonTextBlue: {
        color: '#1CB0F6', // Blue text for "Obter: 132"
    },
    buttonPriceText: {
        fontFamily: theme.fonts.bold,
        fontSize: theme.fontSizes.md,
        color: '#1CB0F6',
    },
    subtext: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: '#AFAFAF',
        marginTop: 6,
        alignSelf: 'center',
    },
    footer: {
        backgroundColor: 'white',
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },
    buyTokenButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buyTokenText: {
        color: 'white',
        fontFamily: theme.fonts.bold,
        fontSize: theme.fontSizes.md,
    }
});

export default ShopModal;

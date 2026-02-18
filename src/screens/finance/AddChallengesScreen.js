import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CHALLENGE_TEMPLATES = [
    { 
        id: 'guardando-dinheiro', 
        title: 'Guardando Dinheiro', 
        subtitle: 'Focado em economia mensal recorrente.', 
        icon: 'piggy-bank', 
        iconType: 'MaterialCommunityIcons',
        color: '#3b82f6',
        defaultGoal: 1000
    },
    { 
        id: 'desafio-chines', 
        title: 'Desafio Chinês', 
        subtitle: 'Junte dinheiro de forma crescente.', 
        icon: 'grid-outline', 
        iconType: 'Ionicons',
        color: '#0ea5e9',
        defaultGoal: 2000
    },
    { 
        id: '52-semanas', 
        title: '52 Semanas', 
        subtitle: 'O clássico para poupar o ano todo.', 
        icon: 'calendar-outline', 
        iconType: 'Ionicons',
        color: '#8b5cf6',
        defaultGoal: 1378
    },
    { 
        id: 'meta-livre', 
        title: 'Meta Livre', 
        subtitle: 'Crie um objetivo personalizado agora.', 
        icon: 'rocket-outline', 
        iconType: 'Ionicons',
        color: '#f59e0b',
        defaultGoal: 0
    },
];

const AddChallengesScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = auth.currentUser;

    const startChallenge = async (template) => {
        if (!user) return;
        try {
            await addDoc(collection(db, "user_challenges"), {
                userId: user.uid,
                templateId: template.id,
                title: template.title,
                iconName: template.icon,
                iconType: template.iconType,
                color: template.color,
                goalAmount: template.defaultGoal,
                currentAmount: 0,
                status: 'active',
                createdAt: serverTimestamp(),
            });
            navigation.goBack();
        } catch (error) {
            console.error("Error starting challenge:", error);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Novo Desafio</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionSubtitle}>Escolha um modelo de desafio para começar a poupar</Text>
                
                <View style={styles.grid}>
                    {CHALLENGE_TEMPLATES.map((item) => (
                        <TouchableOpacity 
                            key={item.id} 
                            style={styles.card}
                            activeOpacity={0.7}
                            onPress={() => startChallenge(item)}
                        >
                            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                                {item.iconType === 'Ionicons' ? (
                                    <Ionicons name={item.icon} size={32} color={item.color} />
                                ) : (
                                    <MaterialCommunityIcons name={item.icon} size={32} color={item.color} />
                                )}
                            </View>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardDesc}>{item.subtitle}</Text>
                            
                            <View style={styles.addButton}>
                                <Text style={[styles.addButtonText, { color: item.color }]}>Começar</Text>
                                <Ionicons name="arrow-forward" size={14} color={item.color} />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    backButton: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontFamily: theme.fonts.title,
        fontSize: 20,
        color: '#000',
    },
    scrollContent: {
        padding: 20,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 25,
        lineHeight: 22,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    card: {
        width: '47.5%',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 5,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 12,
        color: '#94A3B8',
        lineHeight: 16,
        marginBottom: 15,
        height: 32,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    addButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});

export default AddChallengesScreen;

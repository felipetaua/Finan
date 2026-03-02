import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView, 
    Image, 
    FlatList, 
    Dimensions, 
    Modal, 
    Platform,
    ActivityIndicator,
    TextInput
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebaseConfig';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const BANNERS = [
    {
        id: '1',
        title: 'BANNER DESAFIOS',
        subtitle: 'Tem dificuldades para guardar dinheiro experimente esses desafios.',
        color: '#84C9FB',
        icon: 'trophy',
    },
    {
        id: '2',
        title: 'NOVIDADE',
        subtitle: 'Novos desafios mensais chegando para você!',
        color: '#F87171',
        icon: 'star',
    },
    {
        id: '3',
        title: 'DESAFIO CHINES',
        subtitle: 'Conheça a melhor forma da guardar dinheiro!',
        color: '#0EA5E9',
        icon: 'medal',
    }
];

const CHALLENGE_TEMPLATES = [
    {
        id: 'reserva-emergencia',
        title: 'Reserva de Emergência',
        subtitle: 'Crie sua reserva de emergencia',
        icon: 'alert-circle',
        iconType: 'Ionicons',
        color: '#F87171',
        defaultGoal: 1000,
        explanation: 'Preparado para aqueles momento que as contas apertarem.'
    },
    { 
        id: 'guardando-dinheiro', 
        title: 'Guardando Dinheiro', 
        subtitle: 'Desafios focados em economia.', 
        icon: 'piggy-bank', 
        iconType: 'MaterialCommunityIcons',
        color: '#3b82f6',
        defaultGoal: 1000,
        explanation: 'Focado em economia mensal recorrente para te ajudar a criar consistência.'
    },
    { 
        id: 'desafio-chines', 
        title: 'Desafio Chinês', 
        subtitle: 'Junte dinheiro de forma mais livre.', 
        icon: 'grid-outline', 
        iconType: 'Ionicons',
        color: '#0ea5e9',
        defaultGoal: 2000,
        explanation: 'O Desafio Chinês permite economizar valores crescentes conforme sua capacidade.'
    },
    { 
        id: '52-semanas', 
        title: '52 Semanas', 
        subtitle: 'O clássico para poupar o ano todo.', 
        icon: 'calendar-outline', 
        iconType: 'Ionicons',
        color: '#8b5cf6',
        defaultGoal: 1378,
        explanation: 'Comece com pouco e aumente 1 real a cada semana durante um ano.'
    },
    { 
        id: 'meta-livre', 
        title: 'Meta Livre', 
        subtitle: 'Crie um objetivo personalizado agora.', 
        icon: 'rocket-outline', 
        iconType: 'Ionicons',
        color: '#f59e0b',
        defaultGoal: 0,
        explanation: 'Personalize sua própria meta com o valor e tempo que você desejar.'
    },
];

const AddChallengesScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = auth.currentUser;

    const [startedChallenges, setStartedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [isTemplateModalVisible, setIsTemplateModalVisible] = useState(false);
    const [isTypeSelectionModalVisible, setIsTypeSelectionModalVisible] = useState(false);
    const [selectedChallengeDetail, setSelectedChallengeDetail] = useState(null);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [operationType, setOperationType] = useState('add'); // 'add' or 'subtract'
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'Bom dia';
        if (hour >= 12 && hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "user_challenges"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const challenges = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStartedChallenges(challenges);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);

    const startChallenge = async (template) => {
        setIsTemplateModalVisible(false);
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
        } catch (error) {
            console.error("Error starting challenge:", error);
        }
    };

    const handleUpdateChallengeValue = async () => {
        if (!selectedChallengeDetail || !amountToAdd || isSubmitting) return;
        
        const value = parseFloat(amountToAdd.replace(',', '.'));
        if (isNaN(value) || value <= 0) return;

        setIsSubmitting(true);
        try {
            const challengeRef = doc(db, "user_challenges", selectedChallengeDetail.id);
            const finalValue = operationType === 'add' ? value : -value;
            
            await updateDoc(challengeRef, {
                currentAmount: increment(finalValue)
            });
            
            setAmountToAdd('');
            setIsDetailModalVisible(false);
            setSelectedChallengeDetail(null);
        } catch (error) {
            console.error("Error updating challenge value:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
    };

    const renderBanner = ({ item }) => (
        <View style={[styles.bannerCard, { backgroundColor: item.color }]}>
            <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>{item.title}</Text>
                <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            </View>
            <View style={styles.bannerIconContainer}>
                <MaterialCommunityIcons name={item.icon} size={60} color="#FFF" />
            </View>
        </View>
    );

    const renderCategory = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoryCard} 
            activeOpacity={0.7}
            onPress={() => {
                setSelectedTemplate(item);
                setIsTemplateModalVisible(true);
            }}
        >
            <View style={[styles.categoryIconBox, { backgroundColor: item.color + '15' }]}>
                {item.iconType === 'Ionicons' ? (
                    <Ionicons name={item.icon} size={28} color={item.color} />
                ) : (
                    <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
                )}
            </View>
            <Text style={styles.categoryTitle}>{item.title}</Text>
            <Text style={styles.categorySubtitle} numberOfLines={2}>{item.subtitle}</Text>
        </TouchableOpacity>
    );

    const renderStartedChallenge = (item) => {
        const progress = Math.min(((item.currentAmount || 0) / (item.goalAmount || 1)) * 100, 100);
        return (
            <TouchableOpacity 
                key={item.id} 
                style={styles.startedChallengeCard}
                activeOpacity={0.7}
                onPress={() => {
                    setSelectedChallengeDetail(item);
                    setIsDetailModalVisible(true);
                }}
            >
                <View style={styles.startedChallengeHeader}>
                    <View style={styles.startedChallengeLeft}>
                        <View style={[styles.startedChallengeIconBox, { backgroundColor: '#F3F4F6' }]}>
                            {item.iconType === 'Ionicons' ? (
                                <Ionicons name={item.iconName} size={24} color={item.color || '#3b82f6'} />
                            ) : (
                                <MaterialCommunityIcons name={item.iconName} size={24} color={item.color || '#3b82f6'} />
                            )}
                        </View>
                        <View>
                            <Text style={styles.startedChallengeTitle}>{item.title}</Text>
                            <Text style={styles.startedChallengePercent}>{Math.round(progress)}% completo</Text>
                        </View>
                    </View>
                    <View style={styles.startedChallengeRight}>
                        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                        <Text style={[styles.startedChallengeAmount, { color: item.color || '#22C55E' }]}>
                            {formatCurrency(item.currentAmount || 0)}
                        </Text>
                    </View>
                </View>
                <View style={styles.startedChallengeBarBg}>
                    <View style={[styles.startedChallengeBarFill, { width: `${progress}%`, backgroundColor: item.color || '#3b82f6' }]} />
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back-outline" size={24} color="#0F172A" />
                </TouchableOpacity>
                <Text style={styles.title}>Desafios</Text>
                <TouchableOpacity 
                    style={styles.headerActionButton}
                    onPress={() => setIsTypeSelectionModalVisible(true)}
                >
                    <Ionicons name="add" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Horizontal Banner Carousel */}
                <View style={styles.bannerContainer}>
                    <FlatList
                        data={BANNERS}
                        renderItem={renderBanner}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={width - 40 + 15}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        contentContainerStyle={styles.bannerList}
                        onMomentumScrollEnd={(e) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40 + 15));
                            setActiveBannerIndex(index);
                        }}
                    />
                    <View style={styles.pagination}>
                        {BANNERS.map((_, i) => (
                            <View 
                                key={i} 
                                style={[
                                    styles.paginationDot, 
                                    { backgroundColor: i === activeBannerIndex ? '#475569' : '#CBD5E1' }
                                ]} 
                            />
                        ))}
                    </View>
                </View>

                {/* Categories Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Categorias</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionDetails}>Detalhes</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={CHALLENGE_TEMPLATES}
                    renderItem={renderCategory}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />

                {/* Started Challenges Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Desafios Iniciados</Text>
                    <TouchableOpacity>
                        <Text style={styles.sectionDetails}>Minimizar</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={styles.startedChallengesContainer}>
                    {loading ? (
                        <ActivityIndicator color={theme.colors.primary} />
                    ) : startedChallenges.length > 0 ? (
                        startedChallenges.map(item => renderStartedChallenge(item))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>Você ainda não iniciou nenhum desafio.</Text>
                        </View>
                    )}
                </View>

                {/* Create Challenge Button */}
                <TouchableOpacity 
                    style={styles.createMainButton}
                    onPress={() => setIsTypeSelectionModalVisible(true)}
                >
                    <Ionicons name="add-circle" size={24} color="#FFF" />
                    <Text style={styles.createMainButtonText}>Criar Novo Desafio</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* Type Selection Modal */}
            <Modal
                visible={isTypeSelectionModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsTypeSelectionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity 
                        style={styles.modalDismissOverlay} 
                        activeOpacity={1} 
                        onPress={() => setIsTypeSelectionModalVisible(false)} 
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Escolha o Desafio</Text>
                            <TouchableOpacity onPress={() => setIsTypeSelectionModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.selectionList}>
                            {CHALLENGE_TEMPLATES.map((item) => (
                                <TouchableOpacity 
                                    key={item.id}
                                    style={styles.selectionItem}
                                    onPress={() => {
                                        setIsTypeSelectionModalVisible(false);
                                        setSelectedTemplate(item);
                                        setIsTemplateModalVisible(true);
                                    }}
                                >
                                    <View style={[styles.selectionIconBox, { backgroundColor: item.color + '15' }]}>
                                        {item.iconType === 'Ionicons' ? (
                                            <Ionicons name={item.icon} size={24} color={item.color} />
                                        ) : (
                                            <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                                        )}
                                    </View>
                                    <View style={styles.selectionTextContainer}>
                                        <Text style={styles.selectionTitle}>{item.title}</Text>
                                        <Text style={styles.selectionSubtitle}>{item.subtitle}</Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Template Explanation Modal */}
            <Modal
                visible={isTemplateModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsTemplateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{selectedTemplate?.title}</Text>
                            <TouchableOpacity onPress={() => setIsTemplateModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.modalDesc}>{selectedTemplate?.explanation}</Text>
                        <View style={styles.modalGoalBox}>
                            <Text style={styles.modalGoalLabel}>Meta Sugerida:</Text>
                            <Text style={styles.modalGoalValue}>{selectedTemplate?.defaultGoal ? formatCurrency(selectedTemplate.defaultGoal) : 'Personalizada'}</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.modalStartButton, { backgroundColor: selectedTemplate?.color || theme.colors.primary }]}
                            onPress={() => startChallenge(selectedTemplate)}
                        >
                            <Text style={styles.modalStartButtonText}>Iniciar Desafio Agora</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Started Challenge Detail Modal */}
            <Modal
                visible={isDetailModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsDetailModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Detalhes do Desafio</Text>
                            <TouchableOpacity onPress={() => setIsDetailModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {selectedChallengeDetail && (
                            <View>
                                <View style={styles.detailCard}>
                                    <View style={[styles.detailIconBox, { backgroundColor: selectedChallengeDetail.color + '15' }]}>
                                        <MaterialCommunityIcons name={selectedChallengeDetail.iconName} size={40} color={selectedChallengeDetail.color} />
                                    </View>
                                    <Text style={styles.detailTitle}>{selectedChallengeDetail.title}</Text>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Meta:</Text>
                                        <Text style={styles.detailValue}>{formatCurrency(selectedChallengeDetail.goalAmount)}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Acumulado:</Text>
                                        <Text style={styles.detailValue}>{formatCurrency(selectedChallengeDetail.currentAmount)}</Text>
                                    </View>
                                    
                                    <View style={styles.addValueContainer}>
                                        <View style={styles.operationToggle}>
                                            <TouchableOpacity 
                                                style={[styles.opButton, operationType === 'add' && styles.opButtonActive]}
                                                onPress={() => setOperationType('add')}
                                            >
                                                <Ionicons name="add-circle" size={20} color={operationType === 'add' ? '#FFF' : '#94A3B8'} />
                                                <Text style={[styles.opButtonText, operationType === 'add' && styles.opButtonTextActive]}>Adicionar</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.opButton, operationType === 'subtract' && styles.opButtonActiveSubtract]}
                                                onPress={() => setOperationType('subtract')}
                                            >
                                                <Ionicons name="remove-circle" size={20} color={operationType === 'subtract' ? '#FFF' : '#94A3B8'} />
                                                <Text style={[styles.opButtonText, operationType === 'subtract' && styles.opButtonTextActive]}>Retirar</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <View style={styles.inputWrapper}>
                                            <Text style={styles.currencyPrefix}>R$</Text>
                                            <TextInput
                                                style={styles.amountInput}
                                                placeholder="0,00"
                                                keyboardType="numeric"
                                                value={amountToAdd}
                                                onChangeText={setAmountToAdd}
                                                disabled={isSubmitting}
                                            />
                                        </View>
                                        <TouchableOpacity 
                                            style={[
                                                styles.confirmAddButton, 
                                                { backgroundColor: operationType === 'add' ? (selectedChallengeDetail.color || '#3b82f6') : '#EF4444' }
                                            ]}
                                            onPress={handleUpdateChallengeValue}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <ActivityIndicator color="#FFF" />
                                            ) : (
                                                <Text style={styles.confirmAddButtonText}>
                                                    {operationType === 'add' ? 'Confirmar Aporte' : 'Confirmar Retirada'}
                                                </Text>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        )}
                        <TouchableOpacity 
                            style={styles.modalCloseButton}
                            onPress={() => setIsDetailModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#0F172A',
        flex: 1,
        textAlign: 'center',
        fontFamily: theme.fonts.title,
    },
    headerActionButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    greetingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    nameText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
        flex: 1,
    },
    headerExtraIcon: {
        flexDirection: 'row',
        gap: 12,
    },
    sparklesButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planRow: {
        flexDirection: 'row',
        marginTop: 2,
    },
    planLabel: {
        fontSize: 16,
        color: '#94A3B8',
    },
    planText: {
        fontSize: 16,
        color: '#0EA5E9',
        fontWeight: '600',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    bannerContainer: {
        marginVertical: 4,
    },
    bannerList: {
        paddingHorizontal: 20,
        paddingBottom: 5,
    },
    bannerCard: {
        width: width - 40,
        height: 160,
        borderRadius: 32,
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 15,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 2,
        marginBottom: 8,
    },
    bannerSubtitle: {
        fontSize: 14,
        color: '#000',
        opacity: 0.8,
        fontWeight: '600',
        lineHeight: 18,
    },
    bannerIconContainer: {
        marginLeft: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 25,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: theme.fonts.title,
        color: '#0F172A',
    },
    sectionDetails: {
        fontSize: 14,
        color: '#94A3B8',
        fontWeight: '500',
    },
    categoriesList: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 15,
    },
    categoryCard: {
        width: 160,
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
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
    categoryIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    categoryTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 4,
    },
    categorySubtitle: {
        fontSize: 11,
        color: '#94A3B8',
        lineHeight: 14,
    },
    startedChallengesContainer: {
        paddingHorizontal: 20,
        gap: 12,
    },
    startedChallengeCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 16,
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
                elevation: 2,
            },
        }),
    },
    startedChallengeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    startedChallengeLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    startedChallengeIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startedChallengeTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    startedChallengePercent: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    startedChallengeRight: {
        alignItems: 'flex-end',
    },
    startedChallengeAmount: {
        fontSize: 14,
        fontWeight: '700',
        marginTop: 4,
    },
    startedChallengeBarBg: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    startedChallengeBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    createMainButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3b82f6',
        marginHorizontal: 20,
        marginTop: 30,
        padding: 16,
        borderRadius: 20,
        gap: 8,
    },
    createMainButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#94A3B8',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalDismissOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    selectionList: {
        marginTop: 10,
    },
    selectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    selectionIconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    selectionTextContainer: {
        flex: 1,
    },
    selectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    selectionSubtitle: {
        fontSize: 12,
        color: '#64748B',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalDesc: {
        fontSize: 16,
        color: '#64748B',
        lineHeight: 24,
        marginBottom: 25,
    },
    modalGoalBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        marginBottom: 25,
    },
    modalGoalLabel: {
        fontSize: 16,
        color: '#64748B',
    },
    modalGoalValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    modalStartButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalStartButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    detailCard: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    detailIconBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    detailTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    detailLabel: {
        fontSize: 16,
        color: '#64748B',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    addValueContainer: {
        width: '100%',
        marginTop: 25,
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 24,
    },
    operationToggle: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: 14,
        padding: 4,
        marginBottom: 20,
    },
    opButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 6,
    },
    opButtonActive: {
        backgroundColor: '#3b82f6',
    },
    opButtonActiveSubtract: {
        backgroundColor: '#EF4444',
    },
    opButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    opButtonTextActive: {
        color: '#FFF',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingHorizontal: 16,
        height: 56,
        marginBottom: 15,
    },
    currencyPrefix: {
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
        marginRight: 5,
    },
    amountInput: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#0F172A',
    },
    confirmAddButton: {
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    confirmAddButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    modalCloseButton: {
        marginTop: 20,
        padding: 16,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AddChallengesScreen;

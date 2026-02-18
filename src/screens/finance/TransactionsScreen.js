import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, TextInput, ActivityIndicator, Modal, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../../services/firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const TransactionsScreen = () => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const user = auth.currentUser;
    const [searchQuery, setSearchQuery] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Selection state
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);

    // Modal state
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [editAmount, setEditAmount] = useState('');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const toggleSelection = (id) => {
        setSelectedIds(prev => prev.includes(id) 
            ? prev.filter(i => i !== id) 
            : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        Alert.alert(
            "Excluir selecionadas",
            `Deseja excluir as ${selectedIds.length} transações selecionadas?`,
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            setLoading(true);
                            for (const id of selectedIds) {
                                const transRef = doc(db, "transactions", id);
                                await deleteDoc(transRef);
                            }
                            setSelectedIds([]);
                            setIsSelectionMode(false);
                            setLoading(false);
                        } catch (error) {
                            console.error("Error bulk deleting transactions:", error);
                            Alert.alert("Erro", "Não foi possível excluir as transações.");
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleEditPress = (item) => {
        setSelectedTransaction(item);
        setEditAmount(item.amount.toString());
        setEditModalVisible(true);
    };

    const handleUpdate = async () => {
        if (!selectedTransaction) return;
        try {
            const transRef = doc(db, "transactions", selectedTransaction.id);
            await updateDoc(transRef, {
                amount: parseFloat(editAmount.replace(',', '.'))
            });
            setEditModalVisible(false);
        } catch (error) {
            console.error("Error updating transaction:", error);
            Alert.alert("Erro", "Não foi possível atualizar a transação.");
        }
    };

    const handleDelete = async () => {
        if (!selectedTransaction) return;
        Alert.alert(
            "Excluir transação",
            "Tem certeza que deseja excluir esta transação?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive", 
                    onPress: async () => {
                        try {
                            const transRef = doc(db, "transactions", selectedTransaction.id);
                            await deleteDoc(transRef);
                            setEditModalVisible(false);
                        } catch (error) {
                            console.error("Error deleting transaction:", error);
                            Alert.alert("Erro", "Não foi possível excluir a transação.");
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let transList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Group by date
            const grouped = transList.reduce((acc, obj) => {
                const date = obj.date ? new Date(obj.date.seconds * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' }) : 'Recent';
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(obj);
                return acc;
            }, {});

            const sections = Object.keys(grouped).map(date => ({
                title: date,
                data: grouped[date].sort((a,b) => (b.date?.seconds || 0) - (a.date?.seconds || 0))
            })).sort((a, b) => {
                return 0; 
            });

            setTransactions(sections);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching transactions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const filteredTransactions = transactions.filter(section => {
        const filteredData = section.data.filter(item => 
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        return filteredData.length > 0;
    }).map(section => ({
        ...section,
        data: section.data.filter(item => 
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }));

    const renderTransactionItem = ({ item }) => {
        const isSelected = selectedIds.includes(item.id);

        return (
            <TouchableOpacity 
                style={[
                    styles.transactionCard, 
                    isSelected && { borderColor: theme.colors.primary, borderWidth: 1.5, backgroundColor: '#F0F7FF' }
                ]}
                onPress={() => isSelectionMode ? toggleSelection(item.id) : null}
                onLongPress={() => isSelectionMode ? null : handleEditPress(item)}
                activeOpacity={0.7}
            >
                {isSelectionMode && (
                    <View style={styles.selectionIndicator}>
                        <Ionicons 
                            name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                            size={20} 
                            color={isSelected ? theme.colors.primary : "#CCC"} 
                        />
                    </View>
                )}
                <View style={[styles.iconContainer, { backgroundColor: (item.categoryColor || '#EEE') + '15' }]}>
                    <MaterialCommunityIcons 
                        name={item.categoryIcon || 'cash'} 
                        size={24} 
                        color={item.categoryColor || theme.colors.textPrimary} 
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <View style={styles.row}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                        <View style={styles.amountEditRow}>
                            <Text style={[styles.amount, { color: item.type === 'expense' ? '#FF5252' : '#4CAF50' }]}>
                                {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.subText} numberOfLines={1}>{item.category || 'Outros'}</Text>
                        <Text style={styles.dateText}>
                            {item.date ? new Date(item.date.seconds * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSectionHeader = ({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View>
                        <Text style={styles.headerTitle}>Transações</Text>
                        <Text style={styles.accountInfo}>Conta Finan</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    {isSelectionMode ? (
                        <>
                            <TouchableOpacity 
                                style={[styles.editHeaderButton, { backgroundColor: '#FFEEF0' }, selectedIds.length === 0 && { opacity: 0.5 }]} 
                                onPress={handleBulkDelete}
                                disabled={selectedIds.length === 0}
                            >
                                <Ionicons name="trash-outline" size={18} color="#FF5252" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editHeaderButton} onPress={() => {
                                setIsSelectionMode(false);
                                setSelectedIds([]);
                            }}>
                                <Text style={styles.editHeaderText}>Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity style={styles.editHeaderButton} onPress={() => setIsSelectionMode(true)}>
                            <Text style={styles.editHeaderText}>Editar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInner}>
                    <Ionicons name="search-outline" size={18} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Pesquisar transações..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>
            </View>

            {/* Transaction List */}
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : filteredTransactions.length > 0 ? (
                <SectionList
                    sections={filteredTransactions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTransactionItem}
                    renderSectionHeader={renderSectionHeader}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
                </View>
            )}

            {/* Modal de Edição */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay} 
                    activeOpacity={1} 
                    onPress={() => setEditModalVisible(false)}
                >
                    <View 
                        style={styles.modalContainer}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalIndicator} />
                        <Text style={styles.modalTitle}>Editar Transação</Text>
                        
                        {selectedTransaction && (
                            <View style={styles.modalTransactionHeader}>
                                <View style={[styles.modalIconBox, { backgroundColor: (selectedTransaction.categoryColor || '#EEE') + '15' }]}>
                                    <MaterialCommunityIcons 
                                        name={selectedTransaction.categoryIcon || 'cash'} 
                                        size={24} 
                                        color={selectedTransaction.categoryColor || theme.colors.textPrimary} 
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalTransactionName}>{selectedTransaction.description}</Text>
                                    <Text style={styles.modalTransactionSub}>{selectedTransaction.category || 'Outros'}</Text>
                                </View>
                            </View>
                        )}
                        
                        <View style={styles.modalInputGroup}>
                            <Text style={styles.modalLabel}>Valor (R$)</Text>
                            <TextInput
                                style={styles.modalInput}
                                value={editAmount}
                                onChangeText={setEditAmount}
                                keyboardType="numeric"
                                placeholder="0,00"
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={[styles.modalBtn, styles.modalBtnDelete]} onPress={handleDelete}>
                                <Ionicons name="trash-outline" size={20} color="#FF5252" />
                            </TouchableOpacity>
                            
                            <View style={styles.modalRightActions}>
                                <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setEditModalVisible(false)}>
                                    <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity style={styles.modalBtnSave} onPress={handleUpdate}>
                                    <Text style={styles.modalBtnTextSave}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>
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
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 15,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: 5,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 15,
    },
    flagIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#002664',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        color: '#000',
        fontFamily: theme.fonts.title,
    },
    accountInfo: {
        fontSize: 12,
        color: '#666',
    },
    calendarButton: {
        padding: 5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    editHeaderButton: {
        marginRight: 10,
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editHeaderText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    bulkDeleteButton: {
        marginRight: 15,
        padding: 5,
    },
    searchContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: 15,
        marginTop: 25,
        marginBottom: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#EEE',
        height: 44,
        justifyContent: 'center',
    },
    searchInner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#000',
        padding: 0,
    },
    amountEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniEditButton: {
        paddingLeft: 8,
        paddingVertical: 4,
    },
    sectionHeader: {
        fontSize: 14,
        color: '#999',
        marginHorizontal: 15,
        marginTop: 20,
        marginBottom: 8,
    },
    listContent: {
        paddingBottom: 20,
    },
    transactionCard: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 4,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    selectionIndicator: {
        marginRight: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginRight: 10,
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
    },
    subText: {
        flex: 1,
        fontSize: 13,
        color: '#666',
        marginRight: 10,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        width: '100%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        paddingVertical: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    modalIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalTransactionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    modalIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    modalTransactionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    modalTransactionSub: {
        fontSize: 12,
        color: '#666',
    },
    modalLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    modalInput: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalBtn: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBtnDelete: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF1F1',
    },
    modalBtnCancel: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
    },
    modalBtnTextCancel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    modalBtnSave: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    modalBtnTextSave: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
});

export default TransactionsScreen;

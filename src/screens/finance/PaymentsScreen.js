import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { auth, db } from '../../services/firebaseConfig';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';
import { useCurrency } from '../../context/CurrencyContext';

const CATEGORY_OPTIONS = [
    { id: 'moradia',     label: 'Moradia',       icon: 'home-outline',           color: '#10AC84' },
    { id: 'energia',     label: 'Energia',        icon: 'flash-outline',          color: '#F7B731' },
    { id: 'agua',        label: 'Água',           icon: 'water-outline',          color: '#54A0FF' },
    { id: 'internet',    label: 'Internet',       icon: 'wifi-outline',           color: '#5F27CD' },
    { id: 'cartao',      label: 'Cartão',         icon: 'card-outline',           color: '#EE5253' },
    { id: 'saude',       label: 'Saúde',          icon: 'medkit-outline',         color: '#FF6B6B' },
    { id: 'educacao',    label: 'Educação',       icon: 'school-outline',         color: '#00D2D3' },
    { id: 'transporte',  label: 'Transporte',     icon: 'car-outline',            color: '#2E86DE' },
    { id: 'streaming',   label: 'Streaming',      icon: 'play-circle-outline',    color: '#E84393' },
    { id: 'outros',      label: 'Outros',         icon: 'ellipsis-horizontal-outline', color: '#8395a7' },
];

const STATUS_CONFIG = {
    pending:   { label: 'Pendente',   color: '#F7B731', bg: '#FFF9E6', icon: 'time-outline' },
    overdue:   { label: 'Atrasado',   color: '#EE5253', bg: '#FFF0F0', icon: 'alert-circle-outline' },
    paid:      { label: 'Pago',       color: '#10AC84', bg: '#F0FFF8', icon: 'checkmark-circle-outline' },
};

const today = () => new Date();

const dueDateStatus = (dueDateStr) => {
    if (!dueDateStr) return 'pending';
    const [day, month, year] = dueDateStr.split('/').map(Number);
    const due = new Date(year, month - 1, day);
    const now = today();
    now.setHours(0, 0, 0, 0);
    if (due < now) return 'overdue';
    return 'pending';
};

const formatDueDate = (str) => str || '—';

// ── helpers ──────────────────────────────────────────────────────────────────

const buildPayment = (fields, userId, currencyCode) => ({
    userId,
    currencyCode,
    name: fields.name.trim(),
    amount: parseFloat(fields.amount.replace(',', '.')) || 0,
    dueDate: fields.dueDate.trim(),
    categoryId: fields.categoryId,
    notes: fields.notes.trim(),
    paid: false,
    createdAt: serverTimestamp(),
});

const emptyFields = () => ({
    name: '',
    amount: '',
    dueDate: '',
    categoryId: 'outros',
    notes: '',
});

// ── Component ─────────────────────────────────────────────────────────────────

const PaymentsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const user = auth.currentUser;
    const { formatCurrency, currencySymbol, currencyCode } = useCurrency();

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'overdue' | 'paid'

    // modal add/edit
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [fields, setFields] = useState(emptyFields());
    const [saving, setSaving] = useState(false);

    // ── Firestore listener ────────────────────────────────────────────────────

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'payments'), where('userId', '==', user.uid));
        const unsub = onSnapshot(q, (snap) => {
            const docs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            // sort: overdue first, then upcoming by dueDate
            docs.sort((a, b) => {
                if (a.paid !== b.paid) return a.paid ? 1 : -1;
                return (a.dueDate || '').localeCompare(b.dueDate || '');
            });
            setPayments(docs);
            setLoading(false);
        });
        return unsub;
    }, [user]);

    // ── derived list ─────────────────────────────────────────────────────────

    const displayList = payments.filter((p) => {
        if (filter === 'all') return true;
        if (filter === 'paid') return p.paid;
        const st = p.paid ? 'paid' : dueDateStatus(p.dueDate);
        return st === filter;
    });

    // ── summary ──────────────────────────────────────────────────────────────

    const totalPending = payments
        .filter((p) => !p.paid)
        .reduce((acc, p) => acc + (p.amount || 0), 0);
    const countOverdue = payments.filter(
        (p) => !p.paid && dueDateStatus(p.dueDate) === 'overdue'
    ).length;

    // ── actions ──────────────────────────────────────────────────────────────

    const openAdd = () => {
        setEditingId(null);
        setFields(emptyFields());
        setIsModalVisible(true);
    };

    const openEdit = (item) => {
        setEditingId(item.id);
        setFields({
            name: item.name || '',
            amount: item.amount != null ? String(item.amount).replace('.', ',') : '',
            dueDate: item.dueDate || '',
            categoryId: item.categoryId || 'outros',
            notes: item.notes || '',
        });
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        if (!fields.name.trim() || !fields.amount) {
            Alert.alert('Ops!', 'Preencha pelo menos o nome e o valor.');
            return;
        }
        setSaving(true);
        try {
            if (editingId) {
                await updateDoc(doc(db, 'payments', editingId), {
                    name: fields.name.trim(),
                    amount: parseFloat(fields.amount.replace(',', '.')) || 0,
                    dueDate: fields.dueDate.trim(),
                    categoryId: fields.categoryId,
                    notes: fields.notes.trim(),
                    currencyCode,
                });
            } else {
                await addDoc(collection(db, 'payments'), buildPayment(fields, user.uid, currencyCode));
            }
            setIsModalVisible(false);
        } catch (e) {
            console.error(e);
            Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const togglePaid = async (item) => {
        await updateDoc(doc(db, 'payments', item.id), { paid: !item.paid });
    };

    const handleDelete = (item) => {
        Alert.alert(
            'Excluir cobrança',
            `Deseja excluir "${item.name}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteDoc(doc(db, 'payments', item.id));
                    },
                },
            ]
        );
    };

    // ── render helpers ────────────────────────────────────────────────────────

    const categoryOf = (id) =>
        CATEGORY_OPTIONS.find((c) => c.id === id) || CATEGORY_OPTIONS[CATEGORY_OPTIONS.length - 1];

    const renderItem = (item) => {
        const cat = categoryOf(item.categoryId);
        const status = item.paid ? 'paid' : dueDateStatus(item.dueDate);
        const st = STATUS_CONFIG[status];

        return (
            <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => openEdit(item)}
            >
                {/* left icon */}
                <View style={[styles.cardIcon, { backgroundColor: cat.color + '18' }]}>
                    <Ionicons name={cat.icon} size={22} color={cat.color} />
                </View>

                {/* content */}
                <View style={styles.cardContent}>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                        <Text style={[styles.cardAmount, item.paid && styles.cardAmountPaid]}>
                            {formatCurrency(item.amount || 0)}
                        </Text>
                    </View>
                    <View style={styles.cardRow}>
                        <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                            <Ionicons name={st.icon} size={11} color={st.color} />
                            <Text style={[styles.statusText, { color: st.color }]}>{st.label}</Text>
                        </View>
                        {item.dueDate ? (
                            <Text style={styles.cardDate}>Venc. {formatDueDate(item.dueDate)}</Text>
                        ) : null}
                    </View>
                    {item.notes ? (
                        <Text style={styles.cardNotes} numberOfLines={1}>{item.notes}</Text>
                    ) : null}
                </View>

                {/* paid toggle */}
                <TouchableOpacity
                    style={[styles.checkBtn, item.paid && styles.checkBtnActive]}
                    onPress={() => togglePaid(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons
                        name={item.paid ? 'checkmark' : 'checkmark-outline'}
                        size={18}
                        color={item.paid ? '#FFF' : '#CBD5E1'}
                    />
                </TouchableOpacity>

                {/* delete */}
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="trash-outline" size={16} color="#EE5253" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    // ── JSX ───────────────────────────────────────────────────────────────────

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Contas a Pagar</Text>
                <TouchableOpacity style={styles.addButton} onPress={openAdd}>
                    <Ionicons name="add" size={26} color="#000" />
                </TouchableOpacity>
            </View>

            {/* Summary cards */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Total pendente</Text>
                    <Text style={[styles.summaryValue, { color: '#EE5253' }]}>
                        {formatCurrency(totalPending)}
                    </Text>
                </View>
                <View style={[styles.summaryCard, { backgroundColor: countOverdue > 0 ? '#FFF0F0' : '#F9FAFB' }]}>
                    <Text style={styles.summaryLabel}>Atrasadas</Text>
                    <Text style={[styles.summaryValue, { color: countOverdue > 0 ? '#EE5253' : '#9CA3AF' }]}>
                        {countOverdue}
                    </Text>
                </View>
            </View>

            {/* Filter tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {[
                    { key: 'all',     label: 'Todas' },
                    { key: 'overdue', label: 'Atrasadas' },
                    { key: 'pending', label: 'Pendentes' },
                    { key: 'paid',    label: 'Pagas' },
                ].map((f) => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* List */}
            {loading ? (
                <ActivityIndicator style={{ marginTop: 40 }} color="#000" />
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    {displayList.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-done-circle-outline" size={52} color="#E5E7EB" />
                            <Text style={styles.emptyText}>Nenhuma conta aqui.</Text>
                            <TouchableOpacity style={styles.emptyAddBtn} onPress={openAdd}>
                                <Text style={styles.emptyAddText}>Adicionar conta</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        displayList.map(renderItem)
                    )}
                </ScrollView>
            )}

            {/* Add/Edit Modal */}
            <Modal
                visible={isModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsModalVisible(false)}
                >
                    <View style={styles.modalSheet}>
                        {/* drag handle */}
                        <View style={styles.modalHandle} />

                        <Text style={styles.modalTitle}>
                            {editingId ? 'Editar conta' : 'Nova conta'}
                        </Text>

                        {/* Name */}
                        <Text style={styles.fieldLabel}>Nome</Text>
                        <TextInput
                            style={styles.fieldInput}
                            placeholder="Ex: Conta de luz"
                            placeholderTextColor="#CBD5E1"
                            value={fields.name}
                            onChangeText={(v) => setFields({ ...fields, name: v })}
                        />

                        {/* Amount */}
                        <Text style={styles.fieldLabel}>Valor</Text>
                        <View style={styles.amountRow}>
                            <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                            <TextInput
                                style={[styles.fieldInput, { flex: 1, marginBottom: 0 }]}
                                placeholder="0,00"
                                placeholderTextColor="#CBD5E1"
                                keyboardType="numeric"
                                value={fields.amount}
                                onChangeText={(v) => setFields({ ...fields, amount: v })}
                            />
                        </View>

                        {/* Due date */}
                        <Text style={[styles.fieldLabel, { marginTop: 16 }]}>
                            Vencimento (DD/MM/AAAA)
                        </Text>
                        <TextInput
                            style={styles.fieldInput}
                            placeholder="Ex: 25/04/2026"
                            placeholderTextColor="#CBD5E1"
                            keyboardType="numeric"
                            value={fields.dueDate}
                            onChangeText={(v) => {
                                // auto-format while typing
                                let raw = v.replace(/\D/g, '').slice(0, 8);
                                if (raw.length > 4) raw = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4);
                                else if (raw.length > 2) raw = raw.slice(0, 2) + '/' + raw.slice(2);
                                setFields({ ...fields, dueDate: raw });
                            }}
                        />

                        {/* Category */}
                        <Text style={styles.fieldLabel}>Categoria</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoryRow}
                        >
                            {CATEGORY_OPTIONS.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.catChip,
                                        fields.categoryId === cat.id && {
                                            backgroundColor: cat.color,
                                            borderColor: cat.color,
                                        },
                                    ]}
                                    onPress={() => setFields({ ...fields, categoryId: cat.id })}
                                >
                                    <Ionicons
                                        name={cat.icon}
                                        size={14}
                                        color={fields.categoryId === cat.id ? '#FFF' : cat.color}
                                    />
                                    <Text
                                        style={[
                                            styles.catChipText,
                                            fields.categoryId === cat.id && { color: '#FFF' },
                                        ]}
                                    >
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Notes */}
                        <Text style={styles.fieldLabel}>Observação (opcional)</Text>
                        <TextInput
                            style={[styles.fieldInput, { height: 70, textAlignVertical: 'top' }]}
                            placeholder="Ex: Boleto no email"
                            placeholderTextColor="#CBD5E1"
                            multiline
                            value={fields.notes}
                            onChangeText={(v) => setFields({ ...fields, notes: v })}
                        />

                        {/* Save */}
                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.saveBtnText}>
                                    {editingId ? 'Salvar alterações' : 'Adicionar conta'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// ── Styles ────────────────────────────────────────────────────────────────────

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
        paddingVertical: 14,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontFamily: theme.fonts.title,
        fontSize: 22,
        color: '#0F172A',
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    summaryCard: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    filterRow: {
        paddingHorizontal: 16,
        gap: 8,
        paddingBottom: 12,
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
    },
    filterTabActive: {
        backgroundColor: '#0F172A',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        gap: 10,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 18,
        padding: 14,
        gap: 12,
    },
    cardIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
        gap: 4,
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    cardAmount: {
        fontSize: 15,
        fontWeight: '700',
        color: '#EE5253',
    },
    cardAmountPaid: {
        color: '#10AC84',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cardDate: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    cardNotes: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 2,
    },
    checkBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkBtnActive: {
        backgroundColor: '#10AC84',
    },
    deleteBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#FEF2F2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: 15,
        color: '#9CA3AF',
    },
    emptyAddBtn: {
        backgroundColor: '#0F172A',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 14,
        marginTop: 4,
    },
    emptyAddText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    // modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 40,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 18,
    },
    modalTitle: {
        fontFamily: theme.fonts.title,
        fontSize: 20,
        color: '#0F172A',
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    fieldInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0F172A',
        marginBottom: 16,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginBottom: 16,
    },
    currencyPrefix: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
        marginRight: 6,
    },
    categoryRow: {
        gap: 8,
        marginBottom: 16,
        paddingVertical: 2,
    },
    catChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    catChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
    saveBtn: {
        backgroundColor: '#0F172A',
        borderRadius: 16,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 6,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default PaymentsScreen;

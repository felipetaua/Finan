import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';
import { auth, db } from '../../services/firebaseConfig';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

// mock
const TRANSACTIONS = [
    { id: '1', title: 'Airbnb', subtitle: 'Travel', amount: '-$100.00', icon: 'home', color: '#000', bgColor: '#F3F4F6' },
    { id: '2', title: 'Anton E.', subtitle: 'Transfer', amount: '-$68.00', icon: 'credit-card', color: '#000', bgColor: '#F3F4F6' },
    { id: '3', title: 'PS Store', subtitle: 'Electronics', amount: '-$143.00', icon: 'controller-classic', color: '#000', bgColor: '#F3F4F6' },
];

const DATA = [
    { key: 'Shop', value: 32, color: '#10B981', label: 'Shop 32%' },
    { key: 'Transfer', value: 14, color: '#3B82F6', label: 'Transfer 14%' },
    { key: 'Travel', value: 28, color: '#F59E0B', label: 'Travel 28%' },
    { key: 'Other', value: 26, color: '#1F2937', label: 'Other 26%' },
];

const DonutChart = ({ size = 230, strokeWidth = 20, data, totalAmount }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {data.length > 0 ? data.map((item, index) => {
                const strokeDashoffset = circumference - (item.value / 100) * circumference;
                const rotation = (currentOffset / 100) * 360;
                currentOffset += item.value;

            return (
                <Circle
                    key={index}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                    fill="transparent"
                />
                );
            }) : (
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
            )}
            </G>
        </Svg>
        <View style={styles.chartCenter}>
            <Text style={styles.chartLabel}>Total gastos</Text>
            <Text style={styles.chartValue}>{formatCurrency(totalAmount)}</Text>
        </View>
    </View>
    );
};

const AnalyticsScreen = () => {
    const user = auth.currentUser;
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [transactions, setTransactions] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [totalExpenses, setTotalExpenses] = useState(0);

    const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    useEffect(() => {
        if (!user) return;

        // Definir início e fim do mês selecionado
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const q = query(
            collection(db, "transactions"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let allTrans = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Ordenação local (descendente)
            allTrans.sort((a, b) => {
                const dateA = a.date?.seconds || 0;
                const dateB = b.date?.seconds || 0;
                return dateB - dateA;
            });

            // Filtrar localmente por data 
            const filteredTrans = allTrans.filter(t => {
                if (!t.date) return false;
                const d = new Date(t.date.seconds * 1000);
                return d >= startOfMonth && d <= endOfMonth;
            });

            setTransactions(filteredTrans);

            // Calcular dados do gráfico (apenas despesas)
            const expenses = filteredTrans.filter(t => t.type === 'expense');
            const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);
            setTotalExpenses(total);

            const categoryMap = {};
            expenses.forEach(t => {
                if (!categoryMap[t.category]) {
                    categoryMap[t.category] = {
                        key: t.category,
                        amount: 0,
                        color: t.categoryColor || '#DDD'
                    };
                }
                categoryMap[t.category].amount += t.amount;
            });

            const data = Object.values(categoryMap).map(cat => ({
                key: cat.key,
                value: total > 0 ? (cat.amount / total) * 100 : 0,
                color: cat.color,
                label: `${cat.key} ${total > 0 ? Math.round((cat.amount / total) * 100) : 0}%`
            }));

            setChartData(data);
        });

        return () => unsubscribe();
    }, [user, currentDate]);

    const changeDate = (num) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + num);
        setCurrentDate(newDate);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionItem}>
        <View style={[styles.transactionIconContainer, { backgroundColor: (item.categoryColor || '#000') + '15' }]}>
            <MaterialCommunityIcons name={item.categoryIcon || 'cash'} size={24} color={item.categoryColor || '#000'} />
        </View>
        <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.description}</Text>
            <Text style={styles.transactionSubtitle}>{item.category}</Text>
        </View>
        <Text style={[styles.transactionAmount, { color: item.type === 'expense' ? '#FF5252' : '#4CAF50' }]}>
            {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Analytics</Text>
            </View>
            <TouchableOpacity 
                style={styles.headerSettings} 
                onPress={() => console.log('Configurações de gráfico')}
            >
                <Ionicons name="options-outline" size={22} color="#000" />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.dateSelector}>
                <TouchableOpacity onPress={() => changeDate(-1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-back" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                
                <View style={styles.dateInfo}>
                    <Text style={styles.monthDisplay}>{months[currentDate.getMonth()]}</Text>
                    <Text style={styles.yearDisplay}>{currentDate.getFullYear()}</Text>
                </View>

                <TouchableOpacity onPress={() => changeDate(1)} style={styles.arrowButton}>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>
            </View>

            <View style={styles.chartContainer}>
                <DonutChart data={chartData} totalAmount={totalExpenses} />
            </View>

                <View style={styles.legendContainer}>
                {chartData.map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                    </View>
                ))}
                </View>

                <View style={styles.transactionsHeader}>
                    <Text style={styles.sectionTitle}>Transações</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionsList}>
                {transactions.length > 0 ? (
                    transactions.map(item => (
                        <View key={item.id}>
                        {renderTransaction({ item })}
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>Nenhuma transação neste mês.</Text>
                )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  title: {
    fontFamily: theme.fonts.title,
    fontSize: 24,
    color: '#000',
  },
  headerSettings: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 20,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfo: {
    alignItems: 'center',
    minWidth: 120,
  },
  monthDisplay: {
    fontFamily: theme.fonts.title,
    fontSize: 18,
    color: '#000',
  },
  yearDisplay: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: -2,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
  },
  chartCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  chartLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: '#374151',
    fontWeight: '500',
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 22,
    color: '#000',
  },
  seeAll: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 20,
    fontSize: 14,
  },
  transactionsList: {
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default AnalyticsScreen;

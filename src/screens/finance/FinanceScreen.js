import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Platform, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import FloatingActionButton from '../../components/finance/FloatingActionButton';
import { Ionicons, MaterialCommunityIcons, FontAwesome6 } from '@expo/vector-icons';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc, onSnapshot, collection, query, where, orderBy, limit } from 'firebase/firestore';

const AnimatedSparklesButton = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity style={styles.gradientButtonContainer} activeOpacity={0.8}>
      <Animated.View style={[styles.gradientBackground, { transform: [{ rotate }] }]}>
        <Svg height="120" width="120" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#3b82f6" stopOpacity="1" />
              <Stop offset="0.4" stopColor="#60a5fa" stopOpacity="1" />
              <Stop offset="0.6" stopColor="#93c5fd" stopOpacity="1" />
              <Stop offset="1" stopColor="#3b82f6" stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#grad)" />
        </Svg>
      </Animated.View>
      <View style={styles.innerButton}>
        <Ionicons name="sparkles" size={20} color="#3b82f6" />
      </View>
    </TouchableOpacity>
  );
};

// Mock
const TRANSACTIONS = [
  { id: '1', title: 'Starbucks Coffe', subtitle: '29 Novembro 20:30', amount: '-R$44,80', icon: 'coffee', type: 'expense' },
  { id: '2', title: 'Compra Amazon', subtitle: '30 Outubro 11:21', amount: '-R$74,23', icon: 'shopping', type: 'expense' },
  { id: '3', title: 'Compra Mcdonalds', subtitle: '22 Outubro 20:13', amount: '-R$23,90', bonus: '+R$1,50', icon: 'food', type: 'expense' },
  { id: '4', title: 'Assinatura Netflix', subtitle: '20 Agosto 19:36', amount: '-R$44,80', bonus: '+R$0,00', icon: 'netflix', type: 'expense' },
  { id: '5', title: 'Compras Nike', subtitle: '12 Agosto 16:21', amount: '-R$449,80', bonus: '+R$2,50', icon: 'shoe-sneaker', type: 'expense' },
];

const CARDS = [
  { id: '1', title: 'Finan', lastDigits: '2345', brand: 'VISA', color: '#3498db' },
  { id: '2', title: 'Finan', lastDigits: '2345', brand: 'VISA', color: '#000000' },
];

const FinanceScreen = () => {
  const user = auth.currentUser;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showBalance, setShowBalance] = useState(true);
  const [userPlan, setUserPlan] = useState('Grátis');
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubProfile = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.plan) setUserPlan(data.plan);
        if (data.xp !== undefined) setUserXP(data.xp);
        if (data.level !== undefined) setUserLevel(data.level);
      }
    });

    // Busca de transações em tempo real
    const q = query(
      collection(db, "transactions"),
      where("userId", "==", user.uid)
    );

    const unsubTransactions = onSnapshot(q, (snapshot) => {
      let transList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ordenação local (descendente por data)
      transList.sort((a, b) => {
        const dateA = a.date?.seconds || 0;
        const dateB = b.date?.seconds || 0;
        return dateB - dateA;
      });

      setTransactions(transList.slice(0, 10));

      // Cálculo simplificado do saldo
      let total = 0;
      transList.forEach(t => {
        if (t.type === 'income') total += t.amount;
        else total -= t.amount;
      });
      setTotalBalance(total);
    }, (error) => {
      console.error("Erro nas transações:", error);
    });

    return () => {
      unsubProfile();
      unsubTransactions();
    };
  }, [user]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View style={[styles.transactionIconContainer, { borderColor: item.categoryColor || '#EEE' }]}>
        <MaterialCommunityIcons 
          name={item.categoryIcon || 'cash'} 
          size={24} 
          color={item.categoryColor || theme.colors.textPrimary} 
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.description}</Text>
        <Text style={styles.transactionSubtitle}>
          {item.date ? new Date(item.date.seconds * 1000).toLocaleDateString('pt-BR') : 'Recent'}
        </Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text style={[styles.transactionAmount, { color: item.type === 'expense' ? '#FF5252' : '#4CAF50' }]}>
          {item.type === 'expense' ? '-' : '+'}{formatCurrency(item.amount)}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.nameLevelRow}>
              <Text style={styles.greetingHeader}>Bom dia, {user?.displayName || 'Usuário Finan'}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Lvl {userLevel}</Text>
              </View>
            </View>
            <View style={styles.planAndXP}>
              <View style={styles.planContainer}>
                <Text style={styles.planLabel}>Plano </Text>
                <Text style={[styles.planType, { color: userPlan === 'Premium' ? '#0ea5e9' : '#777' }]}>
                  {userPlan}
                </Text>
              </View>
              <View style={styles.xpDivider} />
              <View style={styles.xpContainer}>
                <Text style={styles.xpText}>{userXP} XP</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerIcons}>
            {userPlan === 'Premium' && <AnimatedSparklesButton />}
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Seu saldo</Text>
          <View style={styles.balanceValueRow}>
            <Text style={styles.balanceValue}>
              {showBalance ? formatCurrency(totalBalance) : 'R$ ••••••••'}
            </Text>
            <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
              <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.actionButtonItem} onPress={() => navigation.navigate('AnalyticsScreen')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="pie-chart" size={22} color="#0ea5e9" />
              </View>
              <Text style={styles.actionButtonLabel}>Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButtonItem} onPress={() => {}}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="bank-plus" size={22} color="#22c55e" />
              </View>
              <Text style={styles.actionButtonLabel}>Open Finance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButtonItem} onPress={() => navigation.navigate('Transactions')}>
              <View style={[styles.actionIconContainer, { backgroundColor: '#FAF5FF' }]}>
                <Ionicons name="receipt" size={22} color="#a855f7" />
              </View>
              <Text style={styles.actionButtonLabel}>Transações</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Seus Cartões</Text>
          <TouchableOpacity style={styles.addCardButton}>
            <Text style={styles.addCardText}>+ Novo cartão</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
          {CARDS.map((card) => (
            <View key={card.id} style={[styles.creditCard, { backgroundColor: card.color }]}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardBrandTitle}>{card.title}</Text>
                <Text style={styles.cardBrand}>{card.brand}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.cardLabel}>Cartão de Crédito</Text>
                  <Text style={styles.cardNumber}>**** {card.lastDigits}</Text>
                </View>
                <TouchableOpacity style={styles.cardDetailsBtn}>
                  <Text style={styles.cardDetailsText}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Transactions Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transações</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <Text style={styles.verTodos}>Ver todos</Text>
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
            <Text style={styles.emptyText}>Nenhuma transação encontrada.</Text>
          )}
        </View>
      </ScrollView>
      
      <FloatingActionButton />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingHeader: {
    fontFamily: theme.fonts.title,
    fontSize: 22,
    color: '#000',
  },
  planContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  levelText: {
    fontSize: 10,
    color: '#b45309',
    fontWeight: 'bold',
  },
  planAndXP: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  xpDivider: {
    width: 1,
    height: 10,
    backgroundColor: '#DDD',
    marginHorizontal: 8,
  },
  xpContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  xpText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  planLabel: {
    fontSize: 14,
    color: '#777',
  },
  planType: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '600',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  gradientButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
  },
  gradientWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    position: 'absolute',
    width: 90, 
    height: 90,
  },
  innerButton: {
    width: 40, 
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
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
  balanceLabel: {
    fontSize: 14,
    color: '#AAA',
    marginBottom: 8,
  },
  balanceValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  actionButtonItem: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionButtonLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 22,
    color: '#000',
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addCardText: {
    fontSize: 14,
    color: '#AAA',
  },
  cardsScroll: {
    marginBottom: 24,
    marginHorizontal: -20,
    paddingLeft: 20,
  },
  creditCard: {
    width: 260,
    height: 160,
    borderRadius: 24,
    padding: 20,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardBrandTitle: {
    fontFamily: theme.fonts.title,
    fontSize: 22,
    color: '#FFF',
  },
  cardBrand: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDetailsBtn: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  cardDetailsText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },
  verTodos: {
    fontSize: 14,
    color: '#AAA',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 20,
    fontSize: 14,
  },
  transactionsList: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F9FA',
  },
  transactionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#AAA',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  bonusBadge: {
    backgroundColor: '#60a5fa',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  bonusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default FinanceScreen;

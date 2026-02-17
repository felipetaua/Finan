import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, G } from 'react-native-svg';

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

const DonutChart = ({ size = 230, strokeWidth = 20, data }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size}>
            <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {data.map((item, index) => {
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
            })}
            </G>
        </Svg>
        <View style={styles.chartCenter}>
            <Text style={styles.chartLabel}>Total amount</Text>
            <Text style={styles.chartValue}>$13,320.75</Text>
        </View>
    </View>
    );
};

const AnalyticsScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionItem}>
        <View style={[styles.transactionIconContainer, { backgroundColor: item.bgColor }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
        </View>
        <View style={styles.transactionInfo}>
            <Text style={styles.transactionTitle}>{item.title}</Text>
            <Text style={styles.transactionSubtitle}>{item.subtitle}</Text>
        </View>
        <Text style={styles.transactionAmount}>{item.amount}</Text>
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
            <TouchableOpacity style={styles.dropdown}>
            <Text style={styles.dropdownText}>Month</Text>
            <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.chartContainer}>
                <DonutChart data={DATA} />
            </View>

                <View style={styles.legendContainer}>
                {DATA.filter(i => i.key !== 'Other').map((item, index) => (
                    <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.label}</Text>
                    </View>
                ))}
                </View>

                <View style={styles.transactionsHeader}>
                    <Text style={styles.sectionTitle}>Transactions</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionsList}>
                {TRANSACTIONS.map(item => (
                    <View key={item.id}>
                    {renderTransaction({ item })}
                    </View>
                ))}
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
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    marginRight: 4,
  },
  scrollContent: {
    paddingBottom: 40,
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
    justifyContent: 'center',
    gap: 15,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
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

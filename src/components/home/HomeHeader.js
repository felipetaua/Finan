import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import LottieView from 'lottie-react-native';
import StreakModal from './StreakModal';
import ShopModal from './ShopModal';
import EnergyModal from './EnergyModal';

const HomeHeader = ({ streak = 0, coins = 0, hearts = 0, isPremium = false, nextEnergyTime }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStreakModalVisible, setIsStreakModalVisible] = useState(false);    
    const [isShopModalVisible, setIsShopModalVisible] = useState(false);        
    const [isEnergyModalVisible, setIsEnergyModalVisible] = useState(false);


    const courses = [
        { name: "Organizar a vida financeira", locked: false },
        { name: "Aprender a Investir", locked: true },
        { name: "Controle Financeiro", locked: true },
        { name: "Planejar aposentadoria", locked: true }
    ];

    return (
        <View style={styles.outerContainer}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.courseSwitcher}
                    onPress={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <View style={styles.courseIconContainer}>
                        <MaterialCommunityIcons name="wallet" size={24} color={theme.colors.primary} />
                    </View>
                </TouchableOpacity>
                
                <View style={styles.statsContainer}>
                    <TouchableOpacity 
                        style={styles.statItem} 
                        onPress={() => setIsStreakModalVisible(true)}
                    >
                        {streak > 0 ? (
                            <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
                                <LottieView
                                    autoPlay
                                    loop={true}
                                    style={{ width: 64, height: 64, transform: [{ scale: 0.7 }] }}
                                    source={require('../../assets/lottie/streak.json')}
                                />
                            </View>
                        ) : (
                            <MaterialCommunityIcons name="fire" size={24} color="#E5E5E5" />
                        )}
                        <Text style={[styles.statText, { color: streak > 0 ? "#FF9600" : "#AFAFAF" }]}>{streak}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.statItem}
                        onPress={() => setIsShopModalVisible(true)}
                    >
                        <View style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
                            <LottieView
                                autoPlay
                                loop={true}
                                style={{ width: 64, height: 64 , transform: [{ scale: 0.7 }]}}
                                source={require('../../assets/lottie/Diamond-azul.json')}
                            />
                        </View>
                        
                        <Text style={[styles.statText, { color: '#1CB0F6' }]}>{coins}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.statItem} onPress={() => setIsEnergyModalVisible(true)}>
                        <MaterialCommunityIcons name="heart" size={24} color="#FF4B4B" />
                        <Text style={[styles.statText, { color: '#FF4B4B' }]}>{hearts}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isMenuOpen && (
                <View style={styles.courseListContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {courses.map((course, index) => (
                            <View key={index} style={[styles.courseCard, !course.locked && styles.activeCourseCard]}>
                                {course.locked ? (
                                    <>
                                        <View style={styles.lockOverlay}>
                                            <MaterialCommunityIcons name="lock" size={20} color="#6B7280" />
                                        </View>
                                        <Text style={styles.courseName}>{course.name}</Text>
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>EM BREVE</Text>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.activeIconContainer}>
                                            <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.primary} />
                                        </View>
                                        <Text style={[styles.courseName, { color: theme.colors.primary }]}>{course.name}</Text>
                                        <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                            <Text style={[styles.badgeText, { color: 'white' }]}>ATUAL</Text>
                                        </View>
                                    </>
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <StreakModal 
                visible={isStreakModalVisible} 
                onClose={() => setIsStreakModalVisible(false)} 
            />

            <ShopModal
                visible={isShopModalVisible}
                onClose={() => setIsShopModalVisible(false)}
                coins={coins}
            />
            <EnergyModal 
                visible={isEnergyModalVisible}
                onClose={() => setIsEnergyModalVisible(false)}
                hearts={hearts}
                maxHearts={6}
                isPremium={isPremium}
                nextEnergyTime={nextEnergyTime}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        backgroundColor: theme.colors.surface,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        borderBottomWidth: 2,
        borderBottomColor: '#E5E5E5',
    },
    courseSwitcher: {
        padding: theme.spacing.xs / 2,
    },
    courseIconContainer: {
        width: 40,
        height: 40,
        borderRadius: theme.radius.sm + 2,
        backgroundColor: '#bcddfcee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md - 1,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
    statText: {
        fontSize: theme.fontSizes.md,
        fontWeight: theme.fontWeights.bold,
    },
    courseListContainer: {
        paddingVertical: theme.spacing.md - 1,
        backgroundColor: theme.colors.background,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.md - 4,
    },
    courseCard: {
        width: 140,
        padding: theme.spacing.md - 4,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.md,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        opacity: 0.7,
    },
    activeCourseCard: {
        opacity: 1,
        borderColor: theme.colors.primary,
        backgroundColor: '#E6F0FF',
    },
    lockOverlay: {
        marginBottom: theme.spacing.sm,
    },
    activeIconContainer: {
        marginBottom: theme.spacing.sm,
    },
    courseName: {
        fontSize: theme.fontSizes.xs,
        fontWeight: theme.fontWeights.bold,
        textAlign: 'center',
        color: theme.colors.textPrimary,
        fontFamily: theme.fonts.bold,
        marginBottom: theme.spacing.sm,
        height: 32,
    },
    badge: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.radius.xs || 4,
    },
    badgeText: {
        fontSize: theme.fontSizes.xs - 3,
        fontWeight: theme.fontWeights.bold,
        color: theme.colors.textSecondary,
    },
});

export default HomeHeader;

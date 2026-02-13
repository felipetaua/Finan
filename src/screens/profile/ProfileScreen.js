import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Header Section with Character */}
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.settingsButton} 
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={28} color={theme.colors.textPrimary} />
                    </TouchableOpacity>
                    
                    <View style={styles.characterContainer}>
                        <Image 
                            source={require('../../assets/images/fin.png')}
                            style={styles.characterImage}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Profile Information */}
                <View style={styles.content}>
                    <View style={styles.profileInfo}>
                        <Text style={styles.name}>username</Text>
                        <Text style={styles.handle}>@username ✦ Criado em Dezembro de 2020</Text>
                    </View>

                    {/* Stats Summary */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>+3</Text>
                            <Text style={styles.statLabel}>Cursos</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>11</Text>
                            <Text style={styles.statLabel}>Seguidores</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>9</Text>
                            <Text style={styles.statLabel}>Seguindo</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.conviteButton}>
                            <Ionicons name="person-add" size={20} color={theme.colors.primary} />
                            <Text style={styles.conviteText}>Convite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareButton}>
                            <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Overview Section */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Overview</Text>
                    </View>

                    <View style={styles.overviewGrid}>
                        <View style={styles.overviewCard}>
                            <View style={styles.cardTopRow}>
                                <MaterialCommunityIcons name="fire" size={24} color="#F97316" />
                                <Text style={styles.cardValue}>12</Text>
                            </View>
                            <Text style={styles.cardLabel}>Day streak</Text>
                        </View>

                        <View style={styles.overviewCard}>
                            <View style={styles.cardTopRow}>
                                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FACC15" />
                                <Text style={styles.cardValue}>9770</Text>
                            </View>
                            <Text style={styles.cardLabel}>Total XP</Text>
                        </View>

                        <View style={styles.overviewCard}>
                            <View style={styles.cardTopRow}>
                                <MaterialCommunityIcons name="trophy" size={24} color="#F59E0B" />
                                <Text style={styles.cardValue}>Gold</Text>
                            </View>
                            <Text style={styles.cardLabel}>League</Text>
                        </View>

                        <View style={styles.overviewCard}>
                            <View style={styles.cardTopRow}>
                                <MaterialCommunityIcons name="folder-outline" size={24} color="#3B82F6" />
                                <Text style={styles.cardValue}>14</Text>
                            </View>
                            <Text style={styles.cardLabel}>Cursos completos</Text>
                        </View>
                    </View>

                    {/* Friend Streaks  */}
                    <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                        <Text style={styles.sectionTitle}>Friend Streaks</Text>
                    </View>
                    
                    {/* Placeholder */}
                    <View style={{ height: 100 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    header: {
        height: 220,
        backgroundColor: '#63E6BE',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 0,
    },
    settingsButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    characterContainer: {
        width: 180,
        height: 180,
        marginBottom: -10,
    },
    characterImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    profileInfo: {
        marginBottom: 20,
    },
    name: {
        fontFamily: theme.fonts.title,
        fontSize: 28,
        color: '#333333',
        marginBottom: 4,
    },
    handle: {
        fontSize: 14,
        color: '#666666',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E7EB',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    statLabel: {
        fontSize: 14,
        color: '#999999',
        marginTop: 2,
    },
    actionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 35,
    },
    conviteButton: {
        flex: 1,
        flexDirection: 'row',
        height: 52,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    conviteText: {
        color: theme.colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    shareButton: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeader: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontFamily: theme.fonts.title,
        fontSize: 24,
        color: '#333333',
    },
    overviewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    overviewCard: {
        width: (width - 55) / 2,
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        marginBottom: 15,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginLeft: 8,
    },
    cardLabel: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
        marginLeft: 32, // align with values
    },
});

export default ProfileScreen;

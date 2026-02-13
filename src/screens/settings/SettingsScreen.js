import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth';

const SettingsScreen = ({ navigation }) => {
    const handleLogout = () => {
        Alert.alert(
            "Sair do App",
            "Deseja mesmo sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Sair", 
                    style: "destructive", 
                    onPress: () => signOut(auth).catch(error => console.log('Erro ao sair:', error)) 
                }
            ]
        );
    };

    const SettingItem = ({ icon, label, onPress, value, type = 'chevron', color = theme.colors.textPrimary }) => (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={[styles.label, { color }]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {value && <Text style={styles.value}>{value}</Text>}
                {type === 'chevron' && <Ionicons name="chevron-forward" size={20} color="#999" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={28} color={theme.colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configurações</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Geral</Text>
                    <SettingItem 
                        icon="color-palette-outline" 
                        label="Tema" 
                        value="Claro"
                        onPress={() => {}} 
                        color={theme.colors.primary}
                    />
                    <SettingItem 
                        icon="language-outline" 
                        label="Idioma" 
                        value="Português"
                        onPress={() => {}} 
                        color="#8B5CF6"
                    />
                    <SettingItem 
                        icon="notifications-outline" 
                        label="Notificações" 
                        onPress={() => {}} 
                        color="#F59E0B"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Segurança</Text>
                    <SettingItem 
                        icon="lock-closed-outline" 
                        label="Privacidade" 
                        onPress={() => {}} 
                        color="#10B981"
                    />
                    <SettingItem 
                        icon="shield-checkmark-outline" 
                        label="Segurança da conta" 
                        onPress={() => {}} 
                        color="#3B82F6"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aplicativo</Text>
                    <SettingItem 
                        icon="help-circle-outline" 
                        label="Ajuda e Suporte" 
                        onPress={() => {}} 
                        color="#6366F1"
                    />
                    <SettingItem 
                        icon="information-circle-outline" 
                        label="Sobre" 
                        onPress={() => {}} 
                        color="#6B7280"
                    />
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.version}>Finan App v1.0.0</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    container: {
        flex: 1,
    },
    section: {
        marginTop: 25,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F9FAFB',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 14,
        color: '#999',
        marginRight: 10,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingVertical: 15,
        marginHorizontal: 20,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
    },
    logoutText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    version: {
        color: '#CCC',
        fontSize: 12,
    }
});

export default SettingsScreen;

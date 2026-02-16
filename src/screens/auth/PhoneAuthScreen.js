import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView, Modal, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db, app } from '../../services/firebaseConfig';
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useOnboarding } from '../../context/OnboardingContext';

export default function PhoneAuthScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { onboardingData } = useOnboarding();
    const recaptchaVerifier = useRef(null);
    
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [countryCode, setCountryCode] = useState('+55');
    const [isCountryModalVisible, setIsCountryModalVisible] = useState(false);

    const formatPhoneNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        
        const truncated = cleaned.slice(0, 11);
        
        if (truncated.length > 10) {
            return `(${truncated.slice(0, 2)}) ${truncated.slice(2, 7)}-${truncated.slice(7)}`;
        } else if (truncated.length > 2) {
            return `(${truncated.slice(0, 2)}) ${truncated.slice(2)}`;
        } else if (truncated.length > 0) {
            return `(${truncated}`;
        }
        return truncated;
    };

    const handlePhoneChange = (text) => {
        const formatted = formatPhoneNumber(text);
        setPhoneNumber(formatted);
    };

    const countries = [
        { name: 'Brasil', code: '+55', flag: '🇧🇷' },
        { name: 'Portugal', code: '+351', flag: '🇵🇹' },
        { name: 'EUA', code: '+1', flag: '🇺🇸' },
        { name: 'Angola', code: '+244', flag: '🇦🇴' },
        { name: 'Moçambique', code: '+258', flag: '🇲🇿' },
    ];

    const handleFirebaseSocialLogin = async (credential) => {
        try {
            const result = await signInWithCredential(auth, credential);
            if (result.user) {
                const userRef = doc(db, "users", result.user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        name: result.user.displayName || "Usuário",
                        email: result.user.email || "",
                        onboarding: onboardingData,
                        createdAt: serverTimestamp(),
                        provider: 'phone'
                    });
                }
            }
        } catch (error) {
            console.error("Erro no login com telefone:", error);
            Alert.alert("Erro", "Ocorreu um problema ao vincular sua conta.");
        }
    };

    const handleSendVerificationCode = async () => {
        if (!phoneNumber) {
            Alert.alert("Erro", "Por favor, insira um número de telefone.");
            return;
        }

        if (Platform.OS === 'web') {
            Alert.alert("Aviso", "A autenticação por telefone no Web requer configuração adicional. Use o app mobile para testar este fluxo.");
            return;
        }

        setLoading(true);
        try {
            const phoneProvider = new PhoneAuthProvider(auth);
            const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;
            const id = await phoneProvider.verifyPhoneNumber(
                fullPhoneNumber,
                recaptchaVerifier.current
            );
            setVerificationId(id);
            Alert.alert("Sucesso", "Código de verificação enviado!");
        } catch (err) {
            Alert.alert("Erro", `Não foi possível enviar o código: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmVerificationCode = async () => {
        if (!verificationCode) {
            Alert.alert("Erro", "Por favor, insira o código recebido.");
            return;
        }

        setLoading(true);
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                verificationCode
            );
            await handleFirebaseSocialLogin(credential);
        } catch (err) {
            Alert.alert("Erro", "Código de verificação inválido.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { paddingTop: insets.top }]}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}
                >
                    <FontAwesome name="chevron-left" size={20} color={theme.colors.textPrimary} />
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>
                        {!verificationId ? 'Seu Telefone' : 'Confirmar Código'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {!verificationId 
                            ? 'Insira seu número com DDD para receber o código de acesso.' 
                            : `Enviamos um SMS para ${phoneNumber}`}
                    </Text>
                </View>

                <View style={styles.form}>
                    {!verificationId ? (
                        <>
                            <View style={styles.phoneInputRow}>
                                <TouchableOpacity 
                                    style={styles.countryPicker}
                                    onPress={() => setIsCountryModalVisible(true)}
                                >
                                    <Text style={styles.countryFlag}>
                                        {countries.find(c => c.code === countryCode)?.flag}
                                    </Text>
                                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                                    <FontAwesome name="chevron-down" size={12} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                                <View style={styles.phoneInputContainer}>
                                    <Input
                                        placeholder="(11) 99999-9999"
                                        value={phoneNumber}
                                        onChangeText={handlePhoneChange}
                                        keyboardType="phone-pad"
                                        autoFocus
                                    />
                                </View>
                            </View>
                            <Button 
                                title={loading ? "" : "Enviar Código"} 
                                onPress={handleSendVerificationCode}
                                disabled={loading}
                            >
                                {loading && <ActivityIndicator color="#FFF" />}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Input
                                placeholder="000000"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                                keyboardType="number-pad"
                                autoFocus
                            />
                            <Button 
                                title={loading ? "" : "Confirmar e Entrar"} 
                                onPress={handleConfirmVerificationCode}
                                disabled={loading}
                            >
                                {loading && <ActivityIndicator color="#FFF" />}
                            </Button>
                            
                            <TouchableOpacity 
                                onPress={() => setVerificationId('')}
                                style={styles.resendContainer}
                            >
                                <Text style={styles.resendText}>Alterar número de telefone</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {Platform.OS !== 'web' && (
                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={app.options}
                        attemptInvisibleVerification={true}
                    />
                )}

                <Modal
                    visible={isCountryModalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setIsCountryModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.countryModalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Selecione seu país</Text>
                                <TouchableOpacity onPress={() => setIsCountryModalVisible(false)}>
                                    <FontAwesome name="close" size={24} color={theme.colors.textPrimary} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={countries}
                                keyExtractor={(item) => item.code}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        style={styles.countryItem}
                                        onPress={() => {
                                            setCountryCode(item.code);
                                            setIsCountryModalVisible(false);
                                        }}
                                    >
                                        <Text style={styles.itemFlag}>{item.flag}</Text>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemCode}>{item.code}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 32,
    },
    header: {
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.textSecondary,
        lineHeight: 24,
    },
    form: {
        width: '100%',
    },
    phoneInputRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 8,
    },
    countryPicker: {
        height: 56,
        paddingHorizontal: 12,
        backgroundColor: '#E5E5E5',
        borderRadius: theme.radius.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryFlag: {
        fontSize: 20,
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    phoneInputContainer: {
        flex: 1,
    },
    resendContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    resendText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    countryModalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
    },
    countryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    itemFlag: {
        fontSize: 24,
        marginRight: 16,
    },
    itemName: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.textPrimary,
    },
    itemCode: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
});
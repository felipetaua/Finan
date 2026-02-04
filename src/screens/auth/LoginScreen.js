import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../../services/firebaseConfig';
import { 
    useCreateUserWithEmailAndPassword, 
    useSignInWithEmailAndPassword 
} from "react-firebase-hooks/auth";
import { updateProfile } from "firebase/auth";

export default function LoginScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [
        createUserWithEmailAndPassword,
        userCreate,
        loadingCreate,
        errorCreate,
    ] = useCreateUserWithEmailAndPassword(auth);

    const [
        signInWithEmailAndPassword,
        userSignIn,
        loadingSignIn,
        errorSignIn,
    ] = useSignInWithEmailAndPassword(auth);

    const handleContinue = async () => {
        if (!email || !password) {
            Alert.alert("Erro", "Por favor, preencha email e senha.");
            return;
        }

        try {
            if (name.trim() !== '') {
                // Se o nome estiver preenchido, tentamos criar conta
                const result = await createUserWithEmailAndPassword(email, password);
                if (result && result.user) {
                    await updateProfile(result.user, { displayName: name });
                }
            } else {
                // Se o nome estiver vazio, tentamos fazer login
                await signInWithEmailAndPassword(email, password);
            }
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao processar sua solicitação.");
            console.error(error);
        }
    };

    const isLoading = loadingCreate || loadingSignIn;

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.logo}>Finan</Text>
                    <Text style={styles.title}>Login ou Criar Conta</Text>
                    <Text style={styles.helperText}>
                        {name ? 'Preencha os dados para criar sua conta' : 'Insira seu email e senha para entrar'}
                    </Text>
                </View>

                <View style={styles.form}>
                    <Input
                        placeholder="Nome (opcional para login)"
                        value={name}
                        onChangeText={setName}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Input
                        placeholder="senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {errorCreate || errorSignIn ? (
                        <Text style={styles.errorText}>
                            {errorCreate?.message || errorSignIn?.message}
                        </Text>
                    ) : null}

                    <Button
                        title={isLoading ? "" : (name ? "Criar Conta" : "Entrar")}
                        onPress={handleContinue}
                    >
                        {isLoading && <ActivityIndicator color="#FFF" />}
                    </Button>
                </View>

                <View style={styles.separatorContainer}>
                    <View style={styles.separatorLine} />
                    <Text style={styles.separatorText}>ou</Text>
                    <View style={styles.separatorLine} />
                </View>

                <View style={styles.socialButtons}>
                    <Button
                        title="Continue com Google"
                        type="outline"
                        onPress={() => {}}
                        icon={<FontAwesome name="google" size={20} color="#EA4335" />}
                    />
                    <Button
                        title="Continue com Facebook"
                        type="outline"
                        onPress={() => {}}
                        icon={<FontAwesome name="facebook" size={20} color="#1877F2" />}
                    />
                </View>

                <TouchableOpacity style={styles.helpLink}>
                    <Text style={styles.helpText}>Precisa de Ajuda para criar conta?</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Ao se cadastrar, você está criando uma conta no Finan e concorda com os{' '}
                        <Text style={styles.footerLink}>Termos</Text> e a{' '}
                        <Text style={styles.footerLink}>Política de Privacidade</Text> do Finan.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 24,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 30,
    },
    logo: {
        fontFamily: theme.fonts.title,
        fontSize: 48,
        color: theme.colors.primary,
        marginBottom: 10,
    },
    title: {
        fontSize: theme.fontSizes.xl,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        marginBottom: 8,
    },
    helperText: {
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    errorText: {
        color: theme.colors.error,
        fontSize: theme.fontSizes.sm,
        marginBottom: 10,
        textAlign: 'center',
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        color: theme.colors.textSecondary,
        fontSize: theme.fontSizes.md,
        marginHorizontal: 10,
    },
    socialButtons: {
        width: '100%',
        marginTop: 10,
    },
    helpLink: {
        marginTop: 20,
        marginBottom: 40,
    },
    helpText: {
        color: theme.colors.primary,
        fontSize: theme.fontSizes.md,
        fontWeight: '600',
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#9CA3AF',
        lineHeight: 18,
    },
    footerLink: {
        color: theme.colors.primary,
    },
});
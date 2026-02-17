import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FontAwesome } from '@expo/vector-icons';
import { auth, db, app } from '../../services/firebaseConfig';
import { 
    useCreateUserWithEmailAndPassword, 
    useSignInWithEmailAndPassword 
} from "react-firebase-hooks/auth";
import { 
    updateProfile, 
    GoogleAuthProvider, 
    signInWithCredential,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useOnboarding } from '../../context/OnboardingContext';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const insets = useSafeAreaInsets();
    const { onboardingData } = useOnboarding();
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        redirectUri: process.env.EXPO_PUBLIC_GOOGLE_REDIRECT_URI,
    });

    useEffect(() => {
        if (request) {
            console.log("URI de redirecionamento sendo usada:", request.redirectUri);
        }
    }, [request]);

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token, authentication } = response;
            // No SDK 54, o token pode vir em lugares diferentes dependendo da plataforma
            const token = id_token || authentication?.idToken || response.params?.id_token;
            
            console.log("Login Google sucesso! Autenticando no Firebase...");
            
            if (token) {
                const credential = GoogleAuthProvider.credential(token);
                handleFirebaseSocialLogin(credential, 'google');
            } else {
                console.error("Token não encontrado na resposta do Google:", response);
            }
        } else if (response?.type === 'error') {
            console.error("Erro no AuthSession:", response.error);
        }
    }, [response]);

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
        console.log("handleContinue chamado. isLogin:", isLogin);
        if (!email || !password) {
            console.log("Email ou senha vazios");
            Alert.alert("Erro", "Por favor, preencha email e senha.");
            return;
        }

        if (!isLogin && !name) {
            console.log("Nome vazio no cadastro");
            Alert.alert("Erro", "Por favor, preencha seu nome.");
            return;
        }

        try {
            if (!isLogin) {
                console.log("Tentando criar usuário com email:", email);
                const result = await createUserWithEmailAndPassword(email, password);
                console.log("Resultado createUser:", result ? "Objeto recebido" : "Undefined/Null");
                
                if (result && result.user) {
                    console.log("Usuário criado. Atualizando perfil com nome:", name);
                    await updateProfile(result.user, { displayName: name });
                    
                    console.log("Perfil atualizado. Salvando no Firestore...");
                    const userRef = doc(db, "users", result.user.uid);
                    await setDoc(userRef, {
                        name: name,
                        email: email,
                        onboarding: onboardingData || {},
                        plan: 'Gratuito',
                        xp: 0,
                        level: 1,
                        createdAt: serverTimestamp()
                    });
                    console.log("Firestore OK. O listener onAuthStateChanged deve disparar.");
                } else {
                    console.log("CreateUser não retornou usuário (pode ter falhado silenciosamente ou erro já capturado pelo hook)");
                }
            } else {
                console.log("Tentando fazer login com email:", email);
                const result = await signInWithEmailAndPassword(email, password);
                console.log("Resultado signIn:", result ? "Objeto recebido" : "Undefined/Null");
                if (result) {
                    console.log("Login OK. O listener onAuthStateChanged deve disparar.");
                }
            }
        } catch (error) {
            console.error("Erro no handleContinue:", error);
            Alert.alert("Erro de Autenticação", error.message || "Não foi possível realizar a operação.");
        }
    };

    const handleFirebaseSocialLogin = async (credential, type) => {
        try {
            const result = await signInWithCredential(auth, credential);
            if (result.user) {
                const userRef = doc(db, "users", result.user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        name: result.user.displayName,
                        email: result.user.email,
                        onboarding: onboardingData,
                        plan: 'Gratuito',
                        xp: 0,
                        level: 1,
                        createdAt: serverTimestamp(),
                        provider: type
                    });
                }
            }
        } catch (error) {
            console.error(`Erro no login com ${type}:`, error);
            Alert.alert("Erro", "Ocorreu um problema ao vincular sua conta.");
        }
    };

    const handleSocialLogin = async (type) => {
        console.log("handleSocialLogin chamado com tipo:", type);
        if (type === 'google') {
            try {
                console.log("Iniciando promptAsync do Google...");
                const result = await promptAsync();
                console.log("Resultado promptAsync Google:", result?.type);
            } catch (error) {
                console.error("Erro ao abrir prompt do Google:", error);
                Alert.alert("Erro", "Não foi possível abrir o login do Google.");
            }
        } else if (type === 'phone') {
            navigation.navigate('PhoneAuth');
        }
    };

    const isLoading = loadingCreate || loadingSignIn;

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.logo}>Finan</Text>
                    <Text style={styles.title}>{isLogin ? 'Bem-vindo!' : 'Comece agora'}</Text>
                    <Text style={styles.helperText}>
                        {isLogin ? 'Entre para continuar cuidando das suas finanças' : 'Crie sua conta e tenha o controle total'}
                    </Text>
                </View>

                <View style={styles.toggleWrapper}>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, isLogin && styles.toggleBtnActive]} 
                        onPress={() => setIsLogin(true)}
                    >
                        <Text style={[styles.toggleBtnText, isLogin && styles.toggleBtnTextActive]}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.toggleBtn, !isLogin && styles.toggleBtnActive]} 
                        onPress={() => setIsLogin(false)}
                    >
                        <Text style={[styles.toggleBtnText, !isLogin && styles.toggleBtnTextActive]}>Criar conta</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    {!isLogin && (
                        <Input
                            placeholder="Nome Completo"
                            value={name}
                            onChangeText={setName}
                        />
                    )}
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <Input
                        placeholder="Senha"
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
                        title={isLogin ? "Entrar" : "Cadastrar"}
                        onPress={handleContinue}
                        isLoading={isLoading}
                    />
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
                        onPress={() => handleSocialLogin('google')}
                        icon={<FontAwesome name="google" size={20} color="#EA4335" />}
                    />
                    <Button
                        title="Entrar com Telefone"
                        type="outline"
                        onPress={() => handleSocialLogin('phone')}
                        icon={<FontAwesome name="phone" size={20} color={theme.colors.primary} />}
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
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
        width: '100%',
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleBtnActive: {
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
            web: {
                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            }
        })
    },
    toggleBtnText: {
        fontSize: theme.fontSizes.sm,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    toggleBtnTextActive: {
        color: theme.colors.primary,
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

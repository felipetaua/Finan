import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { theme } from '../../theme/theme';
import LottieView from 'lottie-react-native';
import { db, auth } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

LocaleConfig.locales['pt-br'] = {
    monthNames: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan.', 'Fev.', 'Mar.', 'Abr.', 'Mai.', 'Jun.', 'Jul.', 'Ago.', 'Set.', 'Out.', 'Nov.', 'Dez.'],
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const StreakModal = ({ visible, onClose }) => {
    const [markedDates, setMarkedDates] = useState({});
    const [streakCount, setStreakCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const animRef = React.useRef(null);

    const user = auth.currentUser;

    useEffect(() => {
        if (visible && user) {
            fetchStreakData();
        }
    }, [visible, user]);

    const fetchStreakData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, 'users', user.uid, 'gamification', 'streak');
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                const history = data.history || [];
                
                const formattedDates = {};
                history.forEach(date => {
                    formattedDates[date] = { 
                        selected: true, 
                        selectedColor: '#FF9600',
                        customStyles: {
                            container: {
                                backgroundColor: '#FF9600',
                                borderRadius: 12
                            },
                            text: {
                                color: 'white',
                                fontFamily: theme.fonts.bold
                            }
                        }
                    };
                });
                
                setMarkedDates(formattedDates);
                setStreakCount(data.currentStreak || 0);
            }
        } catch (error) {
            console.warn('Error fetching streak (possibly offline or blocked):', error.message);
        } finally {
            setLoading(false);
        }
    };

    const getTodayString = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const markDay = (dateString) => {
        if (!user) return;
        
        const todayStr = getTodayString();
        // Não marcar dias futuros
        if (dateString > todayStr) return; 

        // Não marcar dias passados de graça: isso requereria "Comprar Tokens", 
        if (dateString < todayStr && !markedDates[dateString]) return;
        
        if (markedDates[dateString]) return;
        
        const newDates = {
            ...markedDates,
            [dateString]: { 
                selected: true, 
                selectedColor: '#FF9600',
                customStyles: {
                    container: {
                        backgroundColor: '#FF9600',
                        borderRadius: 12
                    },
                    text: {
                        color: 'white',
                        fontFamily: theme.fonts.bold
                    }
                }
            }
        };
        setMarkedDates(newDates);
        setStreakCount(prev => prev + 1);

        try {
            const docRef = doc(db, 'users', user.uid, 'gamification', 'streak');
            const newHistory = Object.keys(newDates).sort();
            
            setDoc(docRef, {
                history: newHistory,
                currentStreak: streakCount + 1,
                lastUpdated: new Date().toISOString()
            }, { merge: true }).catch(error => {
                console.warn('Erro ao salvar em background:', error.message);
            });
            
        } catch (error) {
            console.warn('Erro ao iniciar salvamento:', error.message);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <TouchableOpacity 
                        style={styles.closeButton} 
                        onPress={() => {
                            if (onClose) onClose();
                        }}
                    >
                        <MaterialCommunityIcons name="close" size={24} color={theme.colors.textPrimary} />
                    </TouchableOpacity>

                    <Text style={[styles.headerTitle, { pointerEvents: 'none' }]}>Sequência</Text>
                    
                    <View style={styles.streakHeader}>
                        <View>
                            <Text style={styles.streakNumber}>{streakCount} dias de</Text>
                            <Text style={styles.streakNumber}>sequência</Text>
                            <Text style={styles.streakSubtitle}>Rápido, faça uma lição!</Text>
                        </View>
                        {streakCount > 0 ? (
                            <LottieView
                                ref={animRef}
                                autoPlay
                                loop={true}
                                resizeMode="contain"
                                style={{ width: 64, height: 64 , transform: [{ scale: 2 }]}}
                                source={require('../../assets/lottie/streak.json')}
                            />
                        ) : (
                            <MaterialCommunityIcons name="fire" size={64} color="#E5E5E5" />
                        )}
                    </View>

                    {loading ? (
                        <View style={{ height: 300, justifyContent: 'center' }}>
                            <ActivityIndicator size="large" color="#FF9600" />
                        </View>
                    ) : (
                        <View style={styles.calendarContainer}>
                            <Calendar
                                markingType={'custom'}
                                markedDates={markedDates}
                                maxDate={getTodayString()}
                                disableAllTouchEventsForDisabledDays={true}
                                onDayPress={(day) => markDay(day.dateString)}
                                theme={{
                                    backgroundColor: '#ffffff',
                                    calendarBackground: '#ffffff',
                                    textSectionTitleColor: '#b6c1cd',
                                    selectedDayBackgroundColor: '#FF9600',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: '#1CB0F6',
                                    dayTextColor: '#4B4B4B',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#FF9600',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: '#4B4B4B',
                                    monthTextColor: '#4B4B4B',
                                    textDayFontFamily: theme.fonts.regular,
                                    textMonthFontFamily: theme.fonts.bold,
                                    textDayHeaderFontFamily: theme.fonts.bold,
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 14,
                                }}
                            />
                        </View>
                    )}

                    <TouchableOpacity 
                        style={[styles.buyTokenButton, { opacity: 0.5 }]} 
                        activeOpacity={1} 
                        disabled={true}
                    >
                        <Text style={styles.buyTokenText}>Comprar Tokens (Em breve)</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: theme.spacing.lg,
        minHeight: '85%',
    },
    closeButton: {
        alignSelf: 'flex-start',
        marginBottom: theme.spacing.md,
        zIndex: 10,
        padding: 5,
    },
    headerTitle: {
        position: 'absolute',
        top: theme.spacing.lg,
        left: 0,
        right: 0,   
        textAlign: 'center',
        fontSize: theme.fontSizes.xl,
        fontFamily: theme.fonts.title,
        color: theme.colors.textPrimary ,
    },
    streakHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.lg,
    },
    streakNumber: {
        fontSize: 24,
        fontFamily: theme.fonts.bold,
        color: '#111',
    },
    streakSubtitle: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.regular,
        color: '#AFAFAF',
        marginTop: theme.spacing.xs,
    },
    calendarContainer: {
        borderWidth: 1,
        borderColor: '#E5E5E5',
        borderRadius: 16,
        overflow: 'hidden',
        padding: theme.spacing.xs,
        marginTop: theme.spacing.md,
    },
    buyTokenButton: {
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: theme.spacing.lg,
    },
    buyTokenText: {
        color: 'white',
        fontFamily: theme.fonts.bold,
        fontSize: theme.fontSizes.md,
    }
});

export default StreakModal;
import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

export default function LessonModal({ visible, onClose, lessonData }) {
    if (!lessonData) return null;

    const renderLicao = (licao, index) => {
        return (
            <View key={index} style={styles.section}>
                {licao.tipo === 'teoria_curta' && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="book" size={20} color={theme.colors.primary} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Teoria</Text>
                        </View>
                        <Text style={styles.sectionText}>{licao.texto}</Text>
                        {licao.pergunta && (
                            <View style={styles.questionBox}>
                                <Ionicons name="chatbubble-ellipses" size={18} color={theme.colors.info || '#2196F3'} />
                                <Text style={styles.questionText}>{licao.pergunta}</Text>
                            </View>
                        )}
                    </>
                )}

                {(licao.tipo === 'escolha_multipla' || licao.tipo === 'desafio_escolha' || licao.tipo === 'calculo_gamificado') && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="git-network" size={20} color={theme.colors.secondary} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.secondary }]}>Desafio de Escolha</Text>
                        </View>
                        {licao.contexto && <Text style={styles.sectionText}>{licao.contexto}</Text>}
                        {licao.texto && <Text style={styles.sectionText}>{licao.texto}</Text>}
                        {licao.pergunta && <Text style={styles.questionText}>{licao.pergunta}</Text>}
                        
                        <View style={styles.optionsContainer}>
                            {licao.opcoes?.map((opcao, i) => (
                                <TouchableOpacity key={i} style={styles.optionButton}>
                                    <Text style={styles.optionText}>{opcao.texto}</Text>
                                    {opcao.pontos !== undefined && (
                                        <Text style={styles.pointsText}>{opcao.pontos > 0 ? `+${opcao.pontos}` : opcao.pontos} XP</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {licao.tipo === 'pratica_real' && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="rocket" size={20} color={theme.colors.success} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.success }]}>Ação Prática</Text>
                        </View>
                        <Text style={styles.sectionText}>{licao.tarefa}</Text>
                        {licao.recompensa_xp && (
                            <View style={styles.rewardBadge}>
                                <Ionicons name="star" size={14} color="#FFF" />
                                <Text style={styles.rewardText}>+{licao.recompensa_xp} XP</Text>
                            </View>
                        )}
                    </>
                )}

                {licao.tipo === 'reflexao_honesta' && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="eye" size={20} color={theme.colors.warning || '#FF9800'} />
                            <Text style={[styles.sectionTitle, { color: theme.colors.warning || '#FF9800' }]}>Reflexão</Text>
                        </View>
                        <Text style={styles.sectionText}>{licao.texto}</Text>
                        {licao.pergunta && <Text style={styles.questionText}>{licao.pergunta}</Text>}
                        {licao.campo_texto && (
                            <View style={styles.fakeInput}>
                                <Text style={styles.fakeInputText}>Digite sua resposta aqui...</Text>
                            </View>
                        )}
                    </>
                )}

                {licao.tipo === 'compromisso_final' && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="medal" size={20} color="#FFC800" />
                            <Text style={[styles.sectionTitle, { color: '#FFC800' }]}>Compromisso Final</Text>
                        </View>
                        <Text style={styles.sectionText}>{licao.texto}</Text>
                        <TouchableOpacity style={styles.actionButton}>
                            <Text style={styles.actionButtonText}>{licao.acao}</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.subtitle}>Detalhes da Unidade</Text>
                            <Text style={styles.title}>{lessonData.titulo}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                        {lessonData.licoes?.map((licao, index) => renderLicao(licao, index))}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.startButton} onPress={onClose}>
                            <Text style={styles.startButtonText}>Concluir Unidade</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: theme.colors.background,
        borderTopLeftRadius: theme.radius.xl,
        borderTopRightRadius: theme.radius.xl,
        height: '85%',
        paddingTop: theme.spacing.xl,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
            web: {
                boxShadow: '0 -2px 10px rgba(0,0,0,0.2)'
            }
        })
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginTop: 4,
    },
    closeButton: {
        padding: 4,
    },
    scrollArea: {
        padding: theme.spacing.lg,
    },
    section: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    sectionText: {
        fontSize: 15,
        color: theme.colors.textSecondary,
        lineHeight: 22,
        marginBottom: 8,
    },
    questionBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    questionText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: theme.colors.text,
        marginLeft: 8,
        flex: 1,
        lineHeight: 20,
    },
    optionsContainer: {
        marginTop: 10,
        gap: 8,
    },
    optionButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#F9F9F9',
    },
    optionText: {
        fontSize: 14,
        color: theme.colors.text,
        flex: 1,
    },
    pointsText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: theme.colors.primary,
        marginLeft: 8,
    },
    rewardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFC800',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    rewardText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
        marginLeft: 4,
    },
    fakeInput: {
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 8,
        padding: 12,
        marginTop: 10,
        backgroundColor: '#F9F9F9',
    },
    fakeInputText: {
        color: '#AFAFAF',
        fontSize: 14,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    footer: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        backgroundColor: theme.colors.background,
    },
    startButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.full,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
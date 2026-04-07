import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import LottieView from 'lottie-react-native';

const EnergyModal = ({ visible, onClose, hearts, maxHearts = 6, nextEnergyTime, isPremium = false }) => {
    // Array para os corações (mostra preenchido se index < hearts)
    const heartsArray = Array.from({ length: maxHearts }, (_, i) => i);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.centeredView} 
                activeOpacity={1} 
                onPressOut={onClose}
            >
                <TouchableWithoutFeedback>
                    <View style={styles.modalView}>
                        {/* Triangle pointing up */}
                        <View style={styles.triangle} />
                        
                        <Text style={styles.title}>Vida</Text>
                        
                        <View style={styles.heartsContainer}>
                            {isPremium ? (
                                <MaterialCommunityIcons name="infinity" size={32} color="#FF4B4B" />
                            ) : (
                                heartsArray.map((index) => (
                                    <MaterialCommunityIcons 
                                        key={index} 
                                        name="heart" 
                                        size={28} 
                                        color={index < hearts ? "#FF4B4B" : "#AFAFAF"} 
                                        style={{ marginHorizontal: 2 }}
                                    />
                                ))
                            )}
                        </View>

                        {!isPremium && hearts < maxHearts && (
                            <Text style={styles.nextEnergyText}>
                                Próxima energia em {nextEnergyTime || "30:00"}
                            </Text>
                        )}
                        
                        {!isPremium && hearts === maxHearts && (
                            <Text style={styles.nextEnergyText}>
                                Sua energia está cheia!
                            </Text>
                        )}

                        <Text style={styles.subtitle}>
                            {hearts > 0 || isPremium
                                ? "Você ainda tem energia! continue aprendendo"
                                : "Você ficou sem energia! Aguarde ou recarregue."}
                        </Text>

                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.actionButton}>
                                <View style={styles.iconContainer}>
                                    <LottieView
                                        autoPlay
                                        loop={true}
                                        style={{ width: 32, height: 32, transform: [{ scale: 1.5 }] }}
                                        source={require('../../assets/lottie/Diamond-azul.json')}
                                    />
                                </View>
                                <Text style={styles.buttonText}>ENERGIA ILIMITADA</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} disabled={isPremium || hearts >= maxHearts}>
                                <View style={styles.iconContainer}>
                                    <LottieView
                                        autoPlay
                                        loop={true}
                                        style={{ width: 32, height: 32, transform: [{ scale: 1.5 }] }}
                                        source={require('../../assets/lottie/Diamond-azul.json')}
                                    />
                                </View>
                                <Text style={[styles.buttonText, (isPremium || hearts >= maxHearts) && styles.disabledText]}>
                                    RECARGA ENERGIA
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.actionButton} disabled={isPremium || hearts >= maxHearts}>
                                <View style={styles.iconContainer}>
                                    <LottieView
                                        autoPlay
                                        loop={true}
                                        style={{ width: 32, height: 32, transform: [{ scale: 1.5 }] }}
                                        source={require('../../assets/lottie/Diamond-azul.json')}
                                    />
                                </View>
                                <Text style={[styles.buttonText, (isPremium || hearts >= maxHearts) && styles.disabledText]}>
                                    ASSISTIR ANÚNCIO
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)', // Slightly darker background
        alignItems: 'center',
        paddingTop: 72, // Move it down a bit from top header
    },
    modalView: {
        width: '95%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ffffff',
        position: 'absolute',
        top: -10,
        right: 24, // Position it under the heart icon
    },
    title: {
        fontSize: 22,
        fontFamily: theme.fonts.bold,
        color: '#111',
        marginBottom: 15,
    },
    heartsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    nextEnergyText: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.bold,
        color: '#4B5563',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.regular,
        color: '#6B7280',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonsContainer: {
        width: '100%',
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 16,
        ...Platform.select({
            web: { boxShadow: '0px 4px 0px #9CA3AF' },
            default: {
                shadowColor: "#9CA3AF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 1,
                shadowRadius: 0,
                elevation: 2,
            }
        }),
    },
    iconContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    buttonText: {
        fontSize: theme.fontSizes.md,
        fontFamily: theme.fonts.bold,
        color: '#111',
    },
    disabledText: {
        color: '#9CA3AF',
    },
});

export default EnergyModal;
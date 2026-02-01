import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

const SectionBanner = ({ section = 1, unit = 1, description = '' }) => {
    return (
        <View style={styles.banner}>
            <View style={styles.bannerContent}>
                <Text style={styles.sectionTitle}>SEÇÃO {section}, UNIDADE {unit}</Text>
                <Text style={styles.unitDescription}>{description}</Text>
            </View>
            <TouchableOpacity style={styles.notesButton}>
                <MaterialCommunityIcons name="notebook-outline" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: theme.colors.primary,
        margin: 16,
        borderRadius: 12,
        
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: theme.colors.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    },
    bannerContent: {
        flex: 1,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 8,    
        paddingTop: 16,
    },
    sectionTitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    unitDescription: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    notesButton: {
        height: "100%",
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderLeftWidth: 2,
        borderLeftColor: 'rgba(255, 255, 255, 0.3)',
        marginLeft: 12,
    },
});

export default SectionBanner;

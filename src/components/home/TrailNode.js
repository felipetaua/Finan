import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';

const TrailNode = ({ node }) => {
    const isLocked = node.status === 'locked';
    const isCurrent = node.status === 'current';
    
    return (
        <View style={[styles.nodeContainer, { marginLeft: node.position }]}>
            {isCurrent && (
                <View style={styles.startBadge}>
                    <Text style={styles.startText}>INICIAR</Text>
                    <View style={styles.startArrow} />
                </View>
            )}
            <TouchableOpacity 
                style={[
                    styles.node, 
                    { backgroundColor: node.color, shadowColor: node.color ? node.color : '#E5E5E5' },
                    isLocked && styles.lockedNode
                ]}
            >
                {node.type === 'star' ? (
                    <FontAwesome6 name="star" size={24} color="white" />
                ) : (
                    <MaterialCommunityIcons name={node.icon} size={28} color={isLocked ? '#AFAFAF' : 'white'} />
                )}
            </TouchableOpacity>
            {!isLocked && node.status === 'completed' && (
                <View style={styles.starsRow}>
                    <FontAwesome6 name="star" size={10} color="#FFC800" />
                    <FontAwesome6 name="star" size={10} color="#FFC800" />
                    <FontAwesome6 name="star" size={10} color="#FFC800" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    nodeContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    node: {
        width: 70,
        height: 65,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 6,
    },
    lockedNode: {
        backgroundColor: '#E5E5E5',
        shadowColor: '#AFAFAF',
    },
    startBadge: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        marginBottom: 8,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    startText: {
        color: '#1CB0F6',
        fontWeight: 'bold',
        fontSize: 12,
    },
    startArrow: {
        position: 'absolute',
        bottom: -8,
        alignSelf: 'center',
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderLeftColor: 'transparent',
        borderRightWidth: 6,
        borderRightColor: 'transparent',
        borderTopWidth: 8,
        borderTopColor: '#E5E5E5',
    },
    starsRow: {
        flexDirection: 'row',
        gap: 2,
        marginTop: 4,
    }
});

export default TrailNode;

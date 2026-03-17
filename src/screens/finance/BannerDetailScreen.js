import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';

const BannerDetailScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { banner } = route.params;
    const { detail, title, color, image } = banner;

    const renderBlock = (block, index) => {
        if (block.type === 'paragraph') {
            return (
                <Text key={index} style={styles.paragraph}>{block.text}</Text>
            );
        }
        if (block.type === 'section') {
            return (
                <View key={index} style={styles.sectionBlock}>
                    <Text style={styles.sectionTitle}>{block.title}</Text>
                    <Text style={styles.sectionText}>{block.text}</Text>
                </View>
            );
        }
        if (block.type === 'tip') {
            return (
                <View key={index} style={[styles.tipBox, { borderLeftColor: color }]}>
                    <Text style={[styles.tipLabel, { color }]}>{block.label}</Text>
                    <Text style={styles.tipText}>{block.text}</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header hero */}
            <View style={[styles.hero, { backgroundColor: color }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.heroContent}>
                    <Text style={styles.heroTitle}>{title}</Text>
                    {image && (
                        <Image source={image} style={styles.heroImage} resizeMode="contain" />
                    )}
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.heading}>{detail.heading}</Text>
                {detail.body.map((block, i) => renderBlock(block, i))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    hero: {
        paddingBottom: 24,
        paddingHorizontal: 16,
    },
    backButton: {
        marginTop: 8,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    heroTitle: {
        flex: 1,
        fontFamily: theme.fonts.title,
        fontSize: 26,
        color: '#FFF',
        lineHeight: 32,
    },
    heroImage: {
        width: 90,
        height: 90,
        marginLeft: 12,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingBottom: 48,
    },
    heading: {
        fontFamily: theme.fonts.title,
        fontSize: 22,
        color: '#0F172A',
        marginBottom: 20,
        lineHeight: 30,
    },
    paragraph: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
        marginBottom: 16,
    },
    sectionBlock: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    sectionText: {
        fontSize: 15,
        color: '#374151',
        lineHeight: 24,
    },
    tipBox: {
        backgroundColor: '#F8FAFC',
        borderLeftWidth: 4,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    tipLabel: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    tipText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
});

export default BannerDetailScreen;

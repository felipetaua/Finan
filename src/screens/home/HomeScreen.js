import React from 'react';
import { View, StyleSheet, ScrollView, Image, SafeAreaView } from 'react-native';
import { theme } from '../../theme/theme';
import HomeHeader from '../../components/home/HomeHeader';
import SectionBanner from '../../components/home/SectionBanner';
import TrailNode from '../../components/home/TrailNode';

const HomeScreen = () => {
  const trailData = [
    { id: 1, type: 'star', color: '#FFC800', status: 'completed', position: 0 },
    { id: 2, type: 'icon', color: '#1CB0F6', status: 'upcoming', position: 50, icon: 'dumbbell' },
    { id: 3, type: 'icon', color: '#1CB0F6', status: 'current', position: 80, icon: 'headphones' },
    { id: 4, type: 'star', color: '#1CB0F6', status: 'upcoming', position: 50 },
    { id: 5, type: 'icon', color: '#E5E5E5', status: 'locked', position: -40, icon: 'video' },
    { id: 6, type: 'icon', color: '#E5E5E5', status: 'locked', position: -80, icon: 'microphone' },
    { id: 7, type: 'star', color: '#E5E5E5', status: 'locked', position: -40 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <HomeHeader streak={0} coins={132} hearts={1} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionBanner 
            section={2} 
            unit={10} 
            description="Aprenda sobre juros e investimentos" 
        />

        <View style={styles.trailContainer}>
            <Image 
                source={require('../../assets/images/fin.png')} 
                style={styles.character}
                resizeMode="contain"
            />
            {trailData.map(node => <TrailNode key={node.id} node={node} />)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  trailContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  character: {
    width: 120,
    height: 120,
    position: 'absolute',
    left: 10,
    top: 120,
    zIndex: 1,
  },
});

export default HomeScreen;

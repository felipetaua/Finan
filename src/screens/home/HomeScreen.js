import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { theme } from '../../theme/theme';
import HomeHeader from '../../components/home/HomeHeader';
import SectionBanner from '../../components/home/SectionBanner';
import TrailNode from '../../components/home/TrailNode';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../services/firebaseConfig';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const animation = React.useRef(null);
  const [streak, setStreak] = useState(0);
  const [coins, setCoins] = useState(0);
  const [hearts, setHearts] = useState(6);
  const [isPremium, setIsPremium] = useState(false);
  const [nextEnergyTimeStr, setNextEnergyTimeStr] = useState("30:00");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    let energyInterval = null;

    // Load Streak
    const streakRef = doc(db, 'users', user.uid, 'gamification', 'streak');        
    const unsubscribeStreak = onSnapshot(streakRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setStreak(data.currentStreak || 0);
        }
    });

    // Load Coins 
    const economyRef = doc(db, 'users', user.uid, 'gamification', 'economy');        
    const unsubscribeEconomy = onSnapshot(economyRef, async (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setCoins(data.coins || 0);
        } else {
            // Initialize economy doc if it doesn't exist
            const { setDoc } = await import('firebase/firestore');
            await setDoc(economyRef, {
                coins: 25, // starting coins
                lastUpdated: new Date().toISOString()
            });
            setCoins(25);
        }
    });

    // Load Energy (Hearts)
    const energyRef = doc(db, 'users', user.uid, 'gamification', 'energy');
    const unsubscribeEnergy = onSnapshot(energyRef, async (docSnap) => {
        const { setDoc } = await import('firebase/firestore');
        const now = Date.now();
        
        let data = null;
        if (docSnap.exists()) {
            data = docSnap.data();
        } else {
            // First time init
            data = { hearts: 6, maxHearts: 6, lastRefill: now, isPremium: false };
            await setDoc(energyRef, data);
        }

        setIsPremium(data.isPremium || false);

        if (data.isPremium) {
            setHearts(data.maxHearts || 6);
            if (energyInterval) clearInterval(energyInterval);
            return;
        }

        // Logic for Free Users (Max 6, 1 every 30min)
        const THIRTY_MINUTES_MS = 30 * 60 * 1000;
        let currentHearts = data.hearts;
        let lastRefill = data.lastRefill;

        const updateEnergyUI = async () => {
            const timePassed = Date.now() - lastRefill;
            const heartsToAdd = Math.floor(timePassed / THIRTY_MINUTES_MS);
            
            if (heartsToAdd > 0 && currentHearts < data.maxHearts) {
                const newHearts = Math.min(currentHearts + heartsToAdd, data.maxHearts);
                const timeRemainder = timePassed % THIRTY_MINUTES_MS;
                const newLastRefill = Date.now() - timeRemainder;
                
                await setDoc(energyRef, { 
                    ...data, 
                    hearts: newHearts, 
                    lastRefill: newLastRefill 
                }, { merge: true });
                return;
            }

            // Calculate countdown string
            if (currentHearts < data.maxHearts) {
                const msUntilNext = THIRTY_MINUTES_MS - (Date.now() - lastRefill);
                const minutes = Math.floor(msUntilNext / 60000);
                const seconds = Math.floor((msUntilNext % 60000) / 1000);
                setNextEnergyTimeStr(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            } else {
                setNextEnergyTimeStr("Cheia");
            }
            setHearts(currentHearts);
        };

        // Run immediately and set interval
        updateEnergyUI();
        if (energyInterval) clearInterval(energyInterval);
        energyInterval = setInterval(updateEnergyUI, 1000);
    });

    return () => {
      unsubscribeStreak();
      unsubscribeEconomy();
      unsubscribeEnergy();
      if (energyInterval) clearInterval(energyInterval);
    };
  }, []);

  const trailData = [
    { id: 2, type: 'icon', color: '#1CB0F6', status: 'upcoming', position: 50, icon: 'dumbbell' },
    { id: 3, type: 'icon', color: '#1CB0F6', status: 'current', position: 80, icon: 'headphones' },
    { id: 4, type: 'star', color: '#1CB0F6', status: 'upcoming', position: 50 },
    { id: 5, type: 'icon', color: '#E5E5E5', status: 'locked', position: -40, icon: 'video' },
    { id: 6, type: 'icon', color: '#E5E5E5', status: 'locked', position: -80, icon: 'microphone' },
    { id: 7, type: 'star', color: '#E5E5E5', status: 'locked', position: -40 },
  ];

  return (
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <HomeHeader 
        streak={streak} 
        coins={coins} 
        hearts={hearts} 
        isPremium={isPremium} 
        nextEnergyTime={nextEnergyTimeStr} 
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SectionBanner 
            section={2} 
            unit={10} 
            description="Aprenda sobre juros e investimentos" 
        />
        <View style={styles.trailContainer}>
            <LottieView
                autoPlay
                loop={true}
                ref={animation}
                style={{
                    width: 150,
                    height: 150,
                }}
                // Caminho para o seu arquivo json
                source={require('../../assets/lottie/loading-coin.json')}
            />
            {trailData.map(node => <TrailNode key={node.id} node={node} />)}
        </View>
      </ScrollView>
    </View>
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

import React, { createContext, useState, useContext } from 'react';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
    const [onboardingData, setOnboardingData] = useState({
        step1: null,
        step2: null,
        step3: null,
        step4: null,
        step5: null,
    });

    const updateOnboardingData = (step, data) => {
        setOnboardingData(prev => ({
            ...prev,
            [step]: data
        }));
    };

    return (
        <OnboardingContext.Provider value={{ onboardingData, updateOnboardingData }}>
            {children}
        </OnboardingContext.Provider>
    );
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
}

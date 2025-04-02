import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../../utils/apiClient';

interface UserProfile {
    profile_id: number;
    email: string;
    username: string;
    google_id: string | null;
    google_email: string | null;
    score: number;
}

interface UserProfileContextType {
    profile: UserProfile | null;
    isLoading: boolean;
    setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await apiClient.get('/profiles/me');
                const user = response.data?.user;

                if (user) {
                    setProfile(user);
                } else {
                    console.error('Invalid response format');
                }
            } catch (error) {
                console.error('Failed to fetch profile', error);
                return;
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <UserProfileContext.Provider value={{ profile, isLoading, setProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
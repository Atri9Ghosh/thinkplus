import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { setGetToken } from '../utils/api';
import { userService } from '../services/userService';

export const useAuth = () => {
  const { isSignedIn, userId, getToken } = useClerkAuth();
  const { user } = useUser();

  useEffect(() => {
    // Set getToken function for API interceptor
    if (isSignedIn && getToken) {
      setGetToken(getToken);
    }

    // Sync user with backend
    const syncUser = async () => {
      if (isSignedIn && userId && user) {
        try {
          await userService.syncUser({
            clerkId: userId,
            email: user.primaryEmailAddress?.emailAddress,
            name: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress,
            profileImage: user.imageUrl,
          });
        } catch (error) {
          console.error('Failed to sync user:', error);
        }
      }
    };

    syncUser();
  }, [isSignedIn, userId, user, getToken]);

  return {
    isSignedIn,
    userId,
    user,
    getToken,
    id: user?.id, // Add id alias for compatibility
  };
};


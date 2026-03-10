/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; education?: string; category?: string; score?: number } | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('eduquest_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      handleLogin(userData, true);
    } else {
      setIsInitializing(false);
    }
  }, []);

  const handleLogin = async (userData: { name: string; email: string }, isAutoLogin = false) => {
    try {
      const response = await fetch(`/api/user/stats/${userData.email}`);
      if (response.ok) {
        const stats = await response.json();
        setUser({ ...userData, ...stats });
        setIsOnboardingComplete(true);
      } else {
        setUser(userData);
        setIsOnboardingComplete(false);
      }
      setIsAuthenticated(true);
      localStorage.setItem('eduquest_user', JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
      if (!isAutoLogin) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const handleOnboardingComplete = (onboardingData: { education: string; category: string; score: number }) => {
    setUser(prev => prev ? { ...prev, ...onboardingData } : null);
    setIsOnboardingComplete(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsOnboardingComplete(false);
    localStorage.removeItem('eduquest_user');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-zinc-900/10 border-t-zinc-900 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="antialiased">
      {!isAuthenticated ? (
        <Auth onLogin={handleLogin} />
      ) : !isOnboardingComplete ? (
        <Onboarding user={user!} onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

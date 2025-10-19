'use client';

import React from 'react';
import { Navigation } from './Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  navigation: {
    href: string;
    label: string;
    active?: boolean;
  }[];
  logoHref?: string;
  onLogout?: () => void;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  navigation,
  logoHref,
  onLogout,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation links={navigation} logoHref={logoHref} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

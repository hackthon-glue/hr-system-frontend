'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Drawer } from '../ui/Modal';

interface HeaderProps {
  user?: {
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
  notifications?: number;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  notifications = 0,
  onMenuClick,
  showMenuButton = true,
}) => {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // ユーザーアバターの初期文字を取得
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white border-b border-[var(--color-gray-200)] sticky top-0 z-40">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
        {/* 左側: ロゴとメニュー */}
        <div className="flex items-center gap-4">
          {/* モバイルメニューボタン */}
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* ロゴ */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-[var(--radius-md)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">HR</span>
            </div>
            <span className="font-semibold text-[var(--color-gray-900)] hidden sm:inline">
              Agent System
            </span>
          </Link>
        </div>

        {/* 中央: 検索バー（デスクトップ） */}
        <div className="hidden lg:block flex-1 max-w-xl mx-6">
          <div className="relative">
            <input
              type="search"
              placeholder="求人、候補者、スキルを検索..."
              className={cn(
                'w-full px-4 py-2 pl-10',
                'bg-[var(--color-gray-50)] border border-[var(--color-gray-200)]',
                'rounded-[var(--radius-md)]',
                'text-sm placeholder:text-[var(--color-gray-400)]',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-20',
                'focus:border-[var(--color-primary)] focus:bg-white',
                'transition-all duration-200'
              )}
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-gray-400)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* 右側: アクションボタン */}
        <div className="flex items-center gap-2">
          {/* 通知 */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-[var(--radius-md)] text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)] transition-colors"
            aria-label="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-danger)] text-white text-xs rounded-full flex items-center justify-center">
                {notifications > 9 ? '9+' : notifications}
              </span>
            )}
          </button>

          {/* ユーザーメニュー */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-[var(--radius-md)] hover:bg-[var(--color-gray-100)] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-medium">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-[var(--color-gray-900)]">
                    {user.name}
                  </div>
                  <div className="text-xs text-[var(--color-gray-600)]">
                    {user.role}
                  </div>
                </div>
                <svg className="w-4 h-4 text-[var(--color-gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* ユーザードロップダウンメニュー */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-gray-200)] py-2">
                  <div className="px-4 py-2 border-b border-[var(--color-gray-200)]">
                    <div className="text-sm font-medium text-[var(--color-gray-900)]">
                      {user.name}
                    </div>
                    <div className="text-xs text-[var(--color-gray-600)]">
                      {user.email}
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    プロフィール
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    設定
                  </Link>
                  <div className="border-t border-[var(--color-gray-200)] my-2"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50 transition-colors"
                    onClick={() => {
                      setShowUserMenu(false);
                      // ログアウト処理
                    }}
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  ログイン
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm">
                  新規登録
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* 通知パネル */}
      <Drawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        title="通知"
        position="right"
        size="sm"
      >
        <div className="space-y-4">
          {/* サンプル通知 */}
          <div className="p-3 bg-[var(--color-gray-50)] rounded-[var(--radius-md)]">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-gray-900)]">
                  新しい応募があります
                </p>
                <p className="text-xs text-[var(--color-gray-600)] mt-1">
                  山田太郎さんがフロントエンドエンジニアの求人に応募しました
                </p>
                <p className="text-xs text-[var(--color-gray-400)] mt-1">
                  5分前
                </p>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
};
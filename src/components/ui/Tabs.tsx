import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// タブコンポーネント
interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'enclosed' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'line',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  // インジケーターのスタイル更新
  useEffect(() => {
    if (variant === 'line' && tabRefs.current[activeTab]) {
      const activeTabElement = tabRefs.current[activeTab];
      if (activeTabElement) {
        setIndicatorStyle({
          left: activeTabElement.offsetLeft,
          width: activeTabElement.offsetWidth,
        });
      }
    }
  }, [activeTab, variant]);

  const sizes = {
    sm: {
      tab: 'px-3 py-1.5 text-xs',
      icon: 'w-3.5 h-3.5',
      gap: 'gap-1.5',
    },
    md: {
      tab: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      tab: 'px-5 py-2.5 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2.5',
    },
  };

  const currentSize = sizes[size];

  const baseTabStyles = cn(
    'inline-flex items-center justify-center font-medium',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    currentSize.tab,
    currentSize.gap,
    fullWidth && 'flex-1'
  );

  const variantStyles = {
    line: {
      container: 'border-b border-[var(--color-gray-200)]',
      tabList: 'flex -mb-px relative',
      tab: cn(
        baseTabStyles,
        'border-b-2 border-transparent',
        'hover:text-[var(--color-primary)] hover:border-[var(--color-gray-300)]'
      ),
      activeTab: 'text-[var(--color-primary)] border-[var(--color-primary)]',
      inactiveTab: 'text-[var(--color-gray-600)]',
      panel: 'pt-4',
    },
    enclosed: {
      container: '',
      tabList: 'flex bg-[var(--color-gray-100)] rounded-[var(--radius-lg)] p-1 gap-1',
      tab: cn(
        baseTabStyles,
        'rounded-[var(--radius-md)]',
        'hover:bg-[var(--color-gray-200)]'
      ),
      activeTab: 'bg-white shadow-sm text-[var(--color-gray-900)]',
      inactiveTab: 'text-[var(--color-gray-600)]',
      panel: 'pt-4',
    },
    pills: {
      container: '',
      tabList: 'flex gap-2',
      tab: cn(
        baseTabStyles,
        'rounded-[var(--radius-md)]',
        'hover:bg-[var(--color-gray-100)]'
      ),
      activeTab: 'bg-[var(--color-primary)] text-white',
      inactiveTab: 'text-[var(--color-gray-600)]',
      panel: 'pt-4',
    },
  };

  const styles = variantStyles[variant];
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn('w-full', className)}>
      {/* タブリスト */}
      <div className={styles.container}>
        <div className={styles.tabList} role="tablist">
          {variant === 'line' && (
            <div
              className="absolute bottom-0 h-0.5 bg-[var(--color-primary)] transition-all duration-200"
              style={indicatorStyle}
            />
          )}
          {tabs.map((tab) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={cn(
                styles.tab,
                activeTab === tab.id ? styles.activeTab : styles.inactiveTab
              )}
            >
              {tab.icon && (
                <span className={currentSize.icon}>
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={cn(
                  'ml-1.5 px-1.5 py-0.5 text-xs',
                  'bg-[var(--color-gray-200)] text-[var(--color-gray-700)]',
                  'rounded-full',
                  activeTab === tab.id && variant === 'pills' && 'bg-white/20 text-white'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* タブパネル */}
      {activeTabData && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabData.id}`}
          aria-labelledby={`tab-${activeTabData.id}`}
          className={styles.panel}
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};

// 垂直タブコンポーネント
interface VerticalTabsProps extends Omit<TabsProps, 'variant' | 'fullWidth'> {
  tabWidth?: string;
}

export const VerticalTabs: React.FC<VerticalTabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  size = 'md',
  tabWidth = '200px',
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ''
  );

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };

  const sizes = {
    sm: {
      tab: 'px-3 py-1.5 text-xs',
      icon: 'w-3.5 h-3.5',
      gap: 'gap-1.5',
    },
    md: {
      tab: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      gap: 'gap-2',
    },
    lg: {
      tab: 'px-5 py-2.5 text-base',
      icon: 'w-5 h-5',
      gap: 'gap-2.5',
    },
  };

  const currentSize = sizes[size];
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className={cn('flex gap-6', className)}>
      {/* 垂直タブリスト */}
      <div
        className="flex flex-col gap-1"
        style={{ width: tabWidth }}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center justify-start w-full',
              'rounded-[var(--radius-md)]',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              currentSize.tab,
              currentSize.gap,
              activeTab === tab.id
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold'
                : 'text-[var(--color-gray-600)] hover:bg-[var(--color-gray-100)]'
            )}
          >
            {tab.icon && (
              <span className={currentSize.icon}>
                {tab.icon}
              </span>
            )}
            <span className="flex-1 text-left">{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={cn(
                'ml-auto px-1.5 py-0.5 text-xs',
                'bg-[var(--color-gray-200)] text-[var(--color-gray-700)]',
                'rounded-full',
                activeTab === tab.id && 'bg-[var(--color-primary)] text-white'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* タブパネル */}
      {activeTabData && (
        <div
          role="tabpanel"
          id={`tabpanel-${activeTabData.id}`}
          aria-labelledby={`tab-${activeTabData.id}`}
          className="flex-1"
        >
          {activeTabData.content}
        </div>
      )}
    </div>
  );
};
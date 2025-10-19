import React from 'react';
import { cn } from '@/lib/utils';

// Badge Component
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  removable = false,
  onRemove,
  ...props
}) => {
  const variants = {
    default: 'bg-[var(--color-gray-100)] text-[var(--color-gray-700)]',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  const dotColors = {
    default: 'bg-[var(--color-gray-500)]',
    primary: 'bg-[var(--color-primary)]',
    success: 'bg-[var(--color-success)]',
    warning: 'bg-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger)]',
    info: 'bg-[var(--color-info)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', dotColors[variant])} />
      )}
      {children}
      {removable && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1 -mr-0.5 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          type="button"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge (for HR status display)
interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'pending' | 'approved' | 'rejected' | 'draft' | 'archived' | 'withdrawn' | 'submitted' | 'screening' | 'interview' | 'offer' | 'accepted';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  ...props
}) => {
  const statusConfig = {
    active: { variant: 'success' as const, label: 'Active' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    approved: { variant: 'success' as const, label: 'Approved' },
    rejected: { variant: 'danger' as const, label: 'Rejected' },
    draft: { variant: 'default' as const, label: 'Draft' },
    archived: { variant: 'default' as const, label: 'Archived' },
    withdrawn: { variant: 'default' as const, label: 'Withdrawn' },
    submitted: { variant: 'info' as const, label: 'Submitted' },
    screening: { variant: 'warning' as const, label: 'Screening' },
    interview: { variant: 'warning' as const, label: 'Interview' },
    offer: { variant: 'success' as const, label: 'Offer' },
    accepted: { variant: 'success' as const, label: 'Accepted' },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Badge
      variant={config.variant}
      dot
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

// Experience Level Badge
interface ExperienceBadgeProps extends Omit<BadgeProps, 'variant'> {
  level: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal';
}

export const ExperienceBadge: React.FC<ExperienceBadgeProps> = ({
  level,
  className,
  ...props
}) => {
  const levelConfig = {
    entry: { variant: 'default' as const, label: 'Entry' },
    junior: { variant: 'info' as const, label: 'Junior' },
    mid: { variant: 'primary' as const, label: 'Mid' },
    senior: { variant: 'success' as const, label: 'Senior' },
    lead: { variant: 'warning' as const, label: 'Lead' },
    principal: { variant: 'danger' as const, label: 'Principal' },
  };

  const config = levelConfig[level] || levelConfig.entry;

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  );
};

// Skill Badge
interface SkillBadgeProps extends Omit<BadgeProps, 'variant'> {
  skill: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  level,
  className,
  ...props
}) => {
  const levelConfig = {
    beginner: 'default' as const,
    intermediate: 'info' as const,
    advanced: 'primary' as const,
    expert: 'success' as const,
  };

  return (
    <Badge
      variant={level ? levelConfig[level] : 'default'}
      className={className}
      {...props}
    >
      {skill}
    </Badge>
  );
};

// Badge with Count
interface CountBadgeProps extends Omit<BadgeProps, 'children'> {
  count: number;
  max?: number;
}

export const CountBadge: React.FC<CountBadgeProps> = ({
  count,
  max = 99,
  className,
  ...props
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      size="xs"
      className={cn('min-w-[20px] justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  );
};
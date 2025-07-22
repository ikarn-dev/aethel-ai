import React from 'react';
import Image from 'next/image';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'glass' | 'solid';
    size?: 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    size = 'md',
    onClick
}: CardProps) {
    const baseClasses = 'rounded-xl border transition-all duration-300 hover:scale-105';

    const variantClasses = {
        default: 'bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15',
        glass: 'bg-teal-500/10 backdrop-blur-md border-teal-400/30 hover:bg-teal-500/15',
        solid: 'bg-teal-600/20 border-teal-500/40 hover:bg-teal-600/30'
    };

    const sizeClasses = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: 'up' | 'down' | 'neutral';
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon,
    trend = 'neutral',
    className = ''
}: StatCardProps) {
    const trendColors = {
        up: 'text-green-400',
        down: 'text-red-400',
        neutral: 'text-gray-300'
    };

    return (
        <Card variant="glass" size="md" className={className}>
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-teal-200/80 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white mb-1">{value}</p>
                    {subtitle && (
                        <p className={`text-sm ${trendColors[trend]}`}>{subtitle}</p>
                    )}
                </div>
                {icon && (
                    <div className="text-teal-300 opacity-80">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}

interface ActionCardProps {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

export function ActionCard({
    title,
    description,
    icon,
    onClick,
    className = '',
    disabled = false
}: ActionCardProps) {
    return (
        <Card
            variant="glass"
            size="md"
            className={`cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-teal-300/50'} ${className}`}
            onClick={disabled ? undefined : onClick}
        >
            <div className="flex items-center space-x-4">
                {icon && (
                    <div className="text-teal-300 group-hover:text-teal-200 transition-colors">
                        {icon}
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{title}</h3>
                    {description && (
                        <p className="text-teal-200/70 text-sm">{description}</p>
                    )}
                </div>
                <div className="text-teal-300/60 group-hover:text-teal-300 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </Card>
    );
}

interface StatusCardProps {
    title: string;
    status: 'online' | 'offline' | 'processing' | 'ready';
    description?: string;
    avatar?: string;
    className?: string;
}

export function StatusCard({
    title,
    status,
    description,
    avatar,
    className = ''
}: StatusCardProps) {
    const statusConfig = {
        online: { color: 'bg-green-500', text: 'Online', textColor: 'text-green-400' },
        offline: { color: 'bg-gray-500', text: 'Offline', textColor: 'text-gray-400' },
        processing: { color: 'bg-yellow-500', text: 'Processing', textColor: 'text-yellow-400' },
        ready: { color: 'bg-teal-500', text: 'Ready', textColor: 'text-teal-400' }
    };

    const config = statusConfig[status];

    return (
        <Card variant="glass" size="md" className={className}>
            <div className="flex items-center space-x-4">
                {avatar ? (
                    <div className="relative">
                        <Image
                            src={avatar}
                            alt={title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full border-2 border-teal-400/30"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${config.color} rounded-full border-2 border-teal-900`}></div>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="w-10 h-10 bg-teal-600/40 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${config.color} rounded-full border-2 border-teal-900`}></div>
                    </div>
                )}
                <div className="flex-1">
                    <h3 className="text-white font-semibold">{title}</h3>
                    <p className={`text-sm ${config.textColor}`}>
                        {config.text} {description && `• ${description}`}
                    </p>
                </div>
            </div>
        </Card>
    );
}
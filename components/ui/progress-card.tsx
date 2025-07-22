import React from 'react';
import { Card } from './card';

interface ProgressCardProps {
  title: string;
  value: number;
  maxValue?: number;
  unit?: string;
  description?: string;
  color?: 'teal' | 'green' | 'blue' | 'purple';
  className?: string;
}

export function ProgressCard({ 
  title, 
  value, 
  maxValue = 100, 
  unit = '%',
  description,
  color = 'teal',
  className = '' 
}: ProgressCardProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const colorClasses = {
    teal: {
      bar: 'bg-teal-500',
      background: 'bg-teal-500/20',
      text: 'text-teal-300'
    },
    green: {
      bar: 'bg-green-500',
      background: 'bg-green-500/20',
      text: 'text-green-300'
    },
    blue: {
      bar: 'bg-blue-500',
      background: 'bg-blue-500/20',
      text: 'text-blue-300'
    },
    purple: {
      bar: 'bg-purple-500',
      background: 'bg-purple-500/20',
      text: 'text-purple-300'
    }
  };

  const colors = colorClasses[color];

  return (
    <Card variant="glass" size="md" className={className}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{title}</h3>
          <span className={`text-lg font-bold ${colors.text}`}>
            {value}{unit}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className={`w-full h-2 ${colors.background} rounded-full overflow-hidden`}>
            <div 
              className={`h-full ${colors.bar} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          {description && (
            <p className="text-teal-200/70 text-sm">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  metrics: Array<{
    label: string;
    value: string | number;
    color?: string;
  }>;
  className?: string;
}

export function MetricCard({ title, metrics, className = '' }: MetricCardProps) {
  return (
    <Card variant="glass" size="md" className={className}>
      <div className="space-y-4">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-teal-200/80 text-sm">{metric.label}</span>
              <span 
                className={`font-semibold ${metric.color || 'text-white'}`}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
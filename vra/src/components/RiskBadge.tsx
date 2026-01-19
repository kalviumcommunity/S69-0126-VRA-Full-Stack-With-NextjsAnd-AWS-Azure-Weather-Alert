import { cn } from '@/lib/utils';

type RiskLevel = 'Low' | 'Medium' | 'High' | 'Severe';

interface RiskBadgeProps {
    level: RiskLevel;
    className?: string;
}

export default function RiskBadge({ level, className }: RiskBadgeProps) {
    const styles = {
        Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        High: 'bg-orange-100 text-orange-800 border-orange-200',
        Severe: 'bg-red-100 text-red-800 border-red-200',
    };

    return (
        <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-base font-bold border", styles[level], className)}>
            {level} Risk
        </span>
    );
}

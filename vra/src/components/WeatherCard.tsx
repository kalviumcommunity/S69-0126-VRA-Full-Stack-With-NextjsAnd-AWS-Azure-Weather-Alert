import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: LucideIcon;
    colorClass?: string;
}

export default function WeatherCard({ title, value, unit, icon: Icon, colorClass = "text-blue-500" }: WeatherCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-950">{value}</span>
                    <span className="text-sm text-slate-500">{unit}</span>
                </div>
            </div>
            <div className={cn("p-3 rounded-lg bg-slate-100")}>
                <Icon className={cn("h-6 w-6", colorClass)} />
            </div>
        </div>
    );
}

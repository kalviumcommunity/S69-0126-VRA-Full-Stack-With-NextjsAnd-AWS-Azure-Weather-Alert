import { AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBannerProps {
    alerts: Array<{
        id: number;
        type: string;
        message: string;
        location: string;
    }>;
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
    if (alerts.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            {alerts.map((alert) => (
                <div
                    key={alert.id}
                    className={cn(
                        "p-4 rounded-lg border flex items-start gap-4 shadow-sm",
                        alert.type === 'critical'
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-yellow-50 border-yellow-200 text-yellow-800"
                    )}
                >
                    {alert.type === 'critical' ? (
                        <AlertTriangle className="h-6 w-6 flex-shrink-0 text-red-600 mt-1" />
                    ) : (
                        <Info className="h-6 w-6 flex-shrink-0 text-yellow-600 mt-1" />
                    )}
                    <div>
                        <h4 className="font-bold text-lg uppercase tracking-wide">
                            {alert.type} ALERT: {alert.location}
                        </h4>
                        <p className="mt-1">{alert.message}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

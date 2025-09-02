import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Medal, Award, Trophy } from "lucide-react";
import { SedationistPerformance } from "../types/dashboard.types";

interface TopSedationistsCardProps {
  sedationists: SedationistPerformance[];
  className?: string;
  style?: React.CSSProperties;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-4 w-4 text-yellow-600" />;
    case 2:
      return <Medal className="h-4 w-4 text-gray-500" />;
    case 3:
      return <Award className="h-4 w-4 text-amber-600" />;
    default:
      return <span className="h-4 w-4 flex items-center justify-center text-xs font-semibold text-muted-foreground">#{rank}</span>;
  }
};

const getRankBadgeColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-yellow-50";
    case 2:
      return "bg-gradient-to-r from-gray-400 to-gray-500 text-gray-50";
    case 3:
      return "bg-gradient-to-r from-amber-500 to-amber-600 text-amber-50";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ChangeIndicator = ({ change, changeType }: { change: number; changeType: 'positive' | 'negative' | 'neutral' }) => {
  if (changeType === 'neutral' || change === 0) {
    return (
      <div className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-3 w-3" />
        <span className="text-xs">0%</span>
      </div>
    );
  }

  const isPositive = changeType === 'positive';
  return (
    <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      <span className="text-xs font-medium">
        {isPositive ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
};

export const TopSedationistsCard = ({ sedationists, className, style }: TopSedationistsCardProps) => {
  return (
    <Card className={`h-full max-h-96 flex flex-col ${className || ''}`} style={style}>
      <CardContent className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {sedationists.map((sedationist) => (
            <div
              key={sedationist.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card/50 hover:bg-card/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center h-8 w-8 rounded-full ${getRankBadgeColor(sedationist.rank)}`}>
                  {getRankIcon(sedationist.rank)}
                </div>
                <div>
                  <div className="font-medium text-sm">
                    {sedationist.title} {sedationist.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {sedationist.clinics.length} clinic{sedationist.clinics.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm">
                  {sedationist.completedAppointments}
                </div>
                <ChangeIndicator 
                  change={sedationist.change} 
                  changeType={sedationist.changeType}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
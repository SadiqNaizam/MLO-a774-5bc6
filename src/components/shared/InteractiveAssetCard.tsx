import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For asset icon
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'; // Example icons

// Forward ref for potential use with animation libraries like Framer Motion
const AnimatedFinancialValue = React.lazy(() => import('./AnimatedFinancialValue'));


interface InteractiveAssetCardProps {
  assetAbbreviation: string; // e.g., BTC
  assetName: string; // e.g., Bitcoin
  iconUrl?: string;
  currentValue: number; // Current value in user's portfolio or market price
  valueCurrency?: string; // e.g., USD
  changePercentage?: number; // e.g., 2.5 for +2.5%
  onTradeClick?: (asset: string) => void;
  onDetailsClick?: (asset: string) => void;
}

const InteractiveAssetCard: React.FC<InteractiveAssetCardProps> = ({
  assetAbbreviation,
  assetName,
  iconUrl,
  currentValue,
  valueCurrency = "USD",
  changePercentage,
  onTradeClick,
  onDetailsClick,
}) => {
  console.log("Rendering InteractiveAssetCard for:", assetAbbreviation);
  const isPositiveChange = changePercentage !== undefined && changePercentage >= 0;

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium flex items-center">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={iconUrl} alt={assetName} />
              <AvatarFallback>{assetAbbreviation.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            {assetName} ({assetAbbreviation.toUpperCase()})
          </CardTitle>
          <CardDescription>Your Holdings / Market Price</CardDescription>
        </div>
        {/* Optional: small chart icon or similar */}
      </CardHeader>
      <CardContent className="space-y-1">
        <React.Suspense fallback={<div className="text-2xl font-bold">Loading...</div>}>
          <AnimatedFinancialValue
            value={currentValue}
            className="text-2xl font-bold"
            prefix={valueCurrency === "USD" ? "$" : ""}
            suffix={valueCurrency !== "USD" ? ` ${valueCurrency}` : ""}
            decimals={2}
          />
        </React.Suspense>
        {changePercentage !== undefined && (
          <p className={`text-xs ${isPositiveChange ? 'text-green-600' : 'text-red-600'} flex items-center`}>
            {isPositiveChange ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
            {changePercentage.toFixed(2)}%
            <span className="text-muted-foreground ml-1"> (24h)</span>
          </p>
        )}
      </CardContent>
      {(onTradeClick || onDetailsClick) && (
        <CardFooter className="flex justify-end space-x-2 pt-4">
          {onDetailsClick && (
            <Button variant="outline" size="sm" onClick={() => onDetailsClick(assetAbbreviation)}>
              Details
            </Button>
          )}
          {onTradeClick && (
            <Button size="sm" onClick={() => onTradeClick(assetAbbreviation)}>
              <TrendingUp className="mr-2 h-4 w-4" /> Trade
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default InteractiveAssetCard;
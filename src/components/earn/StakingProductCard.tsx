import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; // For showing staking progress or capacity
import { Zap, CalendarDays, Percent } from 'lucide-react'; // Example icons

interface StakingProductCardProps {
  assetName: string; // e.g., "Ethereum"
  assetSymbol: string; // e.g., "ETH"
  apy: number; // Annual Percentage Yield, e.g., 5.5 for 5.5%
  durationDays?: number; // e.g., 30, 60, 90 or undefined for flexible
  minStakeAmount?: number;
  maxStakeAmount?: number;
  totalStaked?: number; // Total amount staked in this product
  capacity?: number; // Total capacity of the staking pool
  onStakeClick: (productId: string | number) => void;
  productId: string | number;
  iconUrl?: string; // URL for asset icon
}

const StakingProductCard: React.FC<StakingProductCardProps> = ({
  assetName,
  assetSymbol,
  apy,
  durationDays,
  minStakeAmount,
  onStakeClick,
  productId,
  totalStaked,
  capacity,
  iconUrl,
}) => {
  console.log("Rendering StakingProductCard for:", assetName);
  const progressPercentage = capacity && totalStaked ? (totalStaked / capacity) * 100 : undefined;

  return (
    <Card className="w-full flex flex-col justify-between hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center">
            {iconUrl && <img src={iconUrl} alt={assetName} className="w-6 h-6 mr-2 rounded-full" />}
            Stake {assetName} ({assetSymbol})
          </CardTitle>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {durationDays ? `${durationDays} Days` : 'Flexible'}
          </span>
        </div>
        {minStakeAmount && <CardDescription>Min. {minStakeAmount} {assetSymbol}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-center text-center my-4">
          <span className="text-4xl font-bold text-green-600">{apy.toFixed(2)}</span>
          <span className="text-xl font-medium text-green-600">%</span>
          <span className="text-sm text-muted-foreground ml-1">APR</span>
        </div>
        
        <div className="space-y-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center"><Percent className="w-4 h-4 mr-1.5" />Est. APR</span>
                <span className="font-medium">{apy.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
                <span className="text-muted-foreground flex items-center"><CalendarDays className="w-4 h-4 mr-1.5" />Duration</span>
                <span className="font-medium">{durationDays ? `${durationDays} Days` : 'Flexible'}</span>
            </div>
        </div>

        {progressPercentage !== undefined && capacity && (
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Pool Filled</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {totalStaked?.toLocaleString() || 0} / {capacity.toLocaleString()} {assetSymbol}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onStakeClick(productId)}>
          <Zap className="mr-2 h-4 w-4" /> Stake Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StakingProductCard;
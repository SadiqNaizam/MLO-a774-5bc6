import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import ModularDashboardWidget from '@/components/dashboard/ModularDashboardWidget';
import InteractiveAssetCard from '@/components/shared/InteractiveAssetCard';
import AnimatedFinancialValue from '@/components/shared/AnimatedFinancialValue';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ArrowRight, TrendingUp, Rss, Sparkles } from 'lucide-react';

const DashboardPage = () => {
  console.log('DashboardPage loaded');

  const placeholderPortfolio = [
    { assetAbbreviation: 'BTC', assetName: 'Bitcoin', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', currentValue: 50000.75, valueCurrency: 'USD', changePercentage: 2.5 },
    { assetAbbreviation: 'ETH', assetName: 'Ethereum', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', currentValue: 15000.20, valueCurrency: 'USD', changePercentage: -1.2 },
    { assetAbbreviation: 'ADA', assetName: 'Cardano', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png', currentValue: 2500.00, valueCurrency: 'USD', changePercentage: 5.1 },
  ];

  const trendingCryptos = [
    { name: 'Solana (SOL)', change: "+7.8%", icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" },
    { name: 'Dogecoin (DOGE)', change: "+3.2%", icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/74.png" },
    { name: 'Polygon (MATIC)', change: "-0.5%", icon: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png" },
  ];

  const newsItems = [
    { title: "Market Update: Bitcoin Reaches New High", source: "CryptoNews", impact: "High", time: "2h ago" },
    { title: "Ethereum Merge Nearing Completion", source: "ETH Foundation", impact: "Medium", time: "5h ago" },
  ];

  const handleTradeClick = (asset: string) => {
    console.log(`Trade button clicked for ${asset}`);
    // Navigate to trading page for this asset, e.g., router.push(`/trading/${asset}-USD`)
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <NavigationMenu />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Welcome Back, User!</h1>
            <p className="text-muted-foreground">Here's your financial overview for today.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <ModularDashboardWidget title="Total Portfolio Value" description="Across all assets">
              <AnimatedFinancialValue
                value={placeholderPortfolio.reduce((sum, asset) => sum + asset.currentValue, 0)}
                prefix="$"
                className="text-4xl font-bold text-primary"
                decimals={2}
              />
              <p className="text-sm text-green-500 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" /> +3.5% in last 24h
              </p>
            </ModularDashboardWidget>
             <ModularDashboardWidget title="Quick Actions">
                <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => console.log("Deposit clicked")}>Deposit Funds</Button>
                    <Button variant="outline" onClick={() => console.log("Withdraw clicked")}>Withdraw Funds</Button>
                    <Button variant="secondary" className="col-span-2" onClick={() => console.log("Go to Trade")}>
                        Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </ModularDashboardWidget>
            <ModularDashboardWidget title="Market Status" description="Global Crypto Cap">
                 <AnimatedFinancialValue
                    value={2.17} // Example: 2.17 Trillion
                    suffix=" Trillion USD"
                    className="text-3xl font-bold"
                    decimals={2}
                />
                <p className="text-sm text-red-500 flex items-center mt-1">
                    -1.8% change
                </p>
            </ModularDashboardWidget>
          </div>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {placeholderPortfolio.map(asset => (
                <InteractiveAssetCard
                  key={asset.assetAbbreviation}
                  assetAbbreviation={asset.assetAbbreviation}
                  assetName={asset.assetName}
                  iconUrl={asset.iconUrl}
                  currentValue={asset.currentValue}
                  valueCurrency={asset.valueCurrency}
                  changePercentage={asset.changePercentage}
                  onTradeClick={handleTradeClick}
                  onDetailsClick={(assetAb_param) => console.log(`Details for ${assetAb_param}`)}
                />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ModularDashboardWidget title="Trending Cryptocurrencies" className="lg:col-span-1" description="Top movers this week">
              <ul className="space-y-3">
                {trendingCryptos.map(crypto => (
                  <li key={crypto.name} className="flex items-center justify-between p-2 hover:bg-accent rounded-md">
                     <div className="flex items-center">
                        <img src={crypto.icon} alt={crypto.name} className="w-6 h-6 mr-2 rounded-full"/>
                        <span className="font-medium text-sm">{crypto.name}</span>
                     </div>
                    <span className={`text-xs font-semibold ${crypto.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{crypto.change}</span>
                  </li>
                ))}
              </ul>
            </ModularDashboardWidget>

            <ModularDashboardWidget title="Curated News Feed" className="lg:col-span-2" description="Latest updates impacting the market">
              <div className="space-y-4">
                {newsItems.map(item => (
                  <Card key={item.title} className="bg-card/50">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-semibold">{item.title}</CardTitle>
                      <CardDescription className="text-xs">{item.source} - {item.time}</CardDescription>
                    </CardHeader>
                    <CardContent className="px-4 pb-3">
                      <p className="text-xs text-primary">Impact: {item.impact}</p>
                    </CardContent>
                  </Card>
                ))}
                <Button variant="link" className="text-primary p-0 h-auto">View All News <ArrowRight className="ml-1 h-3 w-3" /></Button>
              </div>
            </ModularDashboardWidget>
          </div>

           <ModularDashboardWidget title="Personalized Recommendations" description="Opportunities tailored for you" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center"><Sparkles className="w-5 h-5 mr-2 text-yellow-500"/>New Staking Opportunity</CardTitle>
                            <CardDescription>Earn up to 12% APY on stablecoins.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm">Explore Staking</Button>
                        </CardContent>
                    </Card>
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-green-500"/>Hot Airdrop Alert</CardTitle>
                            <CardDescription>Participate in the latest token airdrop from Project X.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button size="sm" variant="secondary">Learn More</Button>
                        </CardContent>
                    </Card>
                </div>
            </ModularDashboardWidget>

        </main>
      </ScrollArea>
    </div>
  );
};

export default DashboardPage;
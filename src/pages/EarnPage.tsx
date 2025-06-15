import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import StakingProductCard from '@/components/earn/StakingProductCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Zap, PiggyBank, Rocket } from 'lucide-react';

interface StakingProduct {
  id: string;
  assetName: string;
  assetSymbol: string;
  apy: number;
  durationDays?: number;
  minStakeAmount: number;
  iconUrl: string;
  totalStaked?: number;
  capacity?: number;
}

const initialStakingProducts: StakingProduct[] = [
  { id: 'eth-stake-flex', assetName: 'Ethereum', assetSymbol: 'ETH', apy: 4.5, minStakeAmount: 0.1, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', totalStaked: 7500, capacity: 10000 },
  { id: 'usdt-stake-30', assetName: 'Tether', assetSymbol: 'USDT', apy: 8.0, durationDays: 30, minStakeAmount: 100, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png', totalStaked: 1500000, capacity: 2000000 },
  { id: 'ada-stake-90', assetName: 'Cardano', assetSymbol: 'ADA', apy: 6.2, durationDays: 90, minStakeAmount: 500, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png', totalStaked: 800000, capacity: 1000000},
  { id: 'sol-stake-flex', assetName: 'Solana', assetSymbol: 'SOL', apy: 7.1, minStakeAmount: 1, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', totalStaked: 4500, capacity: 5000 },
];

const launchpadProjects = [
    { id: 'projX', name: "Project X Token (PXT)", description: "Next-gen DeFi protocol.", status: "Subscription Open", endsIn: "3 days", iconUrl: "https://source.unsplash.com/random/64x64/?abstract,network" },
    { id: 'projY', name: "Metaverse Game Coin (MGC)", description: "Decentralized gaming currency.", status: "Upcoming", endsIn: "10 days", iconUrl: "https://source.unsplash.com/random/64x64/?abstract,game" },
]

const EarnPage = () => {
  console.log('EarnPage loaded');
  const [isStakeDialogOpen, setIsStakeDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StakingProduct | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStakeClick = (productId: string | number) => {
    const product = initialStakingProducts.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setIsStakeDialogOpen(true);
    }
  };

  const confirmStake = () => {
    if(selectedProduct && stakeAmount) {
        console.log(`Staking ${stakeAmount} ${selectedProduct.assetSymbol} in ${selectedProduct.assetName}`);
        // API call, update state, etc.
        setIsStakeDialogOpen(false);
        setStakeAmount('');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <NavigationMenu />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Earn Crypto</h1>
            <p className="text-muted-foreground">Maximize your returns with our yield-generating products.</p>
          </header>

          <Tabs defaultValue="staking" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="staking"><Zap className="h-4 w-4 mr-2" />Staking</TabsTrigger>
              <TabsTrigger value="savings" disabled><PiggyBank className="h-4 w-4 mr-2" />Savings (Soon)</TabsTrigger>
              <TabsTrigger value="launchpad"><Rocket className="h-4 w-4 mr-2" />Launchpad</TabsTrigger>
            </TabsList>

            <TabsContent value="staking">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialStakingProducts.map(product => (
                  <StakingProductCard
                    key={product.id}
                    productId={product.id}
                    assetName={product.assetName}
                    assetSymbol={product.assetSymbol}
                    apy={product.apy}
                    durationDays={product.durationDays}
                    minStakeAmount={product.minStakeAmount}
                    iconUrl={product.iconUrl}
                    onStakeClick={handleStakeClick}
                    totalStaked={product.totalStaked}
                    capacity={product.capacity}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="savings">
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Products</CardTitle>
                        <CardDescription>Flexible and fixed-term savings options coming soon.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center py-12 text-muted-foreground">
                        <PiggyBank className="h-12 w-12 mx-auto mb-4"/>
                        <p>Our Savings products are under development. Stay tuned!</p>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="launchpad">
                <div className="space-y-6">
                    {launchpadProjects.map(project => (
                        <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="md:flex">
                                <div className="md:flex-shrink-0">
                                    <img className="h-48 w-full object-cover md:w-48" src={project.iconUrl} alt={project.name}/>
                                </div>
                                <div className="p-6 flex flex-col justify-between flex-grow">
                                    <div>
                                        <div className="uppercase tracking-wide text-sm text-primary font-semibold">{project.name}</div>
                                        <p className="mt-1 text-muted-foreground">{project.description}</p>
                                        <Badge className="mt-2" variant={project.status === "Subscription Open" ? "default" : "secondary"}>{project.status}</Badge>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <p className="text-sm text-muted-foreground">Ends in: {project.endsIn}</p>
                                        <Button disabled={project.status !== "Subscription Open"}>
                                            {project.status === "Subscription Open" ? "Participate Now" : "View Details"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </TabsContent>
          </Tabs>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Staking?</AccordionTrigger>
                <AccordionContent>
                  Staking is the process of actively participating in transaction validation (similar to mining) on a proof-of-stake (PoS) blockchain. By staking your coins, you help secure the network and earn rewards.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Are there any risks?</AccordionTrigger>
                <AccordionContent>
                  While staking is generally considered lower risk than trading, potential risks include smart contract vulnerabilities (for DeFi staking) and market volatility affecting the value of staked assets and rewards. Locked staking also means your assets are illiquid for the duration.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>How are APYs calculated?</AccordionTrigger>
                <AccordionContent>
                  Annual Percentage Yield (APY) is the real rate of return earned on an investment, taking into account the effect of compounding interest. Staking APYs can fluctuate based on network conditions, total staked amount, and other factors.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </main>
      </ScrollArea>

      {selectedProduct && (
        <Dialog open={isStakeDialogOpen} onOpenChange={setIsStakeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Stake {selectedProduct.assetName} ({selectedProduct.assetSymbol})</DialogTitle>
              <DialogDescription>
                Earn {selectedProduct.apy}% APY. Duration: {selectedProduct.durationDays ? `${selectedProduct.durationDays} Days` : 'Flexible'}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
                <div>
                    <Label htmlFor="stakeAmount">Amount to Stake ({selectedProduct.assetSymbol})</Label>
                    <Input id="stakeAmount" type="number" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} placeholder={`Min. ${selectedProduct.minStakeAmount}`}/>
                    <p className="text-xs text-muted-foreground mt-1">Available Balance: X.XX {selectedProduct.assetSymbol} (placeholder)</p>
                </div>
                <div>
                    <p className="text-sm">Estimated Daily Reward: Y.YY {selectedProduct.assetSymbol} (placeholder)</p>
                </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsStakeDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmStake}>Confirm Stake</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EarnPage;
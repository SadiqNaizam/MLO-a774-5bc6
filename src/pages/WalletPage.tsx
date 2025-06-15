import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import InteractiveAssetCard from '@/components/shared/InteractiveAssetCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart'; // shadcn chart components
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'; // Using recharts for pie chart
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowDownToLine, ArrowUpFromLine, Copy, History } from 'lucide-react';

interface AssetHolding {
  id: string;
  assetAbbreviation: string;
  assetName: string;
  iconUrl: string;
  balance: number;
  valueUSD: number;
  color: string; // For pie chart
}

interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdraw' | 'Trade' | 'Earn';
  assetSymbol: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  details: string;
}

const initialAssetHoldings: AssetHolding[] = [
  { id: 'btc', assetAbbreviation: 'BTC', assetName: 'Bitcoin', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', balance: 0.5, valueUSD: 33500, color: '#F7931A' },
  { id: 'eth', assetAbbreviation: 'ETH', assetName: 'Ethereum', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', balance: 10, valueUSD: 35000, color: '#627EEA' },
  { id: 'ada', assetAbbreviation: 'ADA', assetName: 'Cardano', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png', balance: 5000, valueUSD: 2250, color: '#0033AD' },
  { id: 'usdt', assetAbbreviation: 'USDT', assetName: 'Tether', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png', balance: 10000, valueUSD: 10000, color: '#26A17B'},
];

const initialTransactions: Transaction[] = [
  { id: '1', type: 'Deposit', assetSymbol: 'BTC', amount: 0.1, status: 'Completed', date: '2024-07-27', details: 'From external wallet' },
  { id: '2', type: 'Trade', assetSymbol: 'ETH', amount: -2, status: 'Completed', date: '2024-07-26', details: 'Sold ETH for USDT' },
  { id: '3', type: 'Withdraw', assetSymbol: 'USDT', amount: -1000, status: 'Pending', date: '2024-07-28', details: 'To Binance' },
  { id: '4', type: 'Earn', assetSymbol: 'ADA', amount: 50, status: 'Completed', date: '2024-07-25', details: 'Staking reward' },
];


const WalletPage = () => {
  console.log('WalletPage loaded');
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [selectedAssetForTx, setSelectedAssetForTx] = useState<AssetHolding | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  
  const totalPortfolioValueUSD = initialAssetHoldings.reduce((sum, asset) => sum + asset.valueUSD, 0);

  const chartConfig = {
    valueUSD: { label: 'USD Value' },
    ...initialAssetHoldings.reduce((acc, curr) => {
        acc[curr.assetAbbreviation.toLowerCase()] = { label: curr.assetName, color: curr.color };
        return acc;
    }, {} as any)
  };

  const handleDeposit = (asset: AssetHolding) => {
    setSelectedAssetForTx(asset);
    setIsDepositDialogOpen(true);
  };

  const handleWithdraw = (asset: AssetHolding) => {
    setSelectedAssetForTx(asset);
    setIsWithdrawDialogOpen(true);
  };

  const processWithdrawal = () => {
    if (!selectedAssetForTx || !withdrawAmount || !withdrawAddress) {
        alert("Please fill all fields");
        return;
    }
    console.log(`Withdraw ${withdrawAmount} ${selectedAssetForTx.assetAbbreviation} to ${withdrawAddress}`);
    // Add to transaction history, update balance, etc.
    setIsWithdrawDialogOpen(false);
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-muted/40">
      <NavigationMenu />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">My Wallet</h1>
              <p className="text-muted-foreground">Manage your crypto assets and transactions.</p>
            </div>
            <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-bold">${totalPortfolioValueUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
            <Card>
              <CardContent className="p-4 h-[300px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="assetName" hideLabel />} />
                      <Pie data={initialAssetHoldings} dataKey="valueUSD" nameKey="assetName" cx="50%" cy="50%" outerRadius={100} labelLine={false} 
                           label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                const RADIAN = Math.PI / 180;
                                const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                return (
                                <text x={x} y={y} fill={initialAssetHoldings[index].color} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12px">
                                    {`${initialAssetHoldings[index].assetAbbreviation} (${(percent * 100).toFixed(0)}%)`}
                                </text>
                                );
                            }}
                      >
                        {initialAssetHoldings.map((entry) => (
                          <Cell key={`cell-${entry.id}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent nameKey="assetName" />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Holdings</h2>
            <div className="space-y-3">
              {initialAssetHoldings.map(asset => (
                <Card key={asset.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={asset.iconUrl} alt={asset.assetName} />
                            <AvatarFallback>{asset.assetAbbreviation.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{asset.assetName} ({asset.assetAbbreviation})</p>
                            <p className="text-sm text-muted-foreground">
                                {asset.balance.toLocaleString()} {asset.assetAbbreviation} ≈ ${asset.valueUSD.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleDeposit(asset)}><ArrowDownToLine className="h-4 w-4 mr-1.5"/>Deposit</Button>
                        <Button variant="outline" size="sm" onClick={() => handleWithdraw(asset)}><ArrowUpFromLine className="h-4 w-4 mr-1.5"/>Withdraw</Button>
                    </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 flex items-center"><History className="h-5 w-5 mr-2"/>Transaction History</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initialTransactions.map(tx => (
                    <TableRow key={tx.id}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.type}</TableCell>
                      <TableCell>{tx.assetSymbol}</TableCell>
                      <TableCell className={tx.amount > 0 ? 'text-green-600' : tx.type === 'Withdraw' || tx.type === 'Trade' && tx.amount < 0 ? 'text-red-600': ''}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={tx.status === 'Completed' ? 'default' : (tx.status === 'Pending' ? 'secondary' : 'destructive')}>
                          {tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{tx.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </main>
      </ScrollArea>

      {/* Deposit Dialog */}
      {selectedAssetForTx && (
        <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deposit {selectedAssetForTx.assetName} ({selectedAssetForTx.assetAbbreviation})</DialogTitle>
              <DialogDescription>
                Send only {selectedAssetForTx.assetAbbreviation} to this address. Sending any other coin may result in permanent loss.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4 text-center">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=YOUR_${selectedAssetForTx.assetAbbreviation}_DEPOSIT_ADDRESS`} alt="QR Code" className="mx-auto mb-2 border rounded"/>
              <Label htmlFor="depositAddress">Your {selectedAssetForTx.assetAbbreviation} Deposit Address:</Label>
              <div className="flex items-center mt-1">
                <Input id="depositAddress" readOnly value={`YOUR_${selectedAssetForTx.assetAbbreviation}_DEPOSIT_ADDRESS`} className="text-sm"/>
                <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(`YOUR_${selectedAssetForTx.assetAbbreviation}_DEPOSIT_ADDRESS`)}><Copy className="h-4 w-4"/></Button>
              </div>
               <p className="text-xs text-muted-foreground mt-2">Minimum deposit: 0.001 {selectedAssetForTx.assetAbbreviation}</p>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsDepositDialogOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Withdraw Dialog */}
      {selectedAssetForTx && (
        <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Withdraw {selectedAssetForTx.assetName} ({selectedAssetForTx.assetAbbreviation})</DialogTitle>
              <DialogDescription>
                Ensure the address and network are correct. Withdrawals to incorrect addresses may be irreversible.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
                <div>
                    <Label htmlFor="withdrawAddress">Recipient {selectedAssetForTx.assetAbbreviation} Address</Label>
                    <Input id="withdrawAddress" value={withdrawAddress} onChange={(e) => setWithdrawAddress(e.target.value)} placeholder={`Enter ${selectedAssetForTx.assetAbbreviation} address`}/>
                </div>
                <div>
                    <Label htmlFor="withdrawAmount">Amount</Label>
                    <Input id="withdrawAmount" type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} placeholder="0.00"/>
                    <p className="text-xs text-muted-foreground mt-1">Available: {selectedAssetForTx.balance} {selectedAssetForTx.assetAbbreviation}</p>
                </div>
                {/* Add Network selection if applicable */}
                <p className="text-xs text-muted-foreground">Fee: 0.0005 {selectedAssetForTx.assetAbbreviation} (example)</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWithdrawDialogOpen(false)}>Cancel</Button>
              <Button onClick={processWithdrawal}>Submit Withdrawal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default WalletPage;
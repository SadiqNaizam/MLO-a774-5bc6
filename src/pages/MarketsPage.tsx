import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Search, TrendingUp, TrendingDown, BarChartBig } from 'lucide-react';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  iconUrl: string;
  isFavorite?: boolean;
}

const initialCryptoData: CryptoData[] = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 67000.50, change24h: 1.25, volume24h: 35e9, marketCap: 1.3e12, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png', isFavorite: true },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3500.75, change24h: -0.50, volume24h: 18e9, marketCap: 420e9, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', isFavorite: true },
  { id: 'solana', name: 'Solana', symbol: 'SOL', price: 150.20, change24h: 5.60, volume24h: 2.5e9, marketCap: 67e9, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA', price: 0.45, change24h: 2.10, volume24h: 500e6, marketCap: 16e9, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2010.png' },
  { id: 'xrp', name: 'XRP', symbol: 'XRP', price: 0.52, change24h: -1.15, volume24h: 1.2e9, marketCap: 28e9, iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png' },
];

const MarketsPage = () => {
  console.log('MarketsPage loaded');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'gainers', 'losers'
  const [sortBy, setSortBy] = useState('marketCap'); // 'marketCap', 'price', 'change24h'
  const [cryptoData, setCryptoData] = useState<CryptoData[]>(initialCryptoData);

  const toggleFavorite = (id: string) => {
    setCryptoData(prevData =>
      prevData.map(coin =>
        coin.id === id ? { ...coin, isFavorite: !coin.isFavorite } : coin
      )
    );
  };

  const filteredAndSortedData = cryptoData
    .filter(coin => coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(coin => {
      if (filter === 'gainers') return coin.change24h > 0;
      if (filter === 'losers') return coin.change24h < 0;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'marketCap') return b.marketCap - a.marketCap;
      if (sortBy === 'price') return b.price - a.price;
      if (sortBy === 'change24h') return b.change24h - a.change24h;
      return 0;
    });

  const favoriteData = filteredAndSortedData.filter(coin => coin.isFavorite);

  const renderTableRows = (data: CryptoData[]) => (
    data.map(coin => (
      <TableRow key={coin.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => console.log(`Navigate to ${coin.symbol} details`)}>
        <TableCell>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); toggleFavorite(coin.id); }}>
            <Star className={`h-4 w-4 ${coin.isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
          </Button>
        </TableCell>
        <TableCell className="font-medium flex items-center">
            <img src={coin.iconUrl} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
            {coin.name} <span className="text-muted-foreground ml-1.5">{coin.symbol.toUpperCase()}</span>
        </TableCell>
        <TableCell>${coin.price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</TableCell>
        <TableCell className={coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
          {coin.change24h.toFixed(2)}%
        </TableCell>
        <TableCell>${coin.volume24h.toLocaleString()}</TableCell>
        <TableCell>${coin.marketCap.toLocaleString()}</TableCell>
        <TableCell className="text-right">
          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); console.log(`Trade ${coin.symbol}`); }}>Trade</Button>
        </TableCell>
      </TableRow>
    ))
  );


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <NavigationMenu />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold">Explore Crypto Markets</h1>
            <p className="text-muted-foreground">Discover and analyze cryptocurrencies in real-time.</p>
          </header>

          <div className="mb-6 p-4 bg-card rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <h3 className="text-sm text-muted-foreground">Global Market Cap</h3>
                    <p className="text-xl font-semibold">$2.17 Trillion</p>
                </div>
                <div>
                    <h3 className="text-sm text-muted-foreground">24h Volume</h3>
                    <p className="text-xl font-semibold">$78.5 Billion</p>
                </div>
                <div>
                    <h3 className="text-sm text-muted-foreground">BTC Dominance</h3>
                    <p className="text-xl font-semibold">51.3%</p>
                </div>
                <div>
                    <h3 className="text-sm text-muted-foreground">Active Cryptos</h3>
                    <p className="text-xl font-semibold">10,000+</p>
                </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search crypto (e.g., Bitcoin, BTC)"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="gainers">Top Gainers</SelectItem>
                  <SelectItem value="losers">Top Losers</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marketCap">Market Cap</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="change24h">24h Change</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="all_coins" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all_coins">All Coins</TabsTrigger>
              <TabsTrigger value="favorites">
                <Star className="h-4 w-4 mr-2 text-yellow-400" /> Favorites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all_coins">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead>24h Volume</TableHead>
                      <TableHead>Market Cap</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {renderTableRows(filteredAndSortedData)}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
            <TabsContent value="favorites">
              <Card>
                <Table>
                  <TableHeader>
                     <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>24h Change</TableHead>
                      <TableHead>24h Volume</TableHead>
                      <TableHead>Market Cap</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {favoriteData.length > 0 ? renderTableRows(favoriteData) : <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-10">No favorites yet. Click the star to add.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </ScrollArea>
    </div>
  );
};

export default MarketsPage;
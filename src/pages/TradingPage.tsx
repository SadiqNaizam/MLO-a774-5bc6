import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import TradingChartKit from '@/components/trading/TradingChartKit';
import OrderBookDepthChart from '@/components/trading/OrderBookDepthChart';
import AdvancedOrderFormModule from '@/components/trading/AdvancedOrderFormModule';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast as sonnerToast } from "sonner"; // Using sonner for notifications
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Info, ListChecks } from 'lucide-react';

// Mock Order type for AdvancedOrderFormModule
type OrderFormData = {
  orderType: 'limit' | 'market' | 'stop-limit';
  price?: number;
  quantity: number;
  total: number;
  amountPercentage?: number;
  postOnly?: boolean;
  triggerPrice?: number;
};

const TradingPage = () => {
  console.log('TradingPage loaded');
  const [currentSymbol, setCurrentSymbol] = useState('BTC/USDT');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{data: OrderFormData, side: 'buy'|'sell'} | null>(null);

  const mockOpenOrders = [
    { id: '1', symbol: 'BTC/USDT', type: 'Limit', side: 'Buy', price: 65000, amount: 0.1, filled: '0%', total: 6500, status: 'Open' },
    { id: '2', symbol: 'ETH/USDT', type: 'Market', side: 'Sell', price: 3400, amount: 2, filled: '100%', total: 6800, status: 'Filled'},
  ];
  
  const mockTradeHistory = [
     { id: '3', symbol: 'ADA/USDT', type: 'Limit', side: 'Buy', price: 0.45, amount: 1000, filled: '100%', total: 450, time: '2024-07-28 10:30:00'},
  ];

  const handleOrderSubmit = async (data: OrderFormData, side: 'buy' | 'sell'): Promise<void> => {
    console.log(`Attempting to submit ${side} order for ${currentSymbol}:`, data);
    setPendingOrder({ data, side });
    setIsConfirmDialogOpen(true);
    // This promise will be resolved or rejected by the dialog confirmation
    return new Promise((resolve, reject) => {
        (window as any).confirmOrderPromise = { resolve, reject };
    });
  };

  const confirmOrder = () => {
    if (pendingOrder) {
        console.log(`Confirmed ${pendingOrder.side} order:`, pendingOrder.data);
        sonnerToast.success(`Order Placed!`, {
            description: `${pendingOrder.side.toUpperCase()} ${pendingOrder.data.quantity} ${currentSymbol.split('/')[0]} at ${pendingOrder.data.price ? '$'+pendingOrder.data.price : 'Market'}`,
        });
        setIsConfirmDialogOpen(false);
        // In a real app, add to open orders list, call API, etc.
        if ((window as any).confirmOrderPromise) {
            (window as any).confirmOrderPromise.resolve();
        }
        setPendingOrder(null);
    }
  };

  const cancelOrderConfirmation = () => {
    setIsConfirmDialogOpen(false);
     if ((window as any).confirmOrderPromise) {
        (window as any).confirmOrderPromise.reject(new Error("Order cancelled by user."));
    }
    setPendingOrder(null);
  }

  return (
    <div className="flex flex-col h-screen bg-muted/40">
      <NavigationMenu />
      <div className="flex-grow overflow-hidden">
        <Tabs defaultValue="spot" className="h-full flex flex-col">
          <div className="border-b">
            <TabsList className="container mx-auto px-4">
              <TabsTrigger value="spot">Spot</TabsTrigger>
              <TabsTrigger value="futures" disabled>Futures (Soon)</TabsTrigger>
              <TabsTrigger value="options" disabled>Options (Soon)</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="spot" className="flex-grow overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
              {/* Left panel for asset selection or simplified order book can go here */}
              {/* <div className="lg:col-span-2 bg-card border-r p-2 overflow-y-auto">Asset List / Mini Order Book</div> */}

              {/* Main Chart Area */}
              <div className="lg:col-span-6 xl:col-span-7 bg-background flex flex-col p-1 md:p-2">
                <TradingChartKit symbol={currentSymbol} />
                <div className="mt-1 md:mt-2">
                    <OrderBookDepthChart symbol={currentSymbol} />
                </div>
              </div>

              {/* Order Form Area */}
              <div className="lg:col-span-6 xl:col-span-3 bg-card border-l p-2 md:p-4 overflow-y-auto">
                <ScrollArea className="h-full pr-2">
                    <h2 className="text-xl font-semibold mb-3">Trade {currentSymbol}</h2>
                    <AdvancedOrderFormModule
                    symbol={currentSymbol}
                    availableBalanceQuote={10000} // Placeholder
                    availableBalanceBase={0.5}    // Placeholder
                    onOrderSubmit={handleOrderSubmit}
                    />
                </ScrollArea>
              </div>
              
              {/* Right panel for live trades / detailed order book */}
              <div className="lg:col-span-3 xl:col-span-2 bg-card border-l p-2 overflow-y-auto hidden xl:block">
                <ScrollArea className="h-full pr-2">
                    <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-sm">Live Trades: {currentSymbol}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 text-xs">
                            {/* Placeholder for live trades */}
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                Live trades feed...
                            </div>
                        </CardContent>
                    </Card>
                </ScrollArea>
              </div>
            </div>
          </TabsContent>
          {/* Placeholder for Futures/Options content */}
        </Tabs>
      </div>
      
      {/* Order History / Positions below the main trading view */}
      <div className="border-t bg-card p-4 h-[250px] overflow-hidden">
        <Tabs defaultValue="openOrders" className="h-full flex flex-col">
            <TabsList>
                <TabsTrigger value="openOrders">Open Orders ({mockOpenOrders.filter(o => o.status === 'Open').length})</TabsTrigger>
                <TabsTrigger value="orderHistory">Order History</TabsTrigger>
                <TabsTrigger value="tradeHistory">Trade History</TabsTrigger>
                {/* <TabsTrigger value="positions">Positions</TabsTrigger> */}
            </TabsList>
            <ScrollArea className="flex-grow mt-2">
                <TabsContent value="openOrders">
                    <Table size="sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Symbol</TableHead><TableHead>Type</TableHead><TableHead>Side</TableHead>
                                <TableHead>Price</TableHead><TableHead>Amount</TableHead><TableHead>Filled</TableHead>
                                <TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockOpenOrders.map(o => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.symbol}</TableCell><TableCell>{o.type}</TableCell>
                                    <TableCell className={o.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{o.side}</TableCell>
                                    <TableCell>${o.price.toFixed(2)}</TableCell><TableCell>{o.amount}</TableCell>
                                    <TableCell>{o.filled}</TableCell><TableCell>${o.total.toFixed(2)}</TableCell>
                                    <TableCell><Badge variant={o.status === 'Open' ? 'secondary' : 'default'}>{o.status}</Badge></TableCell>
                                    <TableCell>{o.status === 'Open' && <Button variant="destructive" size="xs" onClick={() => console.log(`Cancel order ${o.id}`)}>Cancel</Button>}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
                 <TabsContent value="orderHistory">
                    <div className="text-center py-8 text-muted-foreground">Order history will appear here.</div>
                </TabsContent>
                <TabsContent value="tradeHistory">
                     <Table size="sm">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Time</TableHead><TableHead>Symbol</TableHead><TableHead>Type</TableHead>
                                <TableHead>Side</TableHead><TableHead>Price</TableHead><TableHead>Amount</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {mockTradeHistory.map(t => (
                                <TableRow key={t.id}>
                                    <TableCell>{t.time}</TableCell><TableCell>{t.symbol}</TableCell>
                                    <TableCell>{t.type}</TableCell>
                                    <TableCell className={t.side === 'Buy' ? 'text-green-500' : 'text-red-500'}>{t.side}</TableCell>
                                    <TableCell>${t.price.toFixed(2)}</TableCell><TableCell>{t.amount}</TableCell>
                                    <TableCell>${t.total.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TabsContent>
            </ScrollArea>
        </Tabs>
      </div>


      {pendingOrder && (
        <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                Please review your {pendingOrder.side} order for {currentSymbol}:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 my-4 text-sm">
              <p><strong>Pair:</strong> {currentSymbol}</p>
              <p><strong>Side:</strong> <span className={pendingOrder.side === 'buy' ? 'text-green-600' : 'text-red-600'}>{pendingOrder.side.toUpperCase()}</span></p>
              <p><strong>Type:</strong> {pendingOrder.data.orderType.toUpperCase()}</p>
              {pendingOrder.data.price && <p><strong>Price:</strong> ${pendingOrder.data.price.toLocaleString()}</p>}
              <p><strong>Quantity:</strong> {pendingOrder.data.quantity.toLocaleString()} {currentSymbol.split('/')[0]}</p>
              <p><strong>Total:</strong> ${pendingOrder.data.total.toLocaleString()} {currentSymbol.split('/')[1]}</p>
              {pendingOrder.data.triggerPrice && <p><strong>Trigger Price:</strong> ${pendingOrder.data.triggerPrice.toLocaleString()}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelOrderConfirmation}>Cancel</Button>
              <Button onClick={confirmOrder} className={pendingOrder.side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}>
                Confirm {pendingOrder.side.toUpperCase()}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TradingPage;
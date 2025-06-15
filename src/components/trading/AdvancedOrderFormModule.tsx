import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast'; // Assuming useToast is set up

const orderSchema = z.object({
  orderType: z.enum(['limit', 'market', 'stop-limit']),
  price: z.coerce.number().positive("Price must be positive").optional(), // Optional for market orders
  quantity: z.coerce.number().positive("Quantity must be positive"),
  total: z.coerce.number().positive("Total must be positive"),
  amountPercentage: z.number().min(0).max(100).optional(),
  postOnly: z.boolean().optional(), // For limit orders
  triggerPrice: z.coerce.number().positive("Trigger price must be positive").optional(), // For stop-limit
});

type OrderFormData = z.infer<typeof orderSchema>;

interface AdvancedOrderFormModuleProps {
  symbol: string; // e.g., BTC/USDT
  availableBalanceQuote: number; // e.g., 1000 USDT
  availableBalanceBase: number; // e.g., 0.5 BTC
  onOrderSubmit: (data: OrderFormData, side: 'buy' | 'sell') => Promise<void>;
}

const AdvancedOrderFormModule: React.FC<AdvancedOrderFormModuleProps> = ({
  symbol,
  availableBalanceQuote,
  availableBalanceBase,
  onOrderSubmit,
}) => {
  console.log("Rendering AdvancedOrderFormModule for:", symbol);
  const pair = symbol.split('/'); // [BTC, USDT]
  const baseCurrency = pair[0];
  const quoteCurrency = pair[1];

  const { control, register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderType: 'limit',
      postOnly: false,
    },
  });

  const orderType = watch('orderType');
  const price = watch('price');
  const quantity = watch('quantity');

  // Calculate total when price or quantity changes
  React.useEffect(() => {
    if (price && quantity && price > 0 && quantity > 0) {
      setValue('total', parseFloat((price * quantity).toFixed(8))); // Adjust precision as needed
    } else {
        setValue('total', 0);
    }
  }, [price, quantity, setValue]);

  const handleAmountSliderChange = (value: number[], side: 'buy' | 'sell') => {
    const percentage = value[0];
    setValue('amountPercentage', percentage);
    if (side === 'buy' && price && price > 0) {
        const newQuantity = (availableBalanceQuote * (percentage / 100)) / price;
        setValue('quantity', parseFloat(newQuantity.toFixed(8)));
    } else if (side === 'sell') {
        const newQuantity = availableBalanceBase * (percentage / 100);
        setValue('quantity', parseFloat(newQuantity.toFixed(8)));
    }
  };

  const onSubmit = async (data: OrderFormData, side: 'buy' | 'sell') => {
    console.log(`Submitting ${side} order:`, data);
    try {
      await onOrderSubmit(data, side);
      toast({ title: "Order Placed", description: `${side.toUpperCase()} order for ${data.quantity} ${baseCurrency} submitted successfully.` });
    } catch (error) {
      console.error("Order submission error:", error);
      toast({ variant: "destructive", title: "Order Failed", description: "Could not place your order. Please try again." });
    }
  };

  const renderFormFields = (side: 'buy' | 'sell') => (
    <form onSubmit={handleSubmit(data => onSubmit(data, side))} className="space-y-4">
      <Controller
        name="orderType"
        control={control}
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="grid grid-cols-3 gap-2 text-xs"
          >
            {['limit', 'market', 'stop-limit'].map(type => (
              <Label key={type} htmlFor={`${side}-${type}`} className="border rounded-md p-2 flex items-center justify-center cursor-pointer [&:has([data-state=checked])]:border-primary">
                <RadioGroupItem value={type} id={`${side}-${type}`} className="sr-only" />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Label>
            ))}
          </RadioGroup>
        )}
      />

      {orderType !== 'market' && (
        <div>
          <Label htmlFor={`${side}-price`}>Price ({quoteCurrency})</Label>
          <Input id={`${side}-price`} type="number" step="any" {...register('price')} placeholder="0.00" />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
      )}

      {orderType === 'stop-limit' && (
         <div>
          <Label htmlFor={`${side}-triggerPrice`}>Trigger Price ({quoteCurrency})</Label>
          <Input id={`${side}-triggerPrice`} type="number" step="any" {...register('triggerPrice')} placeholder="0.00" />
          {errors.triggerPrice && <p className="text-red-500 text-xs mt-1">{errors.triggerPrice.message}</p>}
        </div>
      )}

      <div>
        <Label htmlFor={`${side}-quantity`}>Amount ({baseCurrency})</Label>
        <Input id={`${side}-quantity`} type="number" step="any" {...register('quantity')} placeholder="0.00" />
        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
      </div>
      
      <Controller
        name="amountPercentage"
        control={control}
        render={({ field }) => (
            <Slider
                defaultValue={[0]}
                max={100}
                step={1}
                onValueChange={(val) => handleAmountSliderChange(val, side)}
                className="my-3"
            />
        )}
      />
      <div className="flex justify-between text-xs text-muted-foreground mb-2">
        <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
      </div>


      <div>
        <Label htmlFor={`${side}-total`}>Total ({quoteCurrency})</Label>
        <Input id={`${side}-total`} type="number" step="any" {...register('total')} placeholder="0.00" readOnly={orderType !== 'market'} />
         {errors.total && <p className="text-red-500 text-xs mt-1">{errors.total.message}</p>}
      </div>

      {orderType === 'limit' && (
        <div className="flex items-center space-x-2">
          <Controller
            name="postOnly"
            control={control}
            render={({ field }) => (
              <Checkbox id={`${side}-postOnly`} checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor={`${side}-postOnly`} className="text-sm font-normal">Post-Only</Label>
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Avbl: {side === 'buy' ? `${availableBalanceQuote.toFixed(4)} ${quoteCurrency}` : `${availableBalanceBase.toFixed(4)} ${baseCurrency}`}
      </p>

      <Button type="submit" className={`w-full ${side === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`} disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : `${side.toUpperCase()} ${baseCurrency}`}
      </Button>
    </form>
  );

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="sell">Sell</TabsTrigger>
      </TabsList>
      <TabsContent value="buy" className="pt-4">
        {renderFormFields('buy')}
      </TabsContent>
      <TabsContent value="sell" className="pt-4">
        {renderFormFields('sell')}
      </TabsContent>
    </Tabs>
  );
};

export default AdvancedOrderFormModule;
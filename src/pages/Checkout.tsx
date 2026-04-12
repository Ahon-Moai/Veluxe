import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function Checkout() {
  const { cart, total, shippingTotal, clearCart, updateSize } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  });

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString('en-BD')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Check if all items have a size selected
    const missingSize = cart.find(item => !item.size);
    if (missingSize) {
      toast.error(`Please select a size for ${missingSize.name}`);
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: 'N/A', // Email removed as requested
        customerAddress: `${formData.address}, ${formData.city}`,
        customerPhone: formData.phone,
        items: cart,
        totalAmount: total,
        shippingCost: shippingTotal,
        status: 'pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
      };

      try {
        const docRef = await addDoc(collection(db, 'orders'), orderData);
        setOrderId(docRef.id);
        setShowSuccess(true);
        clearCart();
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'orders');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = total - shippingTotal;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12">Checkout</h1>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-serif mb-6 border-b pb-2">Shipping Information</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-serif mb-6 border-b pb-2">Payment Method</h2>
            <div className="p-6 border border-luxury-gold bg-luxury-gold/5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full border-2 border-luxury-gold bg-luxury-gold" />
                <span className="font-medium">Cash on Delivery (COD)</span>
              </div>
              <span className="text-xs text-luxury-gold font-bold uppercase tracking-widest">Selected</span>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Pay with cash upon delivery. Our courier will contact you to confirm the delivery time.
            </p>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 border-2 border-luxury-gold/30 shadow-2xl sticky top-24 rounded-sm">
            <h2 className="text-2xl font-serif mb-6 pb-4 border-b border-luxury-gold/10">Your Order</h2>
            <div className="space-y-6 mb-8">
              {cart.map((item) => (
                <div key={item.productId} className="space-y-3 pb-4 border-b border-gray-50 last:border-0">
                  <div className="flex justify-between items-start text-sm">
                    <div className="flex flex-col">
                      <span className="text-luxury-black font-medium">{item.name}</span>
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-serif text-luxury-black">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label className="text-[10px] uppercase tracking-widest text-gray-400">Size:</Label>
                    <Select value={item.size} onValueChange={(value) => updateSize(item.productId, value)}>
                      <SelectTrigger className="w-24 h-8 text-xs rounded-none border-gray-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="S">Small (S)</SelectItem>
                        <SelectItem value="M">Medium (M)</SelectItem>
                        <SelectItem value="L">Large (L)</SelectItem>
                        <SelectItem value="XL">Extra Large (XL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2 pt-4">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex flex-col">
                    <span>Shipping</span>
                    <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">৳120 per item</span>
                  </div>
                  <span>{formatPrice(shippingTotal)}</span>
                </div>
                <div className="border-t border-luxury-gold/10 pt-6 flex justify-between items-center">
                  <span className="text-lg font-serif">Total Amount</span>
                  <span className="text-2xl font-serif text-luxury-black">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading || cart.length === 0}
              className="w-full bg-luxury-black text-white py-8 rounded-none text-sm tracking-[0.2em] font-medium hover:bg-luxury-black/90 transition-all shadow-lg"
            >
              {loading ? 'PROCESSING...' : 'PLACE ORDER'}
            </Button>
            <div className="mt-8 p-4 bg-white/50 border border-luxury-gold/10 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                By placing an order, you agree to our <span className="text-luxury-gold underline cursor-pointer">Terms of Service</span>
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md text-center py-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-3xl font-serif mb-2">Order Confirmed</DialogTitle>
            <DialogDescription className="text-gray-500 font-light">
              Thank you for your purchase. Your order has been placed successfully and is being processed.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-luxury-cream/30 p-6 my-8 border border-luxury-gold/10">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Order Reference</p>
            <p className="font-mono text-luxury-black font-bold">{orderId}</p>
          </div>
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-luxury-black text-white py-6 rounded-none group"
            >
              CONTINUE SHOPPING
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link to="/" className="block text-xs uppercase tracking-widest text-luxury-gold font-bold hover:underline">
              View Order Status
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

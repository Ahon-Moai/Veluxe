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

  const subtotal = total - shippingTotal;  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-5xl md:text-6xl font-serif">Checkout</h1>
        <Link to="/cart" className="text-sm tracking-[0.2em] text-gray-400 hover:text-luxury-gold transition-colors flex items-center group">
          <ArrowRight className="w-4 h-4 mr-2 rotate-180 transition-transform group-hover:-translate-x-1" />
          RETURN TO CART
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-12">
          <section className="bg-white p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-xs font-bold">1</div>
              <h2 className="text-2xl font-serif">Shipping Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200 h-14 focus-visible:ring-luxury-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="+880 1XXX XXXXXX"
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200 h-14 focus-visible:ring-luxury-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">City</Label>
                <Input 
                  id="city" 
                  placeholder="Dhaka"
                  value={formData.city} 
                  onChange={e => setFormData({...formData, city: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200 h-14 focus-visible:ring-luxury-gold"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Street Address</Label>
                <Input 
                  id="address" 
                  placeholder="House #, Road #, Area"
                  value={formData.address} 
                  onChange={e => setFormData({...formData, address: e.target.value})} 
                  required 
                  className="rounded-none border-gray-200 h-14 focus-visible:ring-luxury-gold"
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 border border-gray-100 shadow-sm">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-8 h-8 rounded-full bg-luxury-black text-white flex items-center justify-center text-xs font-bold">2</div>
              <h2 className="text-2xl font-serif">Payment Method</h2>
            </div>
            <div className="p-6 border-2 border-luxury-gold bg-luxury-gold/5 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 rounded-full border-2 border-luxury-gold flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-luxury-gold" />
                </div>
                <div>
                  <span className="font-serif text-lg block">Cash on Delivery (COD)</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Pay when you receive your order</span>
                </div>
              </div>
              <CheckCircle2 className="text-luxury-gold w-6 h-6" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-luxury-black text-white p-10 sticky top-32 shadow-2xl">
            <h2 className="text-3xl font-serif mb-10 pb-6 border-b border-white/10">Order Summary</h2>
            <div className="space-y-8 mb-10 max-h-[40vh] overflow-y-auto pr-4 custom-scrollbar">
              {cart.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex space-x-6 pb-6 border-b border-white/5 last:border-0">
                  <div className="w-20 h-24 bg-white/10 flex-shrink-0 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-serif italic tracking-wide">{item.name}</h3>
                      <span className="text-sm font-light">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest">Qty: {item.quantity}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest">Size:</span>
                        <Select value={item.size} onValueChange={(value) => updateSize(item.productId, item.size, value)}>
                          <SelectTrigger className="w-20 h-7 text-[10px] rounded-none border-white/10 bg-transparent text-white focus:ring-luxury-gold">
                            <SelectValue placeholder="Size" />
                          </SelectTrigger>
                          <SelectContent className="bg-luxury-black border-white/10 text-white">
                            <SelectItem value="S">S</SelectItem>
                            <SelectItem value="M">M</SelectItem>
                            <SelectItem value="L">L</SelectItem>
                            <SelectItem value="XL">XL</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm text-white/60">
                <span className="font-light tracking-wide">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/60">
                <div className="flex flex-col">
                  <span className="font-light tracking-wide">Shipping</span>
                  <span className="text-[9px] text-luxury-gold font-bold uppercase tracking-[0.2em]">৳120 per item</span>
                </div>
                <span>{formatPrice(shippingTotal)}</span>
              </div>
              <div className="pt-8 flex justify-between items-center border-t border-white/10 mt-6">
                <span className="text-xl font-serif">Total</span>
                <span className="text-3xl font-serif text-luxury-gold">{formatPrice(total)}</span>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || cart.length === 0}
              className="w-full bg-luxury-gold text-white py-10 mt-12 rounded-none text-xs tracking-[0.4em] font-bold hover:bg-white hover:text-luxury-black transition-all duration-500 shadow-2xl"
            >
              {loading ? 'PROCESSING ORDER...' : 'PLACE ORDER NOW'}
            </Button>
            
            <p className="text-[9px] text-center mt-8 text-white/30 uppercase tracking-[0.3em] leading-relaxed">
              Secure encrypted checkout • Free luxury packaging • 24/7 Support
            </p>
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

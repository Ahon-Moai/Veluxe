import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/errorHandlers';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

    setLoading(true);
    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerAddress: `${formData.address}, ${formData.city}`,
        customerPhone: formData.phone,
        items: cart,
        totalAmount: total,
        status: 'pending',
        paymentMethod: 'COD',
        createdAt: new Date().toISOString(),
      };

      try {
        await addDoc(collection(db, 'orders'), orderData);
        
        toast.success('Order placed successfully!');
        clearCart();
        navigate('/');
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
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})} 
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
                <div key={item.productId} className="flex justify-between items-start text-sm">
                  <div className="flex flex-col">
                    <span className="text-luxury-black font-medium">{item.name}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-widest">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-serif text-luxury-black">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-luxury-gold/10 pt-6 flex justify-between items-center">
                <span className="text-lg font-serif">Total Amount</span>
                <span className="text-2xl font-serif text-luxury-black">{formatPrice(total)}</span>
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
    </div>
  );
}

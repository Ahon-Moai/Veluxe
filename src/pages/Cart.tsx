import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, total, shippingTotal } = useCart();
  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString('en-BD')}`;
  };

  const subtotal = total - shippingTotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-serif mb-6">Your Cart is Empty</h1>
        <p className="text-gray-500 mb-8">Discover our latest collections and find something special.</p>
        <Link to="/">
          <Button className="bg-luxury-black text-white px-8 py-6 rounded-none">
            CONTINUE SHOPPING
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-serif mb-12">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          {cart.map((item) => (
            <div key={item.productId} className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8 py-8 border-b border-gray-100 last:border-0">
              <div className="w-32 h-40 bg-luxury-cream flex-shrink-0 border border-gray-50 shadow-sm overflow-hidden">
                <img 
                  src={item.productId.startsWith('data:') ? item.productId : `https://picsum.photos/seed/${item.productId}/300/400`} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-serif mb-1">{item.name}</h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Signature Collection</p>
                    {item.size && (
                      <p className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold">Size: {item.size}</p>
                    )}
                  </div>
                  <p className="text-xl font-serif text-luxury-black">{formatPrice(item.price)}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
                  <div className="flex items-center border border-gray-200 bg-white">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-12 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-3 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="flex items-center space-x-2 text-red-400 hover:text-red-600 transition-colors text-xs uppercase tracking-widest font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-luxury-cream/30 p-8 border border-luxury-gold/20 shadow-sm sticky top-24">
            <h2 className="text-2xl font-serif mb-6 pb-4 border-b border-luxury-gold/10">Order Summary</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span className="font-light tracking-wide">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <div className="flex flex-col">
                  <span className="font-light tracking-wide">Shipping</span>
                  <span className="text-[10px] text-luxury-gold font-bold uppercase tracking-widest">৳120 per item</span>
                </div>
                <span className="font-medium">{formatPrice(shippingTotal)}</span>
              </div>
              <div className="border-t border-luxury-gold/10 pt-4 flex justify-between text-xl font-serif">
                <span>Total</span>
                <span className="text-luxury-black">{formatPrice(total)}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full bg-luxury-black text-white py-8 rounded-none group text-sm tracking-[0.2em] font-medium hover:bg-luxury-black/90 transition-all shadow-lg">
                PROCEED TO CHECKOUT
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest text-gray-400">
                <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-3 text-[10px] uppercase tracking-widest text-gray-400">
                <div className="w-1 h-1 bg-luxury-gold rounded-full"></div>
                <span>Luxury Packaging Included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

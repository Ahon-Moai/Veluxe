import { useCart } from '../hooks/useCart';
import { Button } from '../components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();

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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map((item) => (
            <div key={item.productId} className="flex items-center space-x-6 py-6 border-b border-gray-100">
              <div className="w-24 h-32 bg-luxury-cream flex-shrink-0">
                <img 
                  src={`https://picsum.photos/seed/${item.productId}/200/300`} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-serif mb-1">{item.name}</h3>
                <p className="text-luxury-gold font-medium mb-4">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-200">
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-gray-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-8 border border-gray-100 h-fit">
          <h2 className="text-2xl font-serif mb-6">Order Summary</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-medium">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout">
            <Button className="w-full bg-luxury-black text-white py-6 rounded-none group">
              PROCEED TO CHECKOUT
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <p className="text-xs text-gray-400 mt-6 text-center">
            Complimentary shipping on all orders over $500.
          </p>
        </div>
      </div>
    </div>
  );
}

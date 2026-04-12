import React, { useState, useEffect, createContext, useContext } from 'react';
import { Product, OrderItem } from '../types';

interface CartContextType {
  cart: OrderItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateSize: (productId: string, size: string) => void;
  clearCart: () => void;
  total: number;
  shippingTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const SHIPPING_PER_ITEM = 120;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem('veluxe_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('veluxe_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id && item.size === size);
      if (existing) {
        return prev.map(item => 
          (item.productId === product.id && item.size === size) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { productId: product.id!, name: product.name, price: product.price, quantity: 1, size }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, quantity } : item
    ));
  };

  const updateSize = (productId: string, size: string) => {
    setCart(prev => prev.map(item => 
      item.productId === productId ? { ...item, size } : item
    ));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingTotal = cart.reduce((sum, item) => sum + (SHIPPING_PER_ITEM * item.quantity), 0);
  const total = subtotal + shippingTotal;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, updateSize, clearCart, total, shippingTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}

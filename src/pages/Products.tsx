import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setFilteredProducts(prods);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const handleBuyNow = (product: Product) => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const formatPrice = (price: number) => {
    return `৳${price.toLocaleString('en-BD')}`;
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-8 md:space-y-0">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl font-serif mb-6">The Collection</h1>
            <p className="text-gray-400 font-light tracking-wide leading-relaxed">
              Browse our complete range of luxury essentials, from precision timepieces to artisanal fragrances.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-luxury-gold transition-colors" />
              <Input 
                placeholder="Search collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-6 border-gray-100 rounded-none focus-visible:ring-luxury-gold w-full sm:w-80 bg-gray-50/50"
              />
            </div>
            <Button variant="outline" className="border-gray-100 rounded-none py-6 px-6 hover:bg-luxury-black hover:text-white transition-all duration-300">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="animate-pulse flex flex-col">
                <div className="aspect-[4/5] bg-gray-50 mb-8" />
                <div className="h-4 bg-gray-50 w-3/4 mx-auto mb-3" />
                <div className="h-4 bg-gray-50 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
            {filteredProducts.map((product, index) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: (index % 4) * 0.1 }}
                className="group flex flex-col"
              >
                <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden bg-[#f9f9f9]">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  {product.stock === 0 && (
                    <div className="absolute top-6 left-6 bg-white px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase font-semibold border border-gray-100 shadow-sm z-10">
                      Sold Out
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-center text-center space-y-3">
                  <h3 className="text-base font-serif italic tracking-wide text-luxury-black group-hover:text-luxury-gold transition-colors duration-300">{product.name}</h3>
                  <p className="text-sm font-light tracking-[0.15em] text-gray-500">{formatPrice(product.price)}</p>
                  
                  <div className="grid grid-cols-2 gap-3 w-full pt-6 transition-all duration-500">
                    <Button 
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock === 0}
                      className="bg-luxury-black text-white hover:bg-luxury-gold rounded-none h-11 text-[9px] tracking-[0.25em] font-medium transition-colors duration-300"
                    >
                      BUY NOW
                    </Button>
                    <Button 
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      variant="outline"
                      className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white rounded-none h-11 text-[9px] tracking-[0.25em] font-medium transition-colors duration-300"
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="text-gray-400 font-light italic">No products found matching your search.</p>
            <Button 
              variant="link" 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-luxury-gold"
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

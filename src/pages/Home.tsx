import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';

const categories = [
  { name: 'Timepieces', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(4));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(prods);
    });
    return () => unsubscribe();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden bg-luxury-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-serif text-white mb-6 leading-tight">
              Redefining <br />
              <span className="italic text-luxury-gold">Elegance</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 font-light tracking-wide max-w-lg">
              Discover our curated collection of premium essentials designed for those who appreciate the finer things in life.
            </p>
            <div className="flex space-x-4">
              <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white px-8 py-6 text-lg rounded-none transition-all duration-300">
                SHOP NOW
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-luxury-black px-8 py-6 text-lg rounded-none transition-all duration-300">
                VIEW LOOKBOOK
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-2">Shop by Category</h2>
              <p className="text-gray-500 font-light">Explore our diverse range of luxury goods</p>
            </div>
            <Link to="/" className="text-luxury-gold flex items-center hover:underline">
              View All <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[500px] overflow-hidden cursor-pointer"
              >
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-8 left-8">
                  <h3 className="text-3xl font-serif text-white mb-2">{cat.name}</h3>
                  <p className="text-white/80 font-light tracking-widest text-xs uppercase">Explore Collection</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4">The Signature Collection</h2>
            <div className="w-24 h-1 bg-luxury-gold mx-auto"></div>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden bg-luxury-cream border border-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-white text-luxury-black hover:bg-luxury-black hover:text-white rounded-none py-6 font-medium tracking-widest transition-all duration-300 shadow-xl"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        ADD TO CART
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">{product.category || 'Collection'}</p>
                    <h3 className="text-lg font-serif mb-2 group-hover:text-luxury-gold transition-colors duration-300">{product.name}</h3>
                    <p className="text-luxury-black font-medium tracking-wider">${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-gray-400 font-light text-center">
              No products available in the signature collection yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

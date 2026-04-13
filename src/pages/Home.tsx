import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '../components/ui/button';
import { ArrowRight, ShoppingCart, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { toast } from 'sonner';
import { SafeImage } from '../components/SafeImage';
import { ProductGridSkeleton } from '../components/ProductSkeleton';

const categories = [
  { name: 'Timepieces', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800' },
];

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const heroRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(12));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setFeaturedProducts(prods);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching featured products:', error);
      setLoading(false);
      toast.error('Failed to load featured products.');
    });
    return () => unsubscribe();
  }, []);

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden bg-luxury-black">
        <motion.div 
          style={{ y, opacity: 0.6 }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-luxury-black z-[1]" />

        {/* Vertical Text Accent */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="[writing-mode:vertical-rl] rotate-180 text-[10px] tracking-[0.5em] uppercase text-white/30 font-medium"
          >
            Curated Excellence • Timeless Design • Luxury Living
          </motion.div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div style={{ opacity }} className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-luxury-gold tracking-[0.4em] text-xs uppercase font-medium mb-6 block">
                ESTABLISHED 2024
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-7xl md:text-[10rem] font-serif text-white mb-10 leading-[0.8] tracking-tighter"
            >
              Ethereal <br />
              <span className="italic text-luxury-gold">Comfort</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl text-gray-300 mb-12 font-light tracking-wide max-w-lg leading-relaxed"
            >
              Experience the lightness of being with our meticulously crafted collection of ethereal essentials.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <Button className="bg-luxury-gold hover:bg-luxury-gold/90 text-white px-12 py-8 text-xs tracking-[0.3em] rounded-none transition-all duration-500 group">
                EXPLORE COLLECTION
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" className="text-white border-white/20 hover:border-white hover:bg-white hover:text-luxury-black px-12 py-8 text-xs tracking-[0.3em] rounded-none transition-all duration-500">
                OUR STORY
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="text-luxury-gold w-6 h-6" />
            </motion.div>
            <span className="text-[9px] text-white/30 tracking-[0.4em] uppercase">Scroll</span>
          </div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-luxury-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-serif mb-2">Shop by Category</h2>
              <p className="text-gray-500 font-light">Explore our diverse range of luxury goods</p>
            </div>
            <Link to="/products" className="text-luxury-gold flex items-center hover:underline group">
              View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-[500px] overflow-hidden cursor-pointer"
              >
                <SafeImage 
                  src={cat.image} 
                  alt={cat.name} 
                  fallbackSeed={cat.name}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-7xl font-serif mb-6">The Signature Collection</h2>
              <div className="w-24 h-[1px] bg-luxury-gold mx-auto mb-6"></div>
              <p className="text-gray-400 font-light tracking-widest text-xs uppercase">Handpicked for the Discerning</p>
            </motion.div>
          </div>
          
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
              {featuredProducts.map((product, index) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.8, delay: (index % 4) * 0.15, ease: [0.215, 0.61, 0.355, 1] }}
                  className="group flex flex-col"
                >
                  <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden bg-[#f9f9f9]">
                    <SafeImage 
                      src={product.image.includes('unsplash.com') && !product.image.includes('w=') 
                        ? `${product.image}&w=800&q=80` 
                        : product.image} 
                      alt={product.name} 
                      fallbackSeed={product.id}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                      loading={index < 4 ? "eager" : "lazy"}
                      decoding={index < 4 ? "sync" : "async"}
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-6 left-6 bg-white px-4 py-1.5 text-[9px] tracking-[0.2em] uppercase font-semibold border border-gray-100 shadow-sm z-10">
                        Sold Out
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
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
            <div className="py-20 text-center">
              <p className="text-gray-400 font-light italic">Our new collection is arriving soon.</p>
            </div>
          )}

          {featuredProducts.length >= 12 && (
            <div className="mt-24 text-center">
              <Link to="/products">
                <Button 
                  variant="outline" 
                  className="border-luxury-black text-luxury-black hover:bg-luxury-black hover:text-white px-12 py-8 text-xs tracking-[0.3em] rounded-none transition-all duration-500"
                >
                  VIEW ALL PRODUCTS
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

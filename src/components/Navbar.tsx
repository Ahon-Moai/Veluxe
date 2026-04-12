import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-luxury-cream/80 backdrop-blur-md border-b border-luxury-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter text-luxury-black">
              VELUXE
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-luxury-gold transition-colors">COLLECTIONS</Link>
            <Link to="/" className="text-sm font-medium hover:text-luxury-gold transition-colors">NEW ARRIVALS</Link>
            <Link to="/" className="text-sm font-medium hover:text-luxury-gold transition-colors">ABOUT</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-luxury-gold">
              <Search className="w-5 h-5" />
            </Button>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="hover:text-luxury-gold relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-luxury-gold text-white text-[10px] flex items-center justify-center rounded-full">0</span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="ghost" size="icon" className="hover:text-luxury-gold">
                <User className="w-5 h-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="md:hidden hover:text-luxury-gold">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

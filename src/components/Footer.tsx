import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-luxury-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <h3 className="text-2xl font-serif tracking-widest">CLOUDS</h3>
          <p className="text-gray-400 text-sm font-light leading-relaxed">
            Elevating everyday essentials into extraordinary experiences. Clouds represents the pinnacle of craftsmanship and ethereal elegance.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-luxury-gold transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-luxury-gold transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-luxury-gold transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-8 text-luxury-gold">Collections</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><Link to="/" className="hover:text-white transition-colors">New Arrivals</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Signature Series</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Limited Edition</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-8 text-luxury-gold">Customer Care</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li><Link to="/" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Size Guide</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-8 text-luxury-gold">Boutique</h4>
          <ul className="space-y-4 text-sm text-gray-400 font-light">
            <li className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-luxury-gold mt-1 shrink-0" />
              <span>123 Ethereal Way, Banani, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-luxury-gold shrink-0" />
              <span>+880 1987 654321</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-luxury-gold shrink-0" />
              <span>hello@clouds.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] uppercase tracking-[0.2em] text-gray-500">
        <p>© 2026 CLOUDS ETHEREAL RETAIL. ALL RIGHTS RESERVED.</p>
        <div className="flex space-x-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}

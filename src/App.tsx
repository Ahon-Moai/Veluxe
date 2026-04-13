import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from './components/ui/sonner';
import { ScrollToTop } from './components/ScrollToTop';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

const Admin = lazy(() => import('./pages/Admin'));

const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center bg-luxury-cream">
    <div className="w-12 h-12 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Configure NProgress
NProgress.configure({ showSpinner: false, speed: 500, minimum: 0.3 });

function RouteWatcher() {
  const { pathname } = useLocation();

  useEffect(() => {
    NProgress.start();
    const timer = setTimeout(() => {
      NProgress.done();
    }, 100);
    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <RouteWatcher />
      <div className="min-h-screen bg-luxury-cream flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin/*" element={<Admin />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

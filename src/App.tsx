import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProductProvider } from './context/ProductContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Footer from './components/Footer.tsx';
import MarketPricing from './components/MarketPricing.tsx';
import TrustPillars from './components/TrustPillars.tsx';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Marketplace from './pages/Marketplace.tsx';
import Cart from './pages/Cart.tsx';
import SellerDashboard from './pages/SellerDashboard.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import LearningHub from './pages/LearningHub.tsx';
import ContactUs from './pages/ContactUs.tsx';
import AboutUs from './pages/AboutUs.tsx';
import LiveMarketRates from './pages/LiveMarketRates.tsx';
import MyOrders from './pages/MyOrders.tsx';
import BackgroundTitan from './components/BackgroundTitan.tsx';
import VitalityParticles from './components/VitalityParticles.tsx';
import './index.css';

import { useProducts } from './context/ProductContext.tsx';
import ProductCard from './components/ProductCard.tsx';

import TrustNotice from './components/TrustNotice.tsx';

const Home = () => {
  const { products } = useProducts();
  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];

  return (
    <div className="home-page">
      <Hero />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <TrustNotice />
      </div>
      <MarketPricing />
      <TrustPillars />
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ color: 'var(--color-primary)', fontSize: '2rem', fontWeight: '800' }}>Featured Products</h2>
          <a href="/marketplace" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>View All →</a>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2.5rem'
        }}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p>Loading market data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <Router>
              <div className="app">
                <BackgroundTitan />
                <VitalityParticles />
                <Navbar />
                <main className="container">
                  <AnimatePresence mode="wait">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/seller-dashboard" element={<SellerDashboard />} />
                      <Route path="/admin-dashboard" element={<AdminDashboard />} />
                      <Route path="/learning-hub" element={<LearningHub />} />
                      <Route path="/contact-us" element={<ContactUs />} />
                      <Route path="/about-us" element={<AboutUs />} />
                      <Route path="/live-rates" element={<LiveMarketRates />} />
                      <Route path="/my-orders" element={<MyOrders />} />
                    </Routes>
                  </AnimatePresence>
                </main>
                <Footer />
              </div>
            </Router>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

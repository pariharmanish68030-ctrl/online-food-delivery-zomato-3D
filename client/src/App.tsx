import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { CartProvider } from './context/CartContext';
import { HeroSection } from './components/HeroSection';
import { MarqueeSection } from './components/MarqueeSection';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { MenuSection } from './components/MenuSection';
import { CartDrawer } from './components/CartDrawer';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AIAssistantWidget } from './components/AIAssistantWidget';
import { GoogleMapModal } from './components/GoogleMapModal';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <main className="w-full bg-[#0C0C0C] min-h-screen text-[#D7E2EA] overflow-x-clip selection:bg-[#E23744] selection:text-white">
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <ServicesSection />
            <ProjectsSection />
            <MenuSection />
            <Footer />

            {/* Global Overlays & Modals */}
            <CartDrawer />
            <OrderTrackingModal />
            <CustomerAuthModal />
            <AdminAuthModal />
            <AdminDashboard />
            <AIAssistantWidget />
            <GoogleMapModal />
          </main>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;

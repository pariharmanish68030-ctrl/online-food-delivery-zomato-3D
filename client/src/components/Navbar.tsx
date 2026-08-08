import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { MapPin, ShoppingBag, User as UserIcon, ShieldAlert, LogOut, ChevronDown, Compass, Clock, Bike } from 'lucide-react';
import { FadeIn } from './FadeIn';

export const Navbar: React.FC = () => {
  const { user, logout, setIsCustomerAuthOpen, setIsAdminAuthOpen, setIsAdminDashboardOpen } = useAuth();
  const { locations, selectedLocation, setSelectedLocation, setIsMapModalOpen, fullAddressDetails } = useLocation();
  const { totalItems, setIsCartOpen, activeOrder, setActiveOrder } = useCart();

  return (
    <FadeIn delay={0} y={-20} className="w-full z-30 relative">
      <nav className="flex flex-wrap items-center justify-between w-full px-6 md:px-10 pt-6 md:pt-8 gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <span className="hero-heading font-black text-3xl md:text-4xl tracking-tighter uppercase">
              ZOMATO<span className="text-xs text-white bg-[#E23744] px-2 py-0.5 rounded-full ml-1 align-top tracking-widest font-semibold">3D</span>
            </span>
          </a>

          {/* Location Selector Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-[#18181A] hover:bg-[#252528] text-xs sm:text-sm px-3 py-1.5 rounded-full border border-[#D7E2EA]/15 text-[#D7E2EA] transition-colors cursor-pointer">
              <MapPin className="w-3.5 h-3.5 text-[#E23744]" />
              <span className="font-medium max-w-[110px] sm:max-w-[150px] truncate">
                {fullAddressDetails ? fullAddressDetails.placeName : (selectedLocation ? selectedLocation.cityName : 'Select Location')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute left-0 top-full mt-2 w-64 bg-[#18181A] border border-[#D7E2EA]/20 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 mb-1">
                <span className="text-[10px] uppercase font-bold text-[#D7E2EA]/50 tracking-wider">
                  Location Services
                </span>
                <button
                  onClick={() => setIsMapModalOpen(true)}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#E23744] hover:underline cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Map</span>
                </button>
              </div>

              {locations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left px-3 py-2 text-xs rounded-xl flex justify-between items-center transition-colors cursor-pointer ${
                    selectedLocation?.id === loc.id
                      ? 'bg-[#E23744] text-white font-medium'
                      : 'hover:bg-[#252528] text-[#D7E2EA]'
                  }`}
                >
                  <span>{loc.cityName}</span>
                  <span className="text-[10px] opacity-70">₹{loc.deliveryFee}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <div className="hidden lg:flex items-center gap-8 text-[#D7E2EA] font-medium uppercase tracking-wider text-sm">
          <a href="#about" className="hover:text-[#E23744] transition-colors">About</a>
          <a href="#services" className="hover:text-[#E23744] transition-colors">Services</a>
          <a href="#featured" className="hover:text-[#E23744] transition-colors">Featured</a>
          <a href="#menu" className="hover:text-[#E23744] transition-colors">Menu</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Google Maps Picker Trigger Button */}
          <button
            onClick={() => setIsMapModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 bg-[#18181A] hover:bg-[#E23744]/20 border border-[#E23744]/40 px-3 py-1.5 rounded-full text-xs font-semibold text-[#E23744] transition-all cursor-pointer shadow-md"
            title="Search Places & Pick Address on Google Maps"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Map</span>
          </button>

          {/* Cart Counter Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center p-2.5 rounded-full bg-[#18181A] hover:bg-[#E23744]/20 border border-[#D7E2EA]/15 text-[#D7E2EA] transition-all cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5 text-[#E23744]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E23744] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Auth Condition */}
          {user ? (
            <div className="flex items-center gap-2">
              {user.role === 'admin' ? (
                <button
                  onClick={() => setIsAdminDashboardOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#900C1D] text-white text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-[#E23744] transition-colors cursor-pointer shadow-lg shadow-[#900C1D]/40"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Panel</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-[#18181A] px-3 py-1.5 rounded-full border border-[#D7E2EA]/15 text-xs">
                  <UserIcon className="w-4 h-4 text-[#E23744]" />
                  <span className="font-medium text-[#D7E2EA]">{user.name.split(' ')[0]}</span>
                </div>
              )}

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 bg-[#18181A] hover:bg-red-900/40 text-red-400 rounded-full transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCustomerAuthOpen(true)}
                className="px-4 py-2 bg-[#18181A] hover:bg-[#252528] text-[#D7E2EA] text-xs font-medium uppercase tracking-wider rounded-full border border-[#D7E2EA]/15 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setIsAdminAuthOpen(true)}
                className="px-3.5 py-2 bg-[#900C1D]/60 hover:bg-[#900C1D] text-white text-xs font-medium uppercase tracking-wider rounded-full border border-[#E23744]/40 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Live Floating Active Order Ticker Banner */}
      {activeOrder && (
        <div className="w-full max-w-7xl mx-auto px-6 md:px-10 mt-3">
          <div className="bg-gradient-to-r from-[#900C1D] via-[#E23744] to-[#900C1D] p-2.5 px-5 rounded-2xl shadow-xl flex items-center justify-between gap-4 border border-[#E23744]/60 animate-pulse">
            <div className="flex items-center gap-2.5 text-xs text-white font-bold uppercase tracking-wider">
              <Bike className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Order #{activeOrder.id} is {activeOrder.orderStatus}!</span>
              <span className="hidden sm:inline-block text-[10px] text-white/80 font-normal">
                ({activeOrder.items?.length || 1} items • ₹{activeOrder.totalAmount})
              </span>
            </div>

            <button
              onClick={() => setActiveOrder(activeOrder)}
              className="px-3.5 py-1 bg-white text-[#E23744] hover:bg-amber-100 font-bold text-xs uppercase rounded-full tracking-wider transition-all cursor-pointer shadow-md flex items-center gap-1"
            >
              <Clock className="w-3.5 h-3.5 text-[#E23744]" />
              <span>Track Live Map 📍</span>
            </button>
          </div>
        </div>
      )}
    </FadeIn>
  );
};

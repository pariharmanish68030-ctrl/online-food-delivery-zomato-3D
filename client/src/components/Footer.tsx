import React from 'react';
import { FadeIn } from './FadeIn';
import { ContactButton } from './ContactButton';
import { Mail, Instagram, Twitter, Dribbble, Github, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="w-full bg-[#0C0C0C] text-[#D7E2EA] pt-20 pb-12 px-6 md:px-10 border-t border-[#D7E2EA]/10 relative z-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center gap-12">
        <FadeIn delay={0} y={30} className="w-full flex flex-col items-center gap-6">
          <span className="text-[#E23744] uppercase font-light text-sm tracking-widest">
            Hungry for 3D Gourmet?
          </span>
          <h2 className="hero-heading font-black uppercase text-4xl sm:text-6xl md:text-7xl tracking-tight">
            Order From Zomato 3D
          </h2>
          <p className="max-w-xl text-[#D7E2EA]/80 font-light text-base sm:text-lg leading-relaxed">
            Experience ultra-fast 25-minute zone delivery, live order tracking, and hand-crafted culinary specials delivered fresh to your door.
          </p>
          <ContactButton label="Explore Food Menu" onClick={scrollToMenu} />
        </FadeIn>

        {/* Operational Cities Row */}
        <div className="w-full py-6 border-y border-[#D7E2EA]/10 flex flex-wrap items-center justify-center gap-6 text-xs text-[#D7E2EA]/60 uppercase tracking-wider">
          <span className="text-white font-bold flex items-center gap-1">
            <MapPin className="w-4 h-4 text-[#E23744]" /> Active Delivery Cities:
          </span>
          <span>Indiranagar (Bangalore)</span>
          <span>•</span>
          <span>Connaught Place (Delhi)</span>
          <span>•</span>
          <span>Bandra West (Mumbai)</span>
          <span>•</span>
          <span>HSR Layout (Bangalore)</span>
        </div>

        {/* Social Links & Info */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 text-sm text-[#D7E2EA]/60 font-light uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#E23744]" />
            <span>support@zomato3d.com</span>
          </div>

          <div className="flex items-center gap-6 text-[#D7E2EA]">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-[#E23744] transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#E23744] transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://dribbble.com" target="_blank" rel="noreferrer" className="hover:text-[#E23744] transition-colors">
              <Dribbble className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#E23744] transition-colors">
              <Github className="w-5 h-5" />
            </a>
          </div>

          <div>
            &copy; {new Date().getFullYear()} Zomato 3D MERN. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

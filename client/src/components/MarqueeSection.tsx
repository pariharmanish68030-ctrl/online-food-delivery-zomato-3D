import React, { useState } from 'react';
import { FadeIn } from './FadeIn';
import { Sparkles, ArrowUpRight, Star, Clock, ChefHat } from 'lucide-react';

interface Poster {
  id: string;
  badge: string;
  badgeBg: string;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
  rating: number;
  prepTime: string;
  price: string;
  category: string;
}

const posters: Poster[] = [
  {
    id: 'poster-1',
    badge: '★ 3D Gourmet Special',
    badgeBg: 'from-rose-600 to-[#E23744]',
    title: 'ROYAL KUMAONI & NORTH INDIAN FEAST',
    subtitle: 'Authentic Spiced Curries & Handcrafted Naan',
    tagline: 'Freshly tempered with pure ghee, jakhiya & Pahadi spices',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    prepTime: '20 mins',
    price: 'Starting at ₹170',
    category: 'Regional Specialty',
  },
  {
    id: 'poster-2',
    badge: '🔥 Bestseller Poster',
    badgeBg: 'from-amber-600 to-orange-600',
    title: 'TRUFFLE & MUSHROOM ARTISAN PIZZA',
    subtitle: '72-Hour Sourdough Fermentation',
    tagline: 'Hand-stretched crust topped with wild mushrooms & black truffle oil',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    prepTime: '18 mins',
    price: 'Only ₹390',
    category: 'Gourmet Kitchen',
  },
  {
    id: 'poster-3',
    badge: '🍣 Chef Masterpiece',
    badgeBg: 'from-emerald-600 to-teal-600',
    title: 'NORWEGIAN SALMON & AVOCADO ROLLS',
    subtitle: 'Ultra-Fresh Asian Fusion Selection',
    tagline: 'Rolled live with toasted nori, ripe avocado & ponzu drizzle',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.8,
    prepTime: '22 mins',
    price: 'Starting at ₹480',
    category: 'Signature Sushi',
  },
  {
    id: 'poster-4',
    badge: '✨ 3D Dessert Signature',
    badgeBg: 'from-purple-600 to-pink-600',
    title: 'CHOCOLATE SPHERE MOLTEN LAVA',
    subtitle: 'Interactive Melting Caramel Dome',
    tagline: 'Pouring warm salted caramel over Belgian dark chocolate dome',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
    rating: 4.9,
    prepTime: '12 mins',
    price: 'Only ₹260',
    category: '3D Dessert Show',
  },
];

export const MarqueeSection: React.FC = () => {
  const [activePosterIndex, setActivePosterIndex] = useState(0);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#0C0C0C] py-20 sm:py-28 md:py-36 px-5 sm:px-8 md:px-10 relative z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Section Header */}
        <FadeIn delay={0} y={30} className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#E23744] text-xs sm:text-sm font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Zomato Gourmet Spotlight</span>
            </div>
            <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,7vw,90px)] leading-none tracking-tight">
              Culinary Posters
            </h2>
          </div>
          <p className="text-[#D7E2EA]/60 text-xs sm:text-sm font-light uppercase tracking-widest max-w-sm">
            Hand-curated 3D culinary showcases prepared live in our zone kitchens
          </p>
        </FadeIn>

        {/* Featured Big Poster Card Banner */}
        <FadeIn delay={0.1} y={40} className="w-full">
          <div className="relative w-full min-h-[460px] sm:min-h-[520px] md:min-h-[580px] rounded-[36px] sm:rounded-[48px] overflow-hidden border border-[#D7E2EA]/20 shadow-2xl group flex flex-col justify-end p-6 sm:p-10 md:p-14">
            {/* Background Poster Image with Zoom animation */}
            <img
              src={posters[activePosterIndex].image}
              alt={posters[activePosterIndex].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />

            {/* Gradient Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/70 to-transparent"></div>

            {/* Poster Content Overlay */}
            <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
              {/* Badge & Category */}
              <div className="flex flex-wrap items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r ${posters[activePosterIndex].badgeBg} shadow-lg border border-white/20`}>
                  {posters[activePosterIndex].badge}
                </span>
                <span className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-white/10 flex items-center gap-1">
                  <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
                  <span>{posters[activePosterIndex].category}</span>
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="hero-heading font-black text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-none drop-shadow-md">
                {posters[activePosterIndex].title}
              </h3>
              <p className="text-sm sm:text-lg text-[#D7E2EA] font-medium leading-relaxed">
                {posters[activePosterIndex].subtitle} — <span className="text-[#D7E2EA]/70 font-light">{posters[activePosterIndex].tagline}</span>
              </p>

              {/* Poster Quick Info Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/15">
                <div className="flex items-center gap-4 text-xs font-semibold text-[#D7E2EA]">
                  <span className="flex items-center gap-1 text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {posters[activePosterIndex].rating}
                  </span>
                  <span className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-[#E23744]" /> {posters[activePosterIndex].prepTime}
                  </span>
                  <span className="text-base font-black text-white">
                    {posters[activePosterIndex].price}
                  </span>
                </div>

                <button
                  onClick={scrollToMenu}
                  className="px-6 py-3 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#E23744]/40 hover:scale-105"
                >
                  <span>Order Dish Now</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Poster Selector Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {posters.map((poster, idx) => {
            const isActive = activePosterIndex === idx;
            return (
              <button
                key={poster.id}
                onClick={() => setActivePosterIndex(idx)}
                className={`p-4 rounded-3xl border text-left flex flex-col justify-between gap-4 transition-all duration-300 cursor-pointer relative overflow-hidden group ${
                  isActive
                    ? 'bg-[#18181A] border-[#E23744] ring-2 ring-[#E23744]/40 shadow-xl scale-[1.02]'
                    : 'bg-[#18181A]/60 border-[#D7E2EA]/15 hover:border-white/30 hover:bg-[#18181A]'
                }`}
              >
                <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-[#0C0C0C]">
                  <img
                    src={poster.image}
                    alt={poster.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase bg-[#E23744] text-white px-2 py-0.5 rounded-md">
                    Poster #{idx + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-[#E23744] tracking-wider">{poster.category}</span>
                  <h4 className="font-bold text-sm text-white line-clamp-1 group-hover:text-[#E23744] transition-colors">
                    {poster.title}
                  </h4>
                  <p className="text-[11px] text-[#D7E2EA]/60 line-clamp-1 font-light">{poster.subtitle}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10 text-xs">
                  <span className="font-bold text-white">{poster.price}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-[#E23744]' : 'text-[#D7E2EA]/40'}`}>
                    {isActive ? '● Active' : 'View Poster'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};


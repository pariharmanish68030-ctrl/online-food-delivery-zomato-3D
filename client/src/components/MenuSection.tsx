import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { FadeIn } from './FadeIn';
import { Search, Plus, Star, Clock, Flame, Check, AlertCircle, Sparkles } from 'lucide-react';
import { DishCustomizerModal } from './DishCustomizerModal';

export const MenuSection: React.FC = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});
  const [customizingItem, setCustomizingItem] = useState<any | null>(null);

  const { addToCart } = useCart();
  const { selectedLocation } = useLocation();

  const categories = ['All', 'Main Course', 'Pizza', 'Starters', 'Sushi', 'Burgers', 'Desserts'];

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/food');
      if (res.ok) {
        const data = await res.json();
        setFoods(data);
      }
    } catch (err) {
      console.error('Failed to fetch food items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();

    // Listen for real-time admin food updates
    const handleFoodUpdate = () => fetchFoods();
    window.addEventListener('zomato_food_updated', handleFoodUpdate);
    return () => window.removeEventListener('zomato_food_updated', handleFoodUpdate);
  }, []);

  const handleAdd = (food: any) => {
    addToCart(food);
    setAddedItemIds(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedItemIds(prev => ({ ...prev, [food.id]: false }));
    }, 1200);
  };

  const filteredFoods = foods.filter(food => {
    if (selectedCategory !== 'All' && food.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false;
    }
    if (vegFilter === 'veg' && !food.isVeg) return false;
    if (vegFilter === 'nonveg' && food.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = food.name.toLowerCase().includes(q);
      const matchDesc = food.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <section id="menu" className="w-full bg-[#0C0C0C] text-[#D7E2EA] py-24 px-5 sm:px-8 md:px-10 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-12">
        {/* Section Title */}
        <FadeIn delay={0} y={40} className="w-full text-center">
          <h2 className="hero-heading font-black uppercase text-[clamp(2.5rem,8vw,100px)] leading-none tracking-tight">
            Explore Menu
          </h2>
          {selectedLocation && (
            <p className="text-[#D7E2EA]/60 font-light text-sm uppercase tracking-widest mt-3">
              Delivering to <span className="text-[#E23744] font-medium">{selectedLocation.cityName}</span> ({selectedLocation.estimatedTime})
            </p>
          )}
        </FadeIn>

        {/* Filter Controls Bar */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-6 bg-[#18181A] p-4 rounded-3xl border border-[#D7E2EA]/15 shadow-xl">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D7E2EA]/50" />
            <input
              type="text"
              placeholder="Search dishes or cuisines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-[#0C0C0C] text-sm text-[#D7E2EA] placeholder-[#D7E2EA]/40 rounded-full border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs uppercase font-medium rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#E23744] text-white shadow-lg shadow-[#E23744]/30'
                    : 'bg-[#0C0C0C] text-[#D7E2EA]/70 hover:text-white hover:bg-[#252528]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Veg / Non-Veg Toggle */}
          <div className="flex items-center gap-1 bg-[#0C0C0C] p-1 rounded-full border border-[#D7E2EA]/15">
            <button
              onClick={() => setVegFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium uppercase rounded-full transition-colors ${
                vegFilter === 'all' ? 'bg-[#252528] text-white' : 'text-[#D7E2EA]/60'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setVegFilter('veg')}
              className={`px-3 py-1.5 text-xs font-medium uppercase rounded-full flex items-center gap-1 transition-colors ${
                vegFilter === 'veg' ? 'bg-green-950/80 text-green-400 border border-green-500/30' : 'text-[#D7E2EA]/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Veg
            </button>
            <button
              onClick={() => setVegFilter('nonveg')}
              className={`px-3 py-1.5 text-xs font-medium uppercase rounded-full flex items-center gap-1 transition-colors ${
                vegFilter === 'nonveg' ? 'bg-red-950/80 text-red-400 border border-red-500/30' : 'text-[#D7E2EA]/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Non-Veg
            </button>
          </div>
        </div>

        {/* Menu Cards Grid */}
        {loading ? (
          <div className="w-full text-center py-20 text-[#D7E2EA]/50 font-light">Loading delicious menu...</div>
        ) : filteredFoods.length === 0 ? (
          <div className="w-full text-center py-20 flex flex-col items-center gap-3">
            <AlertCircle className="w-10 h-10 text-[#E23744]" />
            <p className="text-lg font-medium text-[#D7E2EA]">No food items found match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {filteredFoods.map((food, idx) => (
              <FadeIn key={food.id} delay={idx * 0.05} y={30} className="w-full">
                <div className="bg-[#18181A] rounded-[32px] border border-[#D7E2EA]/15 overflow-hidden flex flex-col justify-between group hover:border-[#E23744]/50 transition-all duration-300 shadow-xl">
                  {/* Card Image Banner */}
                  <div className="relative w-full h-56 overflow-hidden bg-[#0C0C0C]">
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#18181A] via-transparent to-transparent opacity-60"></div>

                    {/* Veg/Non-Veg Badge */}
                    <div className="absolute top-4 left-4 bg-[#0C0C0C]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-[10px] uppercase font-semibold text-white">
                        {food.isVeg ? 'Veg' : 'Non-Veg'}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-[#0C0C0C]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1 text-xs font-semibold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{food.rating}</span>
                    </div>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-6 flex flex-col gap-4 flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#D7E2EA]/50 mb-2">
                        <span className="uppercase font-medium text-[#E23744]">{food.category}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {food.prepTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <Flame className="w-3 h-3 text-orange-400" /> {food.spicyLevel}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-bold text-xl text-[#D7E2EA] group-hover:text-[#E23744] transition-colors leading-snug">
                        {food.name}
                      </h3>
                      <p className="text-xs text-[#D7E2EA]/60 font-light leading-relaxed mt-2 line-clamp-2">
                        {food.description}
                      </p>
                    </div>

                    {/* Price & Add Action */}
                    <div className="pt-4 border-t border-[#D7E2EA]/10 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-[#D7E2EA]/40 font-light">Price</span>
                        <span className="text-2xl font-black text-white">₹{food.price}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCustomizingItem(food)}
                          className="p-2.5 rounded-full bg-[#0C0C0C] hover:bg-[#252528] text-amber-400 border border-amber-400/30 transition-all cursor-pointer"
                          title="Customize 3D & Add-Ons"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleAdd(food)}
                          className={`px-4 py-2.5 rounded-full font-semibold text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                            addedItemIds[food.id]
                              ? 'bg-green-600 text-white scale-105'
                              : 'bg-[#E23744] hover:bg-[#900C1D] text-white shadow-lg shadow-[#E23744]/20'
                          }`}
                        >
                          {addedItemIds[food.id] ? (
                            <>
                              <Check className="w-4 h-4" /> Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>

      {/* 3D Dish Customizer Modal */}
      <DishCustomizerModal
        item={customizingItem}
        isOpen={Boolean(customizingItem)}
        onClose={() => setCustomizingItem(null)}
      />
    </section>
  );
};

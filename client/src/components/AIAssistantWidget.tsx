import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { Bot, Sparkles, X, Send, Plus, Check, Compass, Flame, Leaf, ShoppingBag, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  recommendations?: any[];
  actionLink?: { label: string; sectionId: string };
  timestamp: string;
}

export const AIAssistantWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [foods, setFoods] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "👋 Hi! I'm Zomi, your 3D Food Concierge. Tell me what you're craving, or pick a recommendation below!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const { addToCart, setIsCartOpen } = useCart();
  const { selectedLocation } = useLocation();
  const { setIsAdminDashboardOpen } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Fetch food catalog for smart recommendations
  useEffect(() => {
    fetch('/api/food')
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(err => console.error('AI food load error:', err));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSendMessage = (customText?: string) => {
    const query = customText || input.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInput('');

    // Process AI Logic
    setTimeout(() => {
      processAIResponse(query);
    }, 600);
  };

  const processAIResponse = (query: string) => {
    const q = query.toLowerCase();
    let responseText = "Here are my top recommendations tailored for you!";
    let recommendedDishes: any[] = [];
    let actionLink: { label: string; sectionId: string } | undefined = undefined;

    // Navigation triggers
    if (q.includes('menu') || q.includes('explore')) {
      responseText = "Taking you to our full 3D food menu!";
      actionLink = { label: "Jump to Full Menu", sectionId: "menu" };
    } else if (q.includes('cart') || q.includes('order')) {
      setIsCartOpen(true);
      responseText = "Opening your order cart!";
    } else if (q.includes('admin')) {
      setIsAdminDashboardOpen(true);
      responseText = "Opening the Admin Control Center!";
    } else if (q.includes('spicy') || q.includes('chili') || q.includes('hot')) {
      responseText = "🌶-[#E23744] Spicy & Savory Delights:";
      recommendedDishes = foods.filter(f => f.spicyLevel === 'Spicy' || f.spicyLevel === 'Medium');
    } else if (q.includes('veg') || q.includes('vegetarian')) {
      responseText = "🌿 Pure Vegetarian Specialties:";
      recommendedDishes = foods.filter(f => f.isVeg);
    } else if (q.includes('cheap') || q.includes('budget') || q.includes('300') || q.includes('low price')) {
      responseText = "⚡ Pocket-Friendly Deals Under ₹300:";
      recommendedDishes = foods.filter(f => f.price <= 300);
    } else if (q.includes('dessert') || q.includes('sweet') || q.includes('cake')) {
      responseText = "🍰 Decadent Sweets & Desserts:";
      recommendedDishes = foods.filter(f => f.category.toLowerCase() === 'desserts');
    } else if (q.includes('sushi') || q.includes('gourmet') || q.includes('premium')) {
      responseText = "🍣 Premium Gourmet & Chef Specials:";
      recommendedDishes = foods.filter(f => f.category.toLowerCase() === 'sushi' || f.price > 400);
    } else {
      // General fallback recommendations
      recommendedDishes = foods.slice(0, 3);
      responseText = `I found these popular chef specials available for delivery in ${selectedLocation?.cityName || 'your area'}:`;
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      recommendations: recommendedDishes.length > 0 ? recommendedDishes.slice(0, 3) : undefined,
      actionLink,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, aiMsg]);
  };

  const handleAddToCart = (food: any) => {
    addToCart(food);
    setAddedIds(prev => ({ ...prev, [food.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [food.id]: false }));
    }, 1200);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating 3D AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-[#E23744] hover:bg-[#900C1D] text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer border-2 border-white/20"
        title="Zomi 3D AI Food Concierge"
      >
        <div className="relative">
          <Bot className="w-7 h-7 animate-pulse" />
          <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
        </div>
        <span className="hidden group-hover:inline-block ml-2 text-xs font-bold uppercase tracking-wider pr-1">
          Ask Zomi AI
        </span>
      </button>

      {/* AI Assistant Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-full max-w-[360px] sm:max-w-[400px] h-[520px] bg-[#18181A] border border-[#E23744]/40 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden backdrop-blur-xl">
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-[#900C1D] to-[#E23744] p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-black/30 rounded-xl">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-1">
                  Zomi AI Concierge <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" />
                </h4>
                <span className="text-[10px] text-white/80 font-light">Online • Delivering to {selectedLocation?.cityName || 'City'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-white/70 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 text-xs bg-[#0C0C0C]/60">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1.5 ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#E23744] text-white rounded-br-none'
                      : 'bg-[#18181A] text-[#D7E2EA] border border-[#D7E2EA]/15 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* AI Recommendation Cards */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="flex flex-col gap-2 w-full mt-1">
                    {msg.recommendations.map(dish => (
                      <div
                        key={dish.id}
                        className="bg-[#18181A] p-2.5 rounded-2xl border border-[#D7E2EA]/15 flex items-center justify-between gap-3 shadow-lg"
                      >
                        <img src={dish.image} alt={dish.name} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className={`w-2 h-2 rounded-full ${dish.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            <h5 className="font-semibold text-xs text-white truncate max-w-[130px]">{dish.name}</h5>
                          </div>
                          <span className="text-[10px] font-bold text-[#E23744]">₹{dish.price} • ⭐ {dish.rating}</span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(dish)}
                          className={`px-3 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                            addedIds[dish.id]
                              ? 'bg-green-600 text-white'
                              : 'bg-[#E23744] hover:bg-[#900C1D] text-white'
                          }`}
                        >
                          {addedIds[dish.id] ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Navigation Shortcut Link */}
                {msg.actionLink && (
                  <button
                    onClick={() => scrollToSection(msg.actionLink!.sectionId)}
                    className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-[#E23744] bg-[#E23744]/10 hover:bg-[#E23744]/20 px-3 py-1.5 rounded-full border border-[#E23744]/30 cursor-pointer"
                  >
                    <span>{msg.actionLink.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

                <span className="text-[9px] text-[#D7E2EA]/40 px-1">{msg.timestamp}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="p-2.5 bg-[#18181A] border-t border-[#D7E2EA]/10 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => handleSendMessage('Suggest Pure Veg')}
              className="px-2.5 py-1 bg-[#0C0C0C] hover:bg-[#252528] text-[10px] text-green-400 font-medium rounded-full border border-green-500/30 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Leaf className="w-3 h-3" /> Pure Veg
            </button>
            <button
              onClick={() => handleSendMessage('Spicy Main Course')}
              className="px-2.5 py-1 bg-[#0C0C0C] hover:bg-[#252528] text-[10px] text-rose-400 font-medium rounded-full border border-rose-500/30 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <Flame className="w-3 h-3" /> Spicy Dishes
            </button>
            <button
              onClick={() => handleSendMessage('Deals Under 300')}
              className="px-2.5 py-1 bg-[#0C0C0C] hover:bg-[#252528] text-[10px] text-amber-400 font-medium rounded-full border border-amber-500/30 whitespace-nowrap cursor-pointer"
            >
              ⚡ Under ₹300
            </button>
          </div>

          {/* Chat Input Field */}
          <div className="p-3 bg-[#18181A] border-t border-[#D7E2EA]/10 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Zomi for dish suggestions..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2 bg-[#0C0C0C] text-xs text-white placeholder-[#D7E2EA]/40 rounded-full border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 bg-[#E23744] hover:bg-[#900C1D] text-white rounded-full transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

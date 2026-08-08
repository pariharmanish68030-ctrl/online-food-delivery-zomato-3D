import React, { useState } from 'react';
import { X, Flame, Plus, Check, ShoppingBag, Sparkles, ChefHat } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface AddOnOption {
  name: string;
  price: number;
}

interface DishCustomizerModalProps {
  item: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DishCustomizerModal: React.FC<DishCustomizerModalProps> = ({ item, isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy' | 'Extra Hot'>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnOption[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  if (!isOpen || !item) return null;

  const availableAddOns: AddOnOption[] = [
    { name: 'Extra Amul Butter / Cheese', price: 40 },
    { name: 'Artisan Garlic Naan / Dip', price: 35 },
    { name: 'Black Truffle Drizzle', price: 60 },
    { name: 'Extra Mint Chutney & Salads', price: 20 },
  ];

  const toggleAddOn = (addOn: AddOnOption) => {
    if (selectedAddOns.some(a => a.name === addOn.name)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.name !== addOn.name));
    } else {
      setSelectedAddOns([...selectedAddOns, addOn]);
    }
  };

  const addOnTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = item.price + addOnTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customizedItem = {
      ...item,
      name: `${item.name} (${spiceLevel}${selectedAddOns.length ? ' + Custom Add-ons' : ''})`,
      price: unitPrice,
      customizations: {
        spiceLevel,
        addOns: selectedAddOns.map(a => a.name),
      },
    };

    for (let i = 0; i < quantity; i++) {
      addToCart(customizedItem);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#18181A] border border-[#E23744]/40 w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#E23744] text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>3D Interactive Dish Customizer</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{item.name}</h3>
          <p className="text-xs text-[#D7E2EA]/60">{item.description}</p>
        </div>

        {/* 360° Interactive 3D Dish Viewport Simulation */}
        <div className="relative w-full h-56 bg-gradient-to-b from-[#0C0C0C] to-[#18181A] rounded-3xl border border-[#D7E2EA]/15 flex items-center justify-center overflow-hidden group">
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-amber-300 font-mono flex items-center gap-1.5">
            <ChefHat className="w-3.5 h-3.5 text-[#E23744]" />
            <span>Drag slider to rotate 3D mesh (Angle: {rotationAngle}°)</span>
          </div>

          <div
            className="w-40 h-40 rounded-full shadow-2xl transition-transform duration-300 flex items-center justify-center relative"
            style={{
              transform: `rotate(${rotationAngle}deg) scale(1.05)`,
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover rounded-full border-4 border-[#E23744]/40 shadow-2xl"
            />
            {item.isVeg ? (
              <span className="absolute bottom-2 right-2 bg-emerald-950 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500">
                100% VEG
              </span>
            ) : (
              <span className="absolute bottom-2 right-2 bg-rose-950 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500">
                NON-VEG
              </span>
            )}
          </div>

          {/* Rotation Controller Slider */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 bg-black/80 px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#D7E2EA]/60 whitespace-nowrap">360° View:</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={e => setRotationAngle(Number(e.target.value))}
              className="w-full accent-[#E23744] cursor-pointer"
            />
          </div>
        </div>

        {/* Spice Level Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-[#D7E2EA] flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-500" /> Choose Spice Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(['Mild', 'Medium', 'Spicy', 'Extra Hot'] as const).map(level => (
              <button
                key={level}
                onClick={() => setSpiceLevel(level)}
                className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                  spiceLevel === level
                    ? 'bg-[#E23744] border-[#E23744] text-white shadow-lg shadow-[#E23744]/30'
                    : 'bg-[#0C0C0C] border-white/10 text-[#D7E2EA]/60 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Add-Ons Options */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase text-[#D7E2EA] flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-emerald-400" /> Premium Add-Ons & Dips
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableAddOns.map((addOn, idx) => {
              const isSelected = selectedAddOns.some(a => a.name === addOn.name);
              return (
                <button
                  key={idx}
                  onClick={() => toggleAddOn(addOn)}
                  className={`p-3 rounded-2xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#E23744]/15 border-[#E23744] text-white'
                      : 'bg-[#0C0C0C] border-white/10 text-[#D7E2EA]/70 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border ${
                        isSelected ? 'bg-[#E23744] border-[#E23744] text-white' : 'border-white/30'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="text-xs font-medium">{addOn.name}</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+₹{addOn.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Add to Cart Action Footer */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-[#0C0C0C] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-[#18181A] text-white font-bold hover:bg-[#E23744] transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="text-sm font-bold text-white px-2">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-[#18181A] text-white font-bold hover:bg-[#E23744] transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto px-8 py-4 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E23744]/40"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add Customized Item • ₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

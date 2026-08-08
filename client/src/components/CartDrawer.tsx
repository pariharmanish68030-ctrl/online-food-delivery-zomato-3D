import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { X, Plus, Minus, Trash2, ShoppingBag, MapPin, CreditCard, ArrowRight, Navigation, Compass } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart, subtotal, setActiveOrder } = useCart();
  const { selectedLocation, detectLocation, detectingGPS, setIsMapModalOpen, fullAddressDetails } = useLocation();
  const { user, setIsCustomerAuthOpen } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'COD'>('UPI');
  const [deliveryAddress, setDeliveryAddress] = useState('Bhotia Parao, Near Nainital Bank, Main Road, Haldwani, Uttarakhand');
  const [phone, setPhone] = useState('+91 9876543210');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (fullAddressDetails?.formattedAddress) {
      setDeliveryAddress(fullAddressDetails.formattedAddress);
    }
  }, [fullAddressDetails]);

  if (!isCartOpen) return null;

  const deliveryFee = selectedLocation ? selectedLocation.deliveryFee : 35;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal > 0 ? subtotal + deliveryFee + taxes : 0;

  const handleOpenPayment = () => {
    if (!user) {
      setIsCartOpen(false);
      setIsCustomerAuthOpen(true);
      return;
    }
    if (cart.length === 0) return;

    if (paymentMethod === 'COD') {
      processOrderPlacement('Cash on Delivery', 'PENDING-COD');
    } else {
      setIsPaymentModalOpen(true);
    }
  };

  const processOrderPlacement = async (methodName: string, txnRef: string) => {
    try {
      setSubmitting(true);
      const orderPayload = {
        customerName: user ? user.name : 'Guest Customer',
        customerEmail: user ? user.email : 'customer@zomato.com',
        customerPhone: phone,
        address: deliveryAddress,
        cityName: selectedLocation ? selectedLocation.cityName : 'Indiranagar',
        lat: fullAddressDetails?.lat || selectedLocation?.lat || 12.9784,
        lng: fullAddressDetails?.lng || selectedLocation?.lng || 77.6408,
        items: cart,
        subtotal,
        deliveryFee,
        totalAmount: grandTotal,
        paymentMethod: methodName,
        paymentStatus: methodName === 'Cash on Delivery' ? 'Pending' : 'Paid',
        txnId: txnRef,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const data = await res.json();
        clearCart();
        setIsCartOpen(false);
        setActiveOrder(data.order);
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
        <div className="w-full max-w-md bg-[#18181A] h-full flex flex-col justify-between border-l border-[#D7E2EA]/20 shadow-2xl p-6 overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#D7E2EA]/10 pb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#E23744]" />
              <h3 className="font-bold text-lg text-white uppercase tracking-wider">Your Order Cart</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content Items */}
          {cart.length === 0 ? (
            <div className="my-auto text-center flex flex-col items-center gap-3 text-[#D7E2EA]/50 py-12">
              <ShoppingBag className="w-12 h-12 stroke-1 text-[#E23744]" />
              <p className="font-medium text-base text-white">Your cart is currently empty.</p>
              <p className="text-xs max-w-xs leading-relaxed">Add delicious dishes from our menu to begin your order.</p>
            </div>
          ) : (
            <div className="flex-1 my-4 flex flex-col gap-4 overflow-y-auto pr-1">
              {/* Google Maps Real-Time Location Card */}
              <div className="bg-[#0C0C0C] p-3 rounded-2xl border border-[#D7E2EA]/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#E23744]" />
                    <span className="text-white font-bold">
                      {fullAddressDetails?.placeName || selectedLocation?.cityName}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 cursor-pointer"
                  >
                    <Compass className="w-3 h-3" />
                    <span>Pick on Map</span>
                  </button>
                </div>
                <p className="text-[10px] text-[#D7E2EA]/70 line-clamp-2 leading-relaxed">
                  {deliveryAddress}
                </p>
              </div>

              {/* Items List */}
              <div className="flex flex-col gap-3">
                {cart.map(item => (
                  <div
                    key={item.id}
                    className="bg-[#0C0C0C] p-3 rounded-2xl border border-[#D7E2EA]/10 flex items-center justify-between gap-3"
                  >
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <h4 className="font-semibold text-xs text-white truncate max-w-[140px]">{item.name}</h4>
                      </div>
                      <span className="text-xs font-bold text-[#E23744] mt-1 block">₹{item.price * item.quantity}</span>
                    </div>

                    <div className="flex items-center gap-2 bg-[#18181A] px-2 py-1 rounded-full border border-[#D7E2EA]/15">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-[#D7E2EA]/70 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-[#D7E2EA]/70 hover:text-white p-0.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400/60 hover:text-red-400 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Address & Payment Selection */}
              <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-[#D7E2EA]/10 text-xs">
                <div className="flex justify-between items-center">
                  <label className="text-[#D7E2EA]/70 uppercase font-semibold">Complete Delivery Address</label>
                  <button
                    onClick={() => setIsMapModalOpen(true)}
                    className="text-[10px] text-[#E23744] hover:underline font-bold"
                  >
                    Change on Map
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0C0C0C] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744] text-xs leading-relaxed"
                />

                <label className="text-[#D7E2EA]/70 uppercase font-semibold mt-2">Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'COD'] as const).map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 rounded-xl text-xs font-semibold uppercase border transition-colors cursor-pointer ${
                        paymentMethod === method
                          ? 'bg-[#E23744] text-white border-[#E23744]'
                          : 'bg-[#0C0C0C] text-[#D7E2EA]/60 border-[#D7E2EA]/15 hover:bg-[#252528]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Drawer Footer */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-[#D7E2EA]/10 flex flex-col gap-3">
              <div className="flex flex-col gap-1 text-xs text-[#D7E2EA]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee ({selectedLocation?.cityName})</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST & Service Tax (5%)</span>
                  <span>₹{taxes}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[#D7E2EA]/10">
                  <span>Grand Total</span>
                  <span className="text-[#E23744]">₹{grandTotal}</span>
                </div>
              </div>

              <button
                onClick={handleOpenPayment}
                disabled={submitting}
                className="w-full py-3.5 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E23744]/30"
              >
                {submitting ? (
                  'Processing...'
                ) : (
                  <>
                    <span>{paymentMethod === 'COD' ? 'Place COD Order' : 'Proceed To Online Payment'} • ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={grandTotal}
        onSuccess={({ paymentMethod: pMethod, txnId }) => {
          processOrderPlacement(pMethod, txnId);
        }}
      />
    </>
  );
};

import React, { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { CheckCircle2, Clock, MapPin, ChefHat, Bike, X, ShieldCheck, Navigation, Phone, Star } from 'lucide-react';

declare const L: any;

export const OrderTrackingModal: React.FC = () => {
  const { activeOrder, setActiveOrder } = useCart();
  const [trackingData, setTrackingData] = useState<any>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const riderMarker = useRef<any>(null);

  // Poll real-time backend API for live GPS tracking updates
  useEffect(() => {
    if (!activeOrder) return;

    const fetchLiveTracking = async () => {
      try {
        const res = await fetch(`/api/orders/${activeOrder.id}/live-tracking`);
        if (res.ok) {
          const data = await res.json();
          setTrackingData(data);
        }
      } catch (err) {
        console.error('Error fetching live tracking data:', err);
      }
    };

    fetchLiveTracking();
    const interval = setInterval(fetchLiveTracking, 3000);
    return () => clearInterval(interval);
  }, [activeOrder]);

  // Render Real-time Leaflet OpenStreetMap Route Canvas
  useEffect(() => {
    if (!activeOrder || !mapRef.current || typeof L === 'undefined') return;

    const kLat = 29.2183;
    const kLng = 79.5130;
    const dLat = activeOrder.lat || 29.2250;
    const dLng = activeOrder.lng || 79.5200;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([kLat, kLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);

      // Kitchen Marker
      const kitchenIcon = L.divIcon({
        className: 'kitchen-icon',
        html: `<div style="background-color: #10B981; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; items-center; justify-content: center; color: white;">🍳</div>`,
        iconSize: [26, 26],
      });
      L.marker([kLat, kLng], { icon: kitchenIcon }).addTo(leafletMap.current).bindPopup('Zomato Kitchen');

      // Customer Marker
      const customerIcon = L.divIcon({
        className: 'customer-icon',
        html: `<div style="background-color: #E23744; width: 26px; height: 26px; border-radius: 50%; border: 2px solid white; display: flex; items-center; justify-content: center; color: white;">📍</div>`,
        iconSize: [26, 26],
      });
      L.marker([dLat, dLng], { icon: customerIcon }).addTo(leafletMap.current).bindPopup('Delivery Address');

      // Route Polyline
      L.polyline([[kLat, kLng], [dLat, dLng]], { color: '#E23744', weight: 4, opacity: 0.7, dashArray: '8, 8' }).addTo(leafletMap.current);

      // Rider Animated Marker
      const riderIcon = L.divIcon({
        className: 'rider-icon',
        html: `<div style="background-color: #F59E0B; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 15px rgba(226,55,68,0.6); display: flex; items-center; justify-content: center; color: white; font-size: 16px;">🛵</div>`,
        iconSize: [32, 32],
      });

      const initialRiderLat = trackingData?.location?.riderCurrent?.lat || (kLat + (dLat - kLat) * 0.4);
      const initialRiderLng = trackingData?.location?.riderCurrent?.lng || (kLng + (dLng - kLng) * 0.4);

      riderMarker.current = L.marker([initialRiderLat, initialRiderLng], { icon: riderIcon }).addTo(leafletMap.current);
    }

    if (leafletMap.current && riderMarker.current && trackingData?.location?.riderCurrent) {
      const { lat, lng } = trackingData.location.riderCurrent;
      riderMarker.current.setLatLng([lat, lng]);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [activeOrder, trackingData]);

  if (!activeOrder) return null;

  const steps = [
    { key: 'Placed', label: 'Order Placed', icon: CheckCircle2 },
    { key: 'Confirmed', label: 'Confirmed', icon: ShieldCheck },
    { key: 'Preparing', label: 'Kitchen Prep', icon: ChefHat },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: Bike },
    { key: 'Delivered', label: 'Delivered', icon: MapPin },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Confirmed': return 1;
      case 'Preparing': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 0;
    }
  };

  const currentIdx = getStepIndex(trackingData?.orderStatus || activeOrder.orderStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#18181A] border border-[#D7E2EA]/20 w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setActiveOrder(null)}
          className="absolute top-6 right-6 p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[#E23744] text-xs font-bold uppercase tracking-widest">
            <Clock className="w-4 h-4 animate-spin text-[#E23744]" />
            <span>Live GPS Order Tracking System</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Order #{activeOrder.id}</h3>
          <p className="text-xs text-[#D7E2EA]/60">Delivering to {activeOrder.address} ({activeOrder.cityName})</p>
        </div>

        {/* Live Rider Details Card */}
        {trackingData?.rider && (
          <div className="bg-[#0C0C0C] p-4 rounded-2xl border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={trackingData.rider.avatar}
                alt={trackingData.rider.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  {trackingData.rider.name}
                  <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/40 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" /> {trackingData.rider.rating}
                  </span>
                </h4>
                <p className="text-xs text-[#D7E2EA]/60 font-mono">Bike: {trackingData.rider.vehicleNumber}</p>
              </div>
            </div>

            <a
              href={`tel:${trackingData.rider.phone}`}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-full tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Rider</span>
            </a>
          </div>
        )}

        {/* Real-Time Interactive Leaflet Map Viewport */}
        <div className="w-full bg-[#0C0C0C] rounded-2xl border border-[#D7E2EA]/15 p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white uppercase flex items-center gap-1.5">
              <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" /> Live GPS Moving Rider Route Map
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">
              {trackingData?.location?.remainingDistanceKm || '1.2'} km away • ETA {trackingData?.location?.remainingEtaMins || '8'} mins
            </span>
          </div>

          <div className="w-full h-56 rounded-xl border border-white/10 overflow-hidden relative z-10">
            <div ref={mapRef} className="w-full h-full bg-[#1e293b]" />
          </div>
        </div>

        {/* Visual Tracker Stepper */}
        <div className="w-full py-2 px-2">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#252528] -translate-y-1/2 z-0"></div>
            <div
              className="absolute top-1/2 left-0 h-1 bg-[#E23744] -translate-y-1/2 z-0 transition-all duration-700"
              style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isDone = idx <= currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      isCurrent
                        ? 'bg-[#E23744] text-white ring-4 ring-[#E23744]/30 scale-110'
                        : isDone
                        ? 'bg-[#E23744] text-white'
                        : 'bg-[#252528] text-[#D7E2EA]/40'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] uppercase font-semibold text-center whitespace-nowrap ${
                      isDone ? 'text-white' : 'text-[#D7E2EA]/40'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Summary & Payment Info */}
        <div className="bg-[#0C0C0C] p-4 rounded-2xl border border-[#D7E2EA]/10 flex flex-col gap-3">
          <div className="flex justify-between text-xs font-semibold text-[#D7E2EA]">
            <span>Items Ordered ({activeOrder.items?.length || 0})</span>
            <span className="text-[#E23744] font-bold">Total: ₹{activeOrder.totalAmount}</span>
          </div>

          <div className="flex flex-col gap-2 max-h-28 overflow-y-auto pr-1">
            {activeOrder.items?.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs text-[#D7E2EA]/80 border-b border-white/5 pb-1.5">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center text-[10px] text-[#D7E2EA]/60 pt-2 border-t border-white/5">
            <span>Payment: <strong className="text-white">{activeOrder.paymentMethod}</strong> ({activeOrder.paymentStatus})</span>
            {activeOrder.txnId && <span className="font-mono text-emerald-400">Ref: {activeOrder.txnId}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

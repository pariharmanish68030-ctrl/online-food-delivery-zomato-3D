import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from '../context/LocationContext';
import { X, MapPin, Search, CheckCircle2, Building, Compass } from 'lucide-react';

declare const L: any;

export const GoogleMapModal: React.FC = () => {
  const { 
    isMapModalOpen, 
    setIsMapModalOpen, 
    fullAddressDetails, 
    setFullAddressDetails, 
    setSelectedLocation,
    locations 
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [pinCoords, setPinCoords] = useState({ lat: 29.2183, lng: 79.5130 });
  const [placeName, setPlaceName] = useState('Bhotia Parao');
  const [building, setBuilding] = useState('Near Nainital Bank, Main Road');
  const [landmark, setLandmark] = useState('Opposite Kailash Hospital');
  const [city, setCity] = useState('Haldwani');
  const [pincode, setPincode] = useState('263139');
  
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (fullAddressDetails) {
      setPinCoords({ lat: fullAddressDetails.lat || 29.2183, lng: fullAddressDetails.lng || 79.5130 });
      setPlaceName(fullAddressDetails.placeName || 'Bhotia Parao');
      setBuilding(fullAddressDetails.building || 'Near Nainital Bank, Main Road');
      setLandmark(fullAddressDetails.landmark || 'Opposite Kailash Hospital');
      setCity(fullAddressDetails.city || 'Haldwani');
      setPincode(fullAddressDetails.pincode || '263139');
    }
  }, [isMapModalOpen]);

  // Initialize Interactive Real-Time Leaflet Map
  useEffect(() => {
    if (!isMapModalOpen || !mapRef.current) return;

    if (typeof L !== 'undefined' && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current).setView([pinCoords.lat, pinCoords.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(leafletMap.current);

      const customIcon = L.divIcon({
        className: 'custom-pin',
        html: `<div style="background-color: #E23744; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; items-center; justify-content: center; color: white;">📍</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      markerRef.current = L.marker([pinCoords.lat, pinCoords.lng], {
        draggable: true,
        icon: customIcon,
      }).addTo(leafletMap.current);

      markerRef.current.on('dragend', async (e: any) => {
        const coord = e.target.getLatLng();
        handleUpdateCoords(coord.lat, coord.lng);
      });
    } else if (leafletMap.current) {
      leafletMap.current.setView([pinCoords.lat, pinCoords.lng], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([pinCoords.lat, pinCoords.lng]);
      }
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isMapModalOpen]);

  if (!isMapModalOpen) return null;

  const handleUpdateCoords = async (lat: number, lng: number) => {
    setPinCoords({ lat, lng });

    try {
      const res = await fetch('/api/location/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, placeName }),
      });

      if (res.ok) {
        const data = await res.json();
        setBuilding(data.building);
        setLandmark(data.landmark);
        setCity(data.city);
        setPincode(data.pincode);
        if (data.zone) {
          setSelectedLocation(data.zone);
        }
      }
    } catch (err) {
      console.error('Geocode error:', err);
    }
  };

  // Real-time Places Autocomplete Search
  const handleSearchChange = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/location/places?query=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data);
      }
    } catch (err) {
      console.error('Error fetching place suggestions:', err);
    }
  };

  const handleSelectPlace = (place: any) => {
    setPlaceName(place.placeName);
    setBuilding(place.building);
    setLandmark(place.landmark);
    setCity(place.city);
    setPincode(place.pincode);
    setPinCoords({ lat: place.lat, lng: place.lng });
    setSuggestions([]);
    setSearchQuery(place.placeName);

    if (leafletMap.current && markerRef.current) {
      leafletMap.current.setView([place.lat, place.lng], 15);
      markerRef.current.setLatLng([place.lat, place.lng]);
    }

    const matchedZone = locations.find(l => l.cityName.toLowerCase() === place.city.toLowerCase());
    if (matchedZone) {
      setSelectedLocation(matchedZone);
    }
  };

  const handleConfirmAddress = () => {
    const formattedAddress = `${placeName}, ${building}, ${landmark}, ${city}, Pincode: ${pincode}`;
    setFullAddressDetails({
      placeName,
      building,
      landmark,
      city,
      pincode,
      formattedAddress,
      lat: pinCoords.lat,
      lng: pinCoords.lng,
    });
    setIsMapModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#18181A] border border-[#E23744]/40 w-full max-w-3xl rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setIsMapModalOpen(false)}
          className="absolute top-6 right-6 p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer z-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#E23744] text-xs font-bold uppercase tracking-widest">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Interactive OpenStreetMap & Geocoding Engine</span>
          </div>
          <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Select Live Delivery Address</h3>
          <p className="text-xs text-[#D7E2EA]/60">Drag marker on map or search Haldwani, Nainital, Kathgodam, Rudrapur, Lalkuan.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E23744]" />
            <input
              type="text"
              placeholder="Search landmark or area (e.g. Bhotia Parao, Mall Road Nainital, Kathgodam)..."
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#0C0C0C] text-sm text-white rounded-2xl border border-[#D7E2EA]/20 focus:outline-none focus:border-[#E23744]"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-[#18181A] border border-[#E23744]/40 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1">
              {suggestions.map((place, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPlace(place)}
                  className="w-full text-left p-3 hover:bg-[#252528] rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-[#E23744]" />
                    <div>
                      <h5 className="font-bold text-xs text-white">{place.placeName}</h5>
                      <p className="text-[10px] text-[#D7E2EA]/60">{place.building}, {place.city}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">PIN: {place.pincode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Leaflet Map Viewport Container */}
        <div className="w-full h-72 rounded-3xl border border-[#D7E2EA]/20 overflow-hidden shadow-inner relative z-10">
          <div ref={mapRef} className="w-full h-full bg-[#1e293b]" />
        </div>

        {/* Complete Address Breakdown */}
        <div className="bg-[#0C0C0C] p-5 rounded-3xl border border-[#D7E2EA]/15 flex flex-col gap-4">
          <span className="text-xs font-bold uppercase text-[#E23744] tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-[#E23744]" /> Complete Address Breakdown
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/50">Place / Area Name</label>
              <input
                type="text"
                value={placeName}
                onChange={e => setPlaceName(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#18181A] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/50">House / Flat / Building No.</label>
              <input
                type="text"
                value={building}
                onChange={e => setBuilding(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#18181A] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/50">Landmark / Street</label>
              <input
                type="text"
                value={landmark}
                onChange={e => setLandmark(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#18181A] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/50">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#18181A] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#D7E2EA]/50">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#18181A] text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirmAddress}
          className="w-full py-4 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold uppercase tracking-wider text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#E23744]/40"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Confirm Delivery Location & Auto-Fill</span>
        </button>
      </div>
    </div>
  );
};

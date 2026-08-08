import React, { createContext, useContext, useState, useEffect } from 'react';

export interface LocationZone {
  id: string;
  cityName: string;
  zoneName: string;
  pincode: string;
  deliveryFee: number;
  minOrderValue: number;
  estimatedTime: string;
  isActive: boolean;
  lat?: number;
  lng?: number;
}

export interface AddressDetails {
  placeName: string;
  building: string;
  landmark: string;
  city: string;
  pincode: string;
  formattedAddress: string;
  lat: number;
  lng: number;
}

interface LocationContextType {
  locations: LocationZone[];
  selectedLocation: LocationZone | null;
  setSelectedLocation: (loc: LocationZone) => void;
  loading: boolean;
  refreshLocations: () => void;
  detectLocation: () => Promise<void>;
  detectingGPS: boolean;
  currentCoords: { lat: number; lng: number } | null;
  detectedAddress: string;
  isMapModalOpen: boolean;
  setIsMapModalOpen: (open: boolean) => void;
  fullAddressDetails: AddressDetails | null;
  setFullAddressDetails: (addr: AddressDetails) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationZone[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationZone | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectingGPS, setDetectingGPS] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>({ lat: 29.2183, lng: 79.5130 });
  const [detectedAddress, setDetectedAddress] = useState<string>('Bhotia Parao, Near Nainital Bank, Haldwani');
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [fullAddressDetails, setFullAddressDetails] = useState<AddressDetails | null>({
    placeName: 'Bhotia Parao (My Current Location)',
    building: 'Near Nainital Bank, Main Road',
    landmark: 'Opposite Kailash Hospital',
    city: 'Haldwani',
    pincode: '263139',
    formattedAddress: 'Bhotia Parao (Current Location), Near Nainital Bank, Main Road, Haldwani, Uttarakhand, Pincode: 263139',
    lat: 29.2183,
    lng: 79.5130,
  });

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
        if (data.length > 0) {
          // Find current location zone if available, or set first
          const currentZone = data.find((l: any) => l.id === 'loc-curr') || data[0];
          setSelectedLocation(currentZone);
        }
      }
    } catch (err) {
      console.error('Failed to fetch location zones:', err);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    try {
      setDetectingGPS(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentCoords({ lat, lng });

          const res = await fetch('/api/location/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lng }),
          });

          if (res.ok) {
            const data = await res.json();
            setDetectedAddress(data.formattedAddress);
            setFullAddressDetails(data);
            if (data.zone) {
              setSelectedLocation(data.zone);
            }
          }
          setDetectingGPS(false);
        },
        (error) => {
          console.warn('Geolocation fallback:', error);
          const fallbackLat = 12.9784;
          const fallbackLng = 77.6408;
          setCurrentCoords({ lat: fallbackLat, lng: fallbackLng });
          setDetectedAddress('Indiranagar 100ft Road, Bangalore');
          setDetectingGPS(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (err) {
      console.error('Error detecting GPS location:', err);
      setDetectingGPS(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        locations,
        selectedLocation,
        setSelectedLocation,
        loading,
        refreshLocations: fetchLocations,
        detectLocation,
        detectingGPS,
        currentCoords,
        detectedAddress,
        isMapModalOpen,
        setIsMapModalOpen,
        fullAddressDetails,
        setFullAddressDetails,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
};

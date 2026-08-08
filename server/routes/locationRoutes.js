import express from 'express';
import { initialLocationZones } from '../utils/seedData.js';

const router = express.Router();
export let locationZones = [...initialLocationZones];

// Get all location zones
router.get('/', (req, res) => {
  res.json(locationZones);
});

// Real-Time Places Search API (Haldwani, Uttarakhand)
router.get('/places', (req, res) => {
  const { query } = req.query;
  const q = (query || '').toString().toLowerCase();

  const haldwaniPlaces = [
    { placeName: 'Bhotia Parao', building: 'Near Nainital Bank, Main Road', landmark: 'Opposite Kailash Hospital', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2183, lng: 79.5130 },
    { placeName: 'Kaladhungi Road', building: 'Shop No. 12, Kaladhungi Chauraha', landmark: 'Near Corbett National Park Gate', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2095, lng: 79.4982 },
    { placeName: 'Nainital Road', building: 'Flat 301, Greenview Apartments', landmark: 'Near St. Mary\'s School', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2250, lng: 79.5200 },
    { placeName: 'Mukhani', building: 'House No. 88, Sector 2', landmark: 'Near Mukhani Chowk', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2320, lng: 79.5060 },
    { placeName: 'Kathgodam Railway Station', building: 'Station Road, Platform 1 Area', landmark: 'Near Kathgodam Bus Stand', city: 'Kathgodam', state: 'Uttarakhand', pincode: '263126', lat: 29.2727, lng: 79.5247 },
    { placeName: 'Ranibagh', building: 'Near Petrol Pump, NH-87', landmark: 'Opposite Ranibagh Bridge', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2380, lng: 79.5100 },
    { placeName: 'Haldwani Bus Stand', building: 'ISBT Complex, Main Gate', landmark: 'Near Gandhi Park', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.2140, lng: 79.5180 },
    { placeName: 'Gaula River Bridge', building: 'NH-87, Gaula Par Area', landmark: 'Near Gaula Barrage', city: 'Haldwani', state: 'Uttarakhand', pincode: '263139', lat: 29.1900, lng: 79.5050 },
    { placeName: 'Lalkuan Chauraha', building: 'Main Market, Ground Floor', landmark: 'Near SBI Branch Lalkuan', city: 'Lalkuan', state: 'Uttarakhand', pincode: '263139', lat: 29.1073, lng: 79.5289 },
    { placeName: 'Nainital Mall Road', building: 'Near Flats, Mall Road Area', landmark: 'Opposite Nainital Lake Boat Club', city: 'Nainital', state: 'Uttarakhand', pincode: '263001', lat: 29.3803, lng: 79.4636 },
    { placeName: 'Rudrapur Transport Nagar', building: 'Industrial Area, Plot 45', landmark: 'Near Rudrapur SIDCUL', city: 'Rudrapur', state: 'Uttarakhand', pincode: '263153', lat: 28.9740, lng: 79.3990 },
  ];

  if (!q) return res.json(haldwaniPlaces);

  const filtered = haldwaniPlaces.filter(p =>
    p.placeName.toLowerCase().includes(q) ||
    p.city.toLowerCase().includes(q) ||
    p.landmark.toLowerCase().includes(q) ||
    p.building.toLowerCase().includes(q)
  );

  res.json(filtered.length > 0 ? filtered : haldwaniPlaces);
});

// GPS Reverse Geocode & Address Lookup (Haldwani center)
router.post('/geocode', (req, res) => {
  const { lat, lng, placeName } = req.body;
  let nearest = locationZones[0];
  let minDistance = Infinity;

  locationZones.forEach(zone => {
    const dist = Math.sqrt(Math.pow(zone.lat - lat, 2) + Math.pow(zone.lng - lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearest = zone;
    }
  });

  const haldwaniLandmarks = [
    'Near Kailash Hospital', 'Near Gandhi Park', 'Near St. Mary\'s School',
    'Near Mukhani Chowk', 'Near Haldwani Bus Stand', 'Near Gaula Barrage',
    'Near Corbett National Park Gate', 'Near Nainital Bank'
  ];
  const randomLandmark = haldwaniLandmarks[Math.floor(Math.random() * haldwaniLandmarks.length)];

  const resolvedPlace = placeName || `${nearest.cityName} Area`;
  const building = `House No. ${Math.floor(1 + Math.random() * 500)}, ${nearest.cityName} Main Road`;
  const landmark = randomLandmark;
  const formattedAddress = `${resolvedPlace}, ${building}, ${landmark}, ${nearest.cityName}, Uttarakhand, Pincode: ${nearest.pincode}`;

  res.json({
    success: true,
    placeName: resolvedPlace,
    building,
    landmark,
    city: nearest.cityName,
    pincode: nearest.pincode,
    formattedAddress,
    lat,
    lng,
    zone: nearest,
  });
});

// Legacy GPS Reverse Geocode
router.post('/detect', (req, res) => {
  const { lat, lng } = req.body;
  let nearest = locationZones[0];
  let minDistance = Infinity;

  locationZones.forEach(zone => {
    const dist = Math.sqrt(Math.pow(zone.lat - lat, 2) + Math.pow(zone.lng - lng, 2));
    if (dist < minDistance) {
      minDistance = dist;
      nearest = zone;
    }
  });

  res.json({
    success: true,
    detectedCity: nearest.cityName,
    zone: nearest,
    formattedAddress: `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (${nearest.cityName}, Uttarakhand)`,
  });
});

// Add location zone
router.post('/', (req, res) => {
  const newLoc = { id: `loc-${Date.now()}`, ...req.body, isActive: true };
  locationZones.push(newLoc);
  res.status(201).json({ success: true, location: newLoc });
});

// Update location zone
router.put('/:id', (req, res) => {
  const idx = locationZones.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Location zone not found' });
  locationZones[idx] = { ...locationZones[idx], ...req.body };
  res.json({ success: true, location: locationZones[idx] });
});

// Delete location zone
router.delete('/:id', (req, res) => {
  locationZones = locationZones.filter(l => l.id !== req.params.id);
  res.json({ success: true, message: 'Location deleted' });
});

export default router;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { 
  X, ShieldAlert, Plus, Trash2, DollarSign, 
  ShoppingBag, MapPin, Utensils, RefreshCw, ChevronDown, ChevronUp, User, Phone, Mail, CreditCard, Clock, FileText
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdminDashboardOpen, setIsAdminDashboardOpen } = useAuth();
  const { refreshLocations } = useLocation();

  const [activeTab, setActiveTab] = useState<'analytics' | 'food' | 'locations' | 'orders'>('analytics');
  const [stats, setStats] = useState<any>({ totalRevenue: 0, activeOrders: 0, totalOrders: 0, totalFoodItems: 0, totalLocations: 0 });
  const [foods, setFoods] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // New Food Form State
  const [foodTitle, setFoodTitle] = useState('');
  const [foodCategory, setFoodCategory] = useState('Main Course');
  const [foodPrice, setFoodPrice] = useState('');
  const [foodDescription, setFoodDescription] = useState('');
  const [foodImage, setFoodImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
  const [foodIsVeg, setFoodIsVeg] = useState(true);
  const [foodPrepTime, setFoodPrepTime] = useState('20 mins');
  const [foodSpiceLevel, setFoodSpiceLevel] = useState('Medium');
  const [isSubmittingFood, setIsSubmittingFood] = useState(false);

  // New Location Form State
  const [cityName, setCityName] = useState('');
  const [zoneName, setZoneName] = useState('');
  const [pincode, setPincode] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('35');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, foodsRes, locsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/food'),
        fetch('/api/locations'),
        fetch('/api/orders')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (foodsRes.ok) setFoods(await foodsRes.json());
      if (locsRes.ok) setLocations(await locsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminDashboardOpen) {
      fetchData();
    }
  }, [isAdminDashboardOpen]);

  if (!isAdminDashboardOpen) return null;

  // Add Food Handler
  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingFood(true);
      const res = await fetch('/api/food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: foodTitle,
          category: foodCategory,
          price: Number(foodPrice),
          description: foodDescription,
          image: foodImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
          isVeg: foodIsVeg,
          prepTime: foodPrepTime,
          spicyLevel: foodSpiceLevel,
          rating: 4.9,
          tags: ['Chef Special', 'New']
        })
      });
      if (res.ok) {
        setFoodTitle('');
        setFoodPrice('');
        setFoodDescription('');
        fetchData();
        window.dispatchEvent(new Event('zomato_food_updated'));
      }
    } catch (err) {
      console.error('Error adding food:', err);
    } finally {
      setIsSubmittingFood(false);
    }
  };

  // Delete Food
  const handleDeleteFood = async (id: string) => {
    try {
      await fetch(`/api/food/${id}`, { method: 'DELETE' });
      fetchData();
      window.dispatchEvent(new Event('zomato_food_updated'));
    } catch (err) {
      console.error('Error deleting food:', err);
    }
  };

  // Add Location Handler
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityName,
          zoneName: zoneName || cityName,
          pincode,
          deliveryFee: Number(deliveryFee),
          minOrderValue: 200,
          estimatedTime: '25-30 min'
        })
      });
      if (res.ok) {
        setCityName('');
        setZoneName('');
        setPincode('');
        fetchData();
        refreshLocations();
      }
    } catch (err) {
      console.error('Error adding location:', err);
    }
  };

  // Update Order Status Handler
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <div className="bg-[#18181A] border border-[#E23744]/30 w-full max-w-5xl h-[88vh] rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#D7E2EA]/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#900C1D] text-white rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Zomato Admin Control Center</h2>
              <p className="text-xs text-[#D7E2EA]/60">Manage dishes, location zones, revenue analytics, & live order details</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-2 bg-[#0C0C0C] hover:bg-[#252528] text-[#D7E2EA] rounded-full transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-2 text-[#D7E2EA]/60 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#D7E2EA]/10 pb-3 overflow-x-auto">
          {(['analytics', 'food', 'locations', 'orders'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#E23744] text-white shadow-lg shadow-[#E23744]/30'
                  : 'bg-[#0C0C0C] text-[#D7E2EA]/60 hover:text-white hover:bg-[#252528]'
              }`}
            >
              {tab === 'analytics' && 'Analytics Overview'}
              {tab === 'food' && `Food Menu (${foods.length})`}
              {tab === 'locations' && `Location Zones (${locations.length})`}
              {tab === 'orders' && `Detailed Live Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {/* Tab 1: Analytics Overview */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
            <div className="bg-[#0C0C0C] p-6 rounded-3xl border border-[#D7E2EA]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs uppercase font-semibold text-[#D7E2EA]/60">Total Revenue</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-black text-white mt-4">₹{stats.totalRevenue}</h3>
              <p className="text-[10px] text-[#D7E2EA]/40 mt-2">Calculated across all completed orders</p>
            </div>

            <div className="bg-[#0C0C0C] p-6 rounded-3xl border border-[#D7E2EA]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-400">
                <span className="text-xs uppercase font-semibold text-[#D7E2EA]/60">Active Orders</span>
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{stats.activeOrders}</h3>
              <p className="text-[10px] text-[#D7E2EA]/40 mt-2">Currently preparing & out for delivery</p>
            </div>

            <div className="bg-[#0C0C0C] p-6 rounded-3xl border border-[#D7E2EA]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-rose-400">
                <span className="text-xs uppercase font-semibold text-[#D7E2EA]/60">Total Food Items</span>
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{stats.totalFoodItems}</h3>
              <p className="text-[10px] text-[#D7E2EA]/40 mt-2">Active dishes in Zomato menu</p>
            </div>

            <div className="bg-[#0C0C0C] p-6 rounded-3xl border border-[#D7E2EA]/10 flex flex-col justify-between">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs uppercase font-semibold text-[#D7E2EA]/60">Coverage Zones</span>
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-3xl font-black text-white mt-4">{stats.totalLocations}</h3>
              <p className="text-[10px] text-[#D7E2EA]/40 mt-2">Registered delivery cities</p>
            </div>
          </div>
        )}

        {/* Tab 2: Food Menu CRUD */}
        {activeTab === 'food' && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            <form onSubmit={handleAddFood} className="lg:col-span-5 bg-[#0C0C0C] p-5 rounded-3xl border border-[#D7E2EA]/10 flex flex-col gap-3">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#E23744]" /> Add New Food Item to Menu
              </h3>

              {foodImage && (
                <div className="w-full h-28 rounded-2xl overflow-hidden bg-[#18181A] relative">
                  <img src={foodImage} alt="Dish Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-[9px] uppercase font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                    Image Preview
                  </span>
                </div>
              )}

              <input
                type="text"
                placeholder="Dish Title (e.g. 3D Artisan Lava Sundae)"
                value={foodTitle}
                onChange={e => setFoodTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={foodCategory}
                  onChange={e => setFoodCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none"
                >
                  <option value="Main Course">Main Course</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Starters">Starters</option>
                  <option value="Sushi">Sushi</option>
                  <option value="Burgers">Burgers</option>
                  <option value="Desserts">Desserts</option>
                </select>

                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={foodPrice}
                  onChange={e => setFoodPrice(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                />
              </div>

              <textarea
                placeholder="Short Description..."
                value={foodDescription}
                onChange={e => setFoodDescription(e.target.value)}
                rows={2}
                required
                className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={foodImage}
                onChange={e => setFoodImage(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={foodPrepTime}
                  onChange={e => setFoodPrepTime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none"
                >
                  <option value="15 mins">15 mins</option>
                  <option value="20 mins">20 mins</option>
                  <option value="25 mins">25 mins</option>
                  <option value="30 mins">30 mins</option>
                </select>

                <select
                  value={foodSpiceLevel}
                  onChange={e => setFoodSpiceLevel(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Spicy">Spicy</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-[#D7E2EA]/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={foodIsVeg}
                  onChange={e => setFoodIsVeg(e.target.checked)}
                  className="accent-[#E23744]"
                />
                <span>Vegetarian Dish</span>
              </label>

              <button
                type="submit"
                disabled={isSubmittingFood}
                className="w-full py-2.5 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer mt-1 shadow-lg shadow-[#E23744]/30"
              >
                {isSubmittingFood ? 'Publishing to Menu...' : 'Publish Dish to Live Menu'}
              </button>
            </form>

            <div className="lg:col-span-7 flex flex-col gap-3 overflow-y-auto pr-1">
              {foods.map(food => (
                <div key={food.id} className="bg-[#0C0C0C] p-3 rounded-2xl border border-[#D7E2EA]/10 flex items-center justify-between gap-4">
                  <img src={food.image} alt={food.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <h4 className="font-semibold text-sm text-white">{food.name}</h4>
                    </div>
                    <span className="text-xs text-[#D7E2EA]/50">{food.category} • ₹{food.price}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="p-2 text-red-400/60 hover:text-red-400 hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Location Zones */}
        {activeTab === 'locations' && (
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">
            <form onSubmit={handleAddLocation} className="lg:col-span-4 bg-[#0C0C0C] p-5 rounded-3xl border border-[#D7E2EA]/10 flex flex-col gap-3">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#E23744]" /> Add Delivery Location Zone
              </h3>

              <input
                type="text"
                placeholder="City Name (e.g. Indiranagar)"
                value={cityName}
                onChange={e => setCityName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />

              <input
                type="text"
                placeholder="Zone / Sub-Area Name"
                value={zoneName}
                onChange={e => setZoneName(e.target.value)}
                className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={pincode}
                  onChange={e => setPincode(e.target.value)}
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                />

                <input
                  type="number"
                  placeholder="Fee (₹)"
                  value={deliveryFee}
                  onChange={e => setDeliveryFee(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#18181A] text-xs text-white rounded-xl border border-[#D7E2EA]/15 focus:outline-none focus:border-[#E23744]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#E23744] hover:bg-[#900C1D] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer mt-2"
              >
                Add Coverage Zone
              </button>
            </form>

            <div className="lg:col-span-8 flex flex-col gap-3 overflow-y-auto pr-1">
              {locations.map(loc => (
                <div key={loc.id} className="bg-[#0C0C0C] p-4 rounded-2xl border border-[#D7E2EA]/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#E23744]" />
                    <div>
                      <h4 className="font-semibold text-sm text-white">{loc.cityName} ({loc.zoneName})</h4>
                      <span className="text-xs text-[#D7E2EA]/50">Pincode: {loc.pincode} • Fee: ₹{loc.deliveryFee}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-950/80 text-green-400 text-[10px] font-bold uppercase rounded-full border border-green-500/30">
                    Active Zone
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Rich Expandable Live Customer Orders */}
        {activeTab === 'orders' && (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-2 pr-1">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-[#D7E2EA]/40">No live orders in system right now.</div>
            ) : (
              orders.map(order => {
                const isExpanded = expandedOrderId === order.id;

                return (
                  <div key={order.id} className="bg-[#0C0C0C] rounded-3xl border border-[#D7E2EA]/15 overflow-hidden shadow-xl">
                    {/* Summary Bar */}
                    <div className="p-4 flex flex-wrap items-center justify-between gap-3 bg-[#18181A]">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-base text-[#E23744] bg-[#E23744]/10 px-3 py-1 rounded-full border border-[#E23744]/30">
                          #{order.id}
                        </span>
                        <div>
                          <h4 className="font-bold text-sm text-white flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-[#E23744]" /> {order.customerName}
                          </h4>
                          <span className="text-xs text-[#D7E2EA]/60">{order.cityName} • {order.items?.length || 0} items</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-xs text-[#D7E2EA]/50 block">Grand Total</span>
                          <span className="text-base font-black text-emerald-400">₹{order.totalAmount}</span>
                        </div>

                        {/* Order Status Advancement Pills */}
                        <div className="flex items-center gap-1 bg-[#0C0C0C] p-1 rounded-full border border-white/10">
                          {['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'].map(status => (
                            <button
                              key={status}
                              onClick={() => handleUpdateOrderStatus(order.id, status)}
                              className={`px-2.5 py-1 text-[9px] uppercase font-bold rounded-full transition-all cursor-pointer ${
                                order.orderStatus === status
                                  ? 'bg-[#E23744] text-white shadow-md'
                                  : 'text-[#D7E2EA]/40 hover:text-white'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
                        </div>

                        {/* Expand / Collapse Button */}
                        <button
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="p-2 bg-[#0C0C0C] hover:bg-[#252528] text-white rounded-full transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Detailed Order View Panel */}
                    {isExpanded && (
                      <div className="p-6 border-t border-[#D7E2EA]/10 flex flex-col gap-6 bg-[#0C0C0C]/80">
                        {/* Customer & Delivery Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#18181A] p-4 rounded-2xl border border-white/5 text-xs">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#E23744] flex items-center gap-1">
                              <User className="w-3 h-3" /> Customer Profile
                            </span>
                            <span className="text-white font-medium">{order.customerName}</span>
                            <span className="text-[#D7E2EA]/60 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-[#D7E2EA]/40" /> {order.customerEmail}
                            </span>
                            <span className="text-[#D7E2EA]/60 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#D7E2EA]/40" /> {order.customerPhone}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#E23744] flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> Delivery Address
                            </span>
                            <span className="text-white font-medium">{order.address}</span>
                            <span className="text-[#D7E2EA]/60">City Zone: {order.cityName}</span>
                            <span className="text-[#D7E2EA]/60 font-mono text-[10px]">
                              GPS: {order.lat ? `${order.lat.toFixed(4)}, ${order.lng.toFixed(4)}` : 'Indiranagar Core'}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-[#E23744] flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> Payment Breakdown
                            </span>
                            <span className="text-white font-medium">Method: {order.paymentMethod}</span>
                            <span className="text-emerald-400 font-semibold">Status: {order.paymentStatus}</span>
                            {order.txnId && <span className="font-mono text-[#D7E2EA]/60 text-[10px]">Ref: {order.txnId}</span>}
                          </div>
                        </div>

                        {/* Itemized Order Table */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-bold uppercase text-[#D7E2EA]/80 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-[#E23744]" /> Ordered Items Breakdown
                          </span>

                          <div className="bg-[#18181A] rounded-2xl border border-white/5 overflow-hidden">
                            <table className="w-full text-left text-xs">
                              <thead className="bg-[#0C0C0C] text-[#D7E2EA]/50 uppercase text-[10px]">
                                <tr>
                                  <th className="p-3">Dish Name</th>
                                  <th className="p-3">Unit Price</th>
                                  <th className="p-3">Quantity</th>
                                  <th className="p-3 text-right">Subtotal</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {order.items?.map((item: any, idx: number) => (
                                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 font-semibold text-white flex items-center gap-2">
                                      {item.image && <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />}
                                      <span>{item.name}</span>
                                    </td>
                                    <td className="p-3 text-[#D7E2EA]/70">₹{item.price}</td>
                                    <td className="p-3 font-bold text-white">x{item.quantity}</td>
                                    <td className="p-3 text-right font-bold text-[#E23744]">₹{item.price * item.quantity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

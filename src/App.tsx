import React, { useState, useMemo } from 'react';
import { 
  Building2, Home, MapPin, Phone, MessageSquare, Share2, 
  Search, SlidersHorizontal, ShieldCheck, CheckCircle2, 
  AlertCircle, DollarSign, Users, PieChart as PieChartIcon, 
  BarChart3, TrendingUp, FileText, Download, Copy, Check,
  Smartphone, Laptop, Terminal, Database, Key, Sparkles,
  ArrowUpRight, ArrowDownRight, RefreshCw, Wifi, WifiOff,
  Plus, Eye, ChevronRight, Filter, Calendar, Send, ShieldAlert,
  Layers, UserCheck, Wrench, Receipt, ArrowRight, ExternalLink,
  Image as ImageIcon, Trash2, X, ChevronLeft, PlusCircle, Maximize2
} from 'lucide-react';

// --- Types ---
export type UserRole = 'Owner' | 'Property Manager' | 'Agent' | 'Tenant' | 'Caretaker' | 'Accountant' | 'Admin';

export interface Property {
  id: string;
  title: string;
  propertyType: 'Apartments' | 'Rental Compound' | 'Commercial Complex' | 'Residential Bungalows';
  district: string;
  division: string;
  village: string;
  landmark: string;
  titleType?: 'Mailo' | 'Freehold' | 'Leasehold' | 'Customary';
  images: string[];
  totalUnits: number;
  occupiedUnits: number;
  monthlyExpectedUGX: number;
  caretakerName: string;
  caretakerPhone: string;
  description: string;
}

export interface Listing {
  id: string;
  title: string;
  type: 'Apartment' | 'Standalone' | 'Rental' | 'Commercial' | 'Land' | 'Hostel';
  listingType: 'Rent' | 'Sale' | 'Hire';
  priceUGX: number;
  period?: 'month' | 'total';
  district: string;
  division: string;
  village: string;
  landmark: string;
  bedrooms?: number;
  bathrooms?: number;
  verified: boolean;
  featured: boolean;
  amenities: string[];
  imageUrl: string;
  contactPhone: string;
  contactWhatsApp: string;
  description: string;
  lat: number;
  lng: number;
  titleType?: 'Mailo' | 'Freehold' | 'Leasehold' | 'Customary';
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  tenantName: string;
  unitCode: string;
  propertyTitle: string;
  amountUGX: number;
  method: 'MTN MoMo' | 'Airtel Money' | 'Bank' | 'Cash';
  transactionId: string;
  paymentDate: string;
  forMonth: string;
  status: 'Pending Verification' | 'Confirmed' | 'Rejected';
}

export interface Unit {
  id: string;
  propertyId: string;
  code: string;
  property: string;
  monthlyRentUGX: number;
  status: 'Occupied' | 'Vacant' | 'Under Maintenance';
  currentTenant?: string;
  tenantPhone?: string;
  arrearsUGX: number;
}

export default function App() {
  // Navigation & View Mode
  const [activeTab, setActiveTab] = useState<'marketplace' | 'business' | 'companion' | 'database'>('marketplace');
  const [userRole, setUserRole] = useState<UserRole>('Owner');
  const [lowDataMode, setLowDataMode] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [language, setLanguage] = useState<'EN' | 'LG'>('EN');

  // Marketplace state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [priceMax, setPriceMax] = useState<number>(5000000);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['lst-1', 'lst-3']);
  const [copiedReceipt, setCopiedReceipt] = useState<string | null>(null);

  // Business Portal Subtab
  const [businessSubtab, setBusinessSubtab] = useState<'dashboard' | 'properties' | 'rent' | 'charts' | 'maintenance'>('properties');
  
  // Charts interactive state
  const [chartType, setChartType] = useState<'bar' | 'line' | 'donut'>('bar');
  const [chartPeriod, setChartPeriod] = useState<'thisMonth' | 'lastMonth' | 'thisYear'>('thisMonth');

  // Receipt Modal State
  const [viewingReceipt, setViewingReceipt] = useState<PaymentRecord | null>(null);

  // --- Properties with Multiple Image URLs State ---
  const [properties, setProperties] = useState<Property[]>([
    {
      id: 'prop-1',
      title: 'Ntinda Ministers Court',
      propertyType: 'Apartments',
      district: 'Kampala',
      division: 'Nakawa Division',
      village: 'Ntinda Ministers Village',
      landmark: 'Near Quality Supermarket',
      titleType: 'Mailo',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=70'
      ],
      totalUnits: 4,
      occupiedUnits: 3,
      monthlyExpectedUGX: 5200000,
      caretakerName: 'Kato Paul',
      caretakerPhone: '+256 772 101010',
      description: 'Gated 4-unit apartment block with perimeter electric fence, paved parking for 8 cars, and 10,000L NWSC reserve tanks.'
    },
    {
      id: 'prop-2',
      title: 'Bweyogerere Apex Rentals',
      propertyType: 'Rental Compound',
      district: 'Wakiso',
      division: 'Bweyogerere',
      village: 'Kakajjo Zone',
      landmark: 'Near Namboole Stadium Stage',
      titleType: 'Freehold',
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1502005229762-ae1b464003d1?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=70'
      ],
      totalUnits: 3,
      occupiedUnits: 2,
      monthlyExpectedUGX: 1350000,
      caretakerName: 'Babirye Florence',
      caretakerPhone: '+256 701 998877',
      description: 'Clean residential compound with 3 self-contained muzigo units, separate Yaka meters, and borehole tap.'
    },
    {
      id: 'prop-3',
      title: 'Entebbe Lake Breeze Estate',
      propertyType: 'Residential Bungalows',
      district: 'Wakiso',
      division: 'Entebbe Municipality',
      village: 'Manyago',
      landmark: 'Near Entebbe Golf Club',
      titleType: 'Leasehold',
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&auto=format&fit=crop&q=70',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=70'
      ],
      totalUnits: 2,
      occupiedUnits: 2,
      monthlyExpectedUGX: 7000000,
      caretakerName: 'Okello Denis',
      caretakerPhone: '+256 752 443322',
      description: 'Lakeside executive residential property with mature gardens, solar inverter backup, and separate staff quarters.'
    }
  ]);

  // Image Gallery Lightbox Modal State
  const [activeGallery, setActiveGallery] = useState<{
    property: Property;
    currentIndex: number;
  } | null>(null);

  // Property Image Management Modal State
  const [managingImagesProperty, setManagingImagesProperty] = useState<Property | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  // Property Deletion Confirmation State
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Units Data
  const [units] = useState<Unit[]>([
    { id: 'u-1', propertyId: 'prop-1', code: 'Unit A-01', property: 'Ntinda Ministers Court', monthlyRentUGX: 1200000, status: 'Occupied', currentTenant: 'Opolot John Patrick', tenantPhone: '+256 772 334455', arrearsUGX: 0 },
    { id: 'u-2', propertyId: 'prop-1', code: 'Unit A-02', property: 'Ntinda Ministers Court', monthlyRentUGX: 1200000, status: 'Occupied', currentTenant: 'Namata Grace', tenantPhone: '+256 701 445566', arrearsUGX: 600000 },
    { id: 'u-3', propertyId: 'prop-1', code: 'Unit B-01', property: 'Ntinda Ministers Court', monthlyRentUGX: 1400000, status: 'Vacant', arrearsUGX: 0 },
    { id: 'u-4', propertyId: 'prop-1', code: 'Unit B-02', property: 'Ntinda Ministers Court', monthlyRentUGX: 1400000, status: 'Occupied', currentTenant: 'Mukasa David Ssekitoleko', tenantPhone: '+256 782 998811', arrearsUGX: 0 },
    { id: 'u-5', propertyId: 'prop-2', code: 'Muzigo 01', property: 'Bweyogerere Apex Rentals', monthlyRentUGX: 450000, status: 'Occupied', currentTenant: 'Akello Sharon', tenantPhone: '+256 752 121212', arrearsUGX: 0 },
    { id: 'u-6', propertyId: 'prop-2', code: 'Muzigo 02', property: 'Bweyogerere Apex Rentals', monthlyRentUGX: 450000, status: 'Occupied', currentTenant: 'Kintu Brian', tenantPhone: '+256 779 887766', arrearsUGX: 450000 },
    { id: 'u-7', propertyId: 'prop-2', code: 'Muzigo 03', property: 'Bweyogerere Apex Rentals', monthlyRentUGX: 450000, status: 'Under Maintenance', arrearsUGX: 0 },
  ]);

  // Mock Listings Data (Realistic Uganda Context)
  const [listings] = useState<Listing[]>([
    {
      id: 'lst-1',
      title: 'Modern 2-Bedroom Apartment in Ntinda Ministers Village',
      type: 'Apartment',
      listingType: 'Rent',
      priceUGX: 1200000,
      period: 'month',
      district: 'Kampala',
      division: 'Nakawa Division',
      village: 'Ntinda Ministers Village',
      landmark: 'Near Quality Supermarket',
      bedrooms: 2,
      bathrooms: 2,
      verified: true,
      featured: true,
      amenities: ['NWSC Water + 5000L Reserve', 'Umeme Yaka Prepaid', 'Perimeter Wall & Gate', 'Security Guard (24/7)', 'Paved Parking'],
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256772123456',
      contactWhatsApp: '256772123456',
      description: 'Well-ventilated unit with modern ceramic tiles, built-in kitchen cabinets, instant water heater, and tight neighborhood watch.',
      lat: 0.3542,
      lng: 32.6143,
    },
    {
      id: 'lst-2',
      title: '50x100ft Residential Plot in Kira Municipal Council',
      type: 'Land',
      listingType: 'Sale',
      priceUGX: 45000000,
      period: 'total',
      district: 'Wakiso',
      division: 'Kira Municipality',
      village: 'Kimbowa Zone, Namugongo',
      landmark: '1.2km from Namugongo Catholic Shrine',
      verified: true,
      featured: false,
      titleType: 'Mailo',
      amenities: ['Ready Mailo Land Title', 'Power line on site', 'Graded Murram access road', 'Gentle slope for building'],
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256701987654',
      contactWhatsApp: '256701987654',
      description: 'Prime dry land with verified Mailo land title search at Wakiso Zonal Office. Ready for immediate construction.',
      lat: 0.3881,
      lng: 32.6512,
    },
    {
      id: 'lst-3',
      title: 'Self-Contained 1-Bedroom Rental (Muzigo) in Bweyogerere',
      type: 'Rental',
      listingType: 'Rent',
      priceUGX: 450000,
      period: 'month',
      district: 'Wakiso',
      division: 'Bweyogerere',
      village: 'Kakajjo Zone',
      landmark: 'Near Namboole Stadium Stage',
      bedrooms: 1,
      bathrooms: 1,
      verified: true,
      featured: false,
      amenities: ['Individual Yaka meter', 'Inside tiled bathroom', 'Water tap in compound', 'Fenced yard with razor wire'],
      imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256782555111',
      contactWhatsApp: '256782555111',
      description: 'Ideal for young professionals. Secure compound with 6 units, peaceful neighborhood, close to Jinja Road taxis.',
      lat: 0.3478,
      lng: 32.6598,
    },
    {
      id: 'lst-4',
      title: 'Executive 4-Bedroom Bungalow with Boy’s Quarters in Entebbe',
      type: 'Standalone',
      listingType: 'Rent',
      priceUGX: 3500000,
      period: 'month',
      district: 'Wakiso',
      division: 'Entebbe Municipality',
      village: 'Manyago',
      landmark: 'Near Entebbe Golf Club',
      bedrooms: 4,
      bathrooms: 3,
      verified: true,
      featured: true,
      amenities: ['Lake Victoria breeze', 'Mature lush garden', 'Solar backup 3kVA', 'Electric fence', 'Separate servant quarters'],
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256752000888',
      contactWhatsApp: '256752000888',
      description: 'Spacious colonial-style family home, quiet diplomatic area, 5 minutes to Entebbe International Airport.',
      lat: 0.0512,
      lng: 32.4637,
    },
    {
      id: 'lst-5',
      title: 'Ground Floor Commercial Space in Mbarara High Street',
      type: 'Commercial',
      listingType: 'Rent',
      priceUGX: 1800000,
      period: 'month',
      district: 'Mbarara',
      division: 'Mbarara City Central',
      village: 'Kamukuzi',
      landmark: 'Opposite Stanbic Bank High Street',
      verified: true,
      featured: false,
      amenities: ['High pedestrian footfall', 'Glass front with roller shutter', '3-Phase power', 'Dedicated customer parking'],
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256774998877',
      contactWhatsApp: '256774998877',
      description: 'Strategic commercial shop/showroom suitable for pharmacy, bank agency, electronics or boutique.',
      lat: -0.6072,
      lng: 30.6545,
    },
    {
      id: 'lst-6',
      title: 'Self-Contained University Hostel Room in Gulu Pece',
      type: 'Hostel',
      listingType: 'Rent',
      priceUGX: 650000,
      period: 'month',
      district: 'Gulu',
      division: 'Pece-Laroo Division',
      village: 'Pece Lukung',
      landmark: '800m to Gulu University Main Campus',
      bedrooms: 1,
      bathrooms: 1,
      verified: false,
      featured: false,
      amenities: ['Free Wi-Fi (Fiber)', 'Standby generator', 'Borehole backup', 'Canteen inside compound'],
      imageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=70',
      contactPhone: '+256788334455',
      contactWhatsApp: '256788334455',
      description: 'Clean, secure university hostel. Shuttle available during exam weeks.',
      lat: 2.7725,
      lng: 32.2990,
    }
  ]);

  // Mock Payments (MTN MoMo & Airtel Money focus)
  const [payments, setPayments] = useState<PaymentRecord[]>([
    {
      id: 'pay-101',
      receiptNumber: 'MK-2026-00412',
      tenantName: 'Opolot John Patrick',
      unitCode: 'Unit A-01',
      propertyTitle: 'Ntinda Ministers Court',
      amountUGX: 1200000,
      method: 'MTN MoMo',
      transactionId: 'MP261025.1042.A91021',
      paymentDate: '25 Oct 2026',
      forMonth: 'October 2026',
      status: 'Confirmed'
    },
    {
      id: 'pay-102',
      receiptNumber: 'MK-2026-00413',
      tenantName: 'Mukasa David Ssekitoleko',
      unitCode: 'Unit B-02',
      propertyTitle: 'Ntinda Ministers Court',
      amountUGX: 1400000,
      method: 'Airtel Money',
      transactionId: 'AIR261026992144',
      paymentDate: '26 Oct 2026',
      forMonth: 'October 2026',
      status: 'Confirmed'
    },
    {
      id: 'pay-103',
      receiptNumber: 'MK-2026-00414',
      tenantName: 'Akello Sharon',
      unitCode: 'Muzigo 01',
      propertyTitle: 'Bweyogerere Apex Rentals',
      amountUGX: 450000,
      method: 'MTN MoMo',
      transactionId: 'MP261026.0815.B12390',
      paymentDate: '26 Oct 2026',
      forMonth: 'October 2026',
      status: 'Pending Verification'
    },
    {
      id: 'pay-104',
      receiptNumber: 'MK-2026-00415',
      tenantName: 'Namata Grace',
      unitCode: 'Unit A-02',
      propertyTitle: 'Ntinda Ministers Court',
      amountUGX: 600000,
      method: 'MTN MoMo',
      transactionId: 'MP261026.1102.K44810',
      paymentDate: '26 Oct 2026',
      forMonth: 'October 2026 (Part Payment)',
      status: 'Pending Verification'
    }
  ]);

  // Currency Formatter
  const formatUGX = (num: number) => {
    return 'UGX ' + num.toLocaleString('en-US');
  };

  // Filtered Listings
  const filteredListings = useMemo(() => {
    return listings.filter(l => {
      const matchSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.landmark.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.district.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDistrict = selectedDistrict === 'All' || l.district === selectedDistrict;
      const matchType = selectedType === 'All' || l.type === selectedType;
      const matchPrice = l.priceUGX <= priceMax;
      return matchSearch && matchDistrict && matchType && matchPrice;
    });
  }, [listings, searchQuery, selectedDistrict, selectedType, priceMax]);

  // Approve / Confirm Payment
  const handleConfirmPayment = (id: string) => {
    setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'Confirmed' } : p));
  };

  // --- Handlers for Property Image URLs Management ---
  const handleAddImageUrl = (propertyId: string, urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) {
      setUrlError('Please enter an image URL');
      return;
    }
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setUrlError('URL must start with http:// or https://');
      return;
    }

    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        return { ...p, images: [...p.images, trimmed] };
      }
      return p;
    }));

    if (managingImagesProperty && managingImagesProperty.id === propertyId) {
      setManagingImagesProperty(prev => prev ? { ...prev, images: [...prev.images, trimmed] } : null);
    }

    setNewImageUrl('');
    setUrlError('');
  };

  const handleRemoveImageUrl = (propertyId: string, indexToRemove: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const updated = p.images.filter((_, idx) => idx !== indexToRemove);
        return { ...p, images: updated };
      }
      return p;
    }));

    if (managingImagesProperty && managingImagesProperty.id === propertyId) {
      setManagingImagesProperty(prev => prev ? {
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove)
      } : null);
    }
  };

  const handleSetPrimaryImage = (propertyId: string, index: number) => {
    setProperties(prev => prev.map(p => {
      if (p.id === propertyId) {
        const item = p.images[index];
        const rest = p.images.filter((_, idx) => idx !== index);
        return { ...p, images: [item, ...rest] };
      }
      return p;
    }));

    if (managingImagesProperty && managingImagesProperty.id === propertyId) {
      setManagingImagesProperty(prev => {
        if (!prev) return null;
        const item = prev.images[index];
        const rest = prev.images.filter((_, idx) => idx !== index);
        return { ...prev, images: [item, ...rest] };
      });
    }
  };

  const handleConfirmDeleteProperty = () => {
    if (!propertyToDelete) return;
    const deletedTitle = propertyToDelete.title;
    setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
    setPropertyToDelete(null);
    setToastMessage(`Property "${deletedTitle}" was deleted successfully.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Universal Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-red-600 to-black flex items-center justify-center shadow-lg border border-amber-400/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">rize</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                  Uganda Mobile &amp; Cloud
                </span>
              </div>
              <p className="text-xs text-slate-400">Real Estate Marketplace &amp; Property Management Suite</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'marketplace' ? 'bg-amber-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Public Marketplace</span>
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'business' ? 'bg-amber-500 text-slate-950 font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Business Portal</span>
            </button>
            <button
              onClick={() => setActiveTab('companion')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'companion' ? 'bg-blue-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>React Native (Expo) Guide</span>
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'database' ? 'bg-emerald-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase SQL</span>
            </button>
          </div>

          {/* Quick Uganda Adaptations */}
          <div className="flex items-center gap-2 text-xs">
            {/* Low Data Mode Toggle */}
            <button
              onClick={() => setLowDataMode(!lowDataMode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all ${
                lowDataMode ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Saves mobile data bundles by compressing media & graphics"
            >
              {lowDataMode ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
              <span>{lowDataMode ? 'Low Data ON' : 'Normal Data'}</span>
            </button>

            {/* Offline simulation */}
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border transition-all ${
                isOffline ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title="Simulate weak connectivity in rural / edge towns"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isOffline ? 'animate-spin' : ''}`} />
              <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
            </button>

            {/* Luganda toggle */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'LG' : 'EN')}
              className="px-2 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-semibold"
            >
              {language === 'EN' ? '🇺🇬 EN' : '🇺🇬 Luganda'}
            </button>

            {/* Share Testing URL Button */}
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md shadow-blue-900/30"
              title="Share live link to test on your Android phone"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Testing URL</span>
            </button>
          </div>
        </div>
      </header>

      {/* Offline Toast Banner */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Weak/No Internet Detected: App is running from SQLite device cache. New records will sync automatically when reconnected.</span>
          </div>
        </div>
      )}

      {/* MAIN VIEW AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* ============================================================== */}
        {/* 1. PUBLIC MARKETPLACE (No Login)                              */}
        {/* ============================================================== */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            {/* Hero / Filter Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">
                      {language === 'EN' ? 'Find Property in Uganda' : 'Noonya Ennyumba n\'Ettaka mu Uganda'}
                    </h1>
                    <p className="text-sm text-slate-400">
                      Kampala, Wakiso, Entebbe, Jinja, Mbarara, Gulu &amp; across the country. Verified land titles &amp; direct owner contacts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Zero Broker Fraud / Land Title Checks
                    </span>
                  </div>
                </div>

                {/* Search Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Village, Parish, Landmark (e.g. Ntinda, Namugongo)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Districts / Towns</option>
                      <option value="Kampala">Kampala</option>
                      <option value="Wakiso">Wakiso (Kira, Nansana, Entebbe)</option>
                      <option value="Mukono">Mukono</option>
                      <option value="Jinja">Jinja City</option>
                      <option value="Mbarara">Mbarara City</option>
                      <option value="Gulu">Gulu City</option>
                      <option value="Mbale">Mbale City</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="All">All Property Types</option>
                      <option value="Apartment">Apartment / Flat</option>
                      <option value="Rental">Muzigo / Rental Units</option>
                      <option value="Standalone">Standalone House / Bungalow</option>
                      <option value="Land">Land / Plots (Mailo/Freehold)</option>
                      <option value="Commercial">Commercial / Shops</option>
                      <option value="Hostel">University Student Hostel</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Max Price:</span>
                      <span className="text-amber-400 font-semibold">{formatUGX(priceMax)}</span>
                    </div>
                    <input
                      type="range"
                      min={300000}
                      max={50000000}
                      step={100000}
                      value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="accent-amber-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Grid + Map Pin Cluster Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Listings List (2 Cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>Showing <strong className="text-white">{filteredListings.length}</strong> available listings</span>
                  <span>Currency: <strong className="text-amber-400">UGX (Ugandan Shillings)</strong></span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredListings.map(listing => {
                    const isFav = favorites.includes(listing.id);
                    return (
                      <div
                        key={listing.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col group cursor-pointer"
                        onClick={() => setSelectedListing(listing)}
                      >
                        {/* Image Banner */}
                        <div className="relative aspect-video bg-slate-950 overflow-hidden">
                          {!lowDataMode ? (
                            <img
                              src={listing.imageUrl}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 text-center">
                              <Building2 className="w-8 h-8 text-slate-600 mb-1" />
                              <span className="text-xs text-slate-400">Low-Data Mode: Image paused</span>
                            </div>
                          )}

                          {/* Badges */}
                          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-slate-950">
                              {listing.listingType.toUpperCase()}
                            </span>
                            {listing.verified && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/90 text-white flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Verified
                              </span>
                            )}
                            {listing.titleType && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-600 text-white">
                                {listing.titleType} Title
                              </span>
                            )}
                          </div>

                          {/* Bookmark */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites(prev => isFav ? prev.filter(x => x !== listing.id) : [...prev, listing.id]);
                            }}
                            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                              isFav ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                            }`}
                          >
                            ★
                          </button>

                          {/* Price Tag Overlay */}
                          <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50">
                            <span className="text-sm font-bold text-amber-400">{formatUGX(listing.priceUGX)}</span>
                            {listing.period === 'month' && <span className="text-[10px] text-slate-400"> /mo</span>}
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-amber-400 transition-colors">
                              {listing.title}
                            </h3>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{listing.village}, {listing.district}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              Near {listing.landmark}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                              {listing.bedrooms && <span>{listing.bedrooms} Beds</span>}
                              {listing.bathrooms && <span>• {listing.bathrooms} Baths</span>}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://wa.me/${listing.contactWhatsApp}?text=${encodeURIComponent(`Hello, I saw your listing for "${listing.title}" on rize. Is it still available?`)}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                                title="WhatsApp Landlord"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </a>
                              <a
                                href={`tel:${listing.contactPhone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                                title="Call Landlord"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map & District Pin Clusters */}
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500" />
                      <h2 className="font-semibold text-white text-sm">Uganda GPS Map View</h2>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                      OpenStreetMap &bull; flutter_map
                    </span>
                  </div>

                  {/* Visual Map Simulator */}
                  <div className="h-64 rounded-xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between p-3">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                    
                    {/* Simulated Map Pins across Uganda */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between text-[11px]">
                      <div className="flex justify-between items-start">
                        {/* Gulu Pin */}
                        <div className="bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 flex items-center gap-1 shadow">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          <span>Gulu (1)</span>
                        </div>
                        {/* Mbale Pin */}
                        <div className="bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 flex items-center gap-1 shadow">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span>Jinja/Mbale (2)</span>
                        </div>
                      </div>

                      {/* Central Kampala Cluster (Zoomed) */}
                      <div className="self-center bg-amber-500/20 border border-amber-500/50 p-2 rounded-xl text-center shadow-lg">
                        <div className="text-amber-400 font-bold flex items-center justify-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Greater Kampala &amp; Wakiso</span>
                        </div>
                        <span className="text-[10px] text-slate-300">4 active listings • GPS Coords: 0.3476° N, 32.5825° E</span>
                      </div>

                      <div className="flex justify-between items-end">
                        {/* Mbarara */}
                        <div className="bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 flex items-center gap-1 shadow">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span>Mbarara (1)</span>
                        </div>
                        {/* Entebbe */}
                        <div className="bg-slate-900/90 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 flex items-center gap-1 shadow">
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span>Entebbe (1)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Designed for areas with no formal street addresses: every listing records GPS coordinates, village/zone, and landmark descriptions so visitors can navigate directly.
                  </p>
                </div>

                {/* Handymen Directory */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-blue-400" />
                      <h2 className="font-semibold text-white text-sm">Verified Local Handymen</h2>
                    </div>
                    <span className="text-[10px] text-amber-400">Uganda Directory</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">Eng. Kato Joseph - Plumber</div>
                        <div className="text-[11px] text-slate-400">NWSC pipes, water heaters, 5000L tanks</div>
                      </div>
                      <a href="tel:+256772000111" className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium">Call</a>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-white">Ssekatawa Electric &amp; Solar</div>
                        <div className="text-[11px] text-slate-400">Umeme Yaka installation, inverter backup</div>
                      </div>
                      <a href="tel:+256701222333" className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-medium">Call</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Listing Detail Modal */}
        {selectedListing && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold">
                    {selectedListing.type} &bull; For {selectedListing.listingType}
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{selectedListing.title}</h2>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    {selectedListing.village}, {selectedListing.division}, {selectedListing.district} (Near {selectedListing.landmark})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedListing(null)}
                  className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {!lowDataMode && (
                <div className="aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <img src={selectedListing.imageUrl} alt={selectedListing.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Asking Price:</div>
                  <div className="text-xl font-bold text-amber-400">{formatUGX(selectedListing.priceUGX)} {selectedListing.period === 'month' ? '/ month' : ''}</div>
                </div>
                {selectedListing.titleType && (
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Land Title:</div>
                    <div className="text-sm font-semibold text-emerald-400">{selectedListing.titleType} Title</div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Description</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{selectedListing.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Key Amenities</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedListing.amenities.map((a, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60">
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <a
                  href={`https://wa.me/${selectedListing.contactWhatsApp}?text=${encodeURIComponent(`Hello, I saw your listing for "${selectedListing.title}" on rize. I would like to schedule a site inspection.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat on WhatsApp
                </a>
                <a
                  href={`tel:${selectedListing.contactPhone}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call Landlord
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. BUSINESS PORTAL (Role-Based)                                */}
        {/* ============================================================== */}
        {activeTab === 'business' && (
          <div className="space-y-6">
            {/* Role Switcher Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Logged in via Supabase Auth + RLS</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Active Role: <span className="text-amber-400">{userRole}</span></span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">Row Level Security Active</span>
                  </div>
                </div>
              </div>

              {/* Role Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Switch Role:</span>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                >
                  <option value="Owner">Owner (Full Portfolio)</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Agent">Agent (Listings &amp; Commissions)</option>
                  <option value="Accountant">Accountant (Ledger &amp; MoMo)</option>
                  <option value="Caretaker">Caretaker (Units &amp; Maintenance)</option>
                  <option value="Tenant">Tenant (Unit &amp; MoMo Receipts)</option>
                  <option value="Admin">Admin (System Full Access)</option>
                </select>
              </div>
            </div>

            {/* Business Sub-Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setBusinessSubtab('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  businessSubtab === 'dashboard' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Dashboard Overview
              </button>
              <button
                onClick={() => setBusinessSubtab('properties')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  businessSubtab === 'properties' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Properties &amp; Multi-Image Gallery
              </button>
              <button
                onClick={() => setBusinessSubtab('rent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  businessSubtab === 'rent' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Rent &amp; MoMo Receipts
              </button>
              <button
                onClick={() => setBusinessSubtab('charts')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  businessSubtab === 'charts' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Charts &amp; Analytics (fl_chart)
              </button>
              <button
                onClick={() => setBusinessSubtab('maintenance')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  businessSubtab === 'maintenance' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Maintenance &amp; Inspections
              </button>
            </div>

            {/* SUBTAB CONTENT */}

            {/* A. DASHBOARD */}
            {businessSubtab === 'dashboard' && (
              <div className="space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Rent Collected (Oct)</span>
                      <span className="flex items-center text-emerald-400 font-semibold">
                        <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
                      </span>
                    </div>
                    <div className="text-xl font-bold text-white">{formatUGX(2600000)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Expected: {formatUGX(3650000)}</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Total Arrears (Debts)</span>
                      <span className="flex items-center text-red-400 font-semibold">
                        <ArrowDownRight className="w-3.5 h-3.5" /> 2 Units
                      </span>
                    </div>
                    <div className="text-xl font-bold text-red-400">{formatUGX(1050000)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Grace Namata &amp; Brian Kintu</div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Portfolio Occupancy</span>
                      <span className="text-amber-400 font-semibold">85.7%</span>
                    </div>
                    <div className="text-xl font-bold text-white">6 / 7 Units</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[85.7%]" />
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>Maintenance Costs</span>
                      <span className="text-slate-400">YTD</span>
                    </div>
                    <div className="text-xl font-bold text-white">{formatUGX(480000)}</div>
                    <div className="text-[11px] text-slate-500 mt-1">Plumbing &amp; Yaka repairs</div>
                  </div>
                </div>

                {/* Quick MoMo Actions */}
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-amber-400" />
                      Two (2) Tenant MoMo Payments Pending Verification
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Tenants paid via MTN MoMo and Airtel Money and submitted their transaction IDs. Confirm to issue auto WhatsApp receipts.
                    </p>
                  </div>
                  <button
                    onClick={() => setBusinessSubtab('rent')}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Review Pending MoMo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* B. PROPERTIES & THUMBNAIL GALLERY */}
            {businessSubtab === 'properties' && (
              <div className="space-y-6">
                {/* Header & Stats */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      Property Management &amp; Image Galleries
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage property blocks, multi-angle photos (compound, interior, gate, title deeds), and associated rental units.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const newProp: Property = {
                        id: `prop-${Date.now()}`,
                        title: 'Kira Sunrise Courts',
                        propertyType: 'Apartments',
                        district: 'Wakiso',
                        division: 'Kira Municipality',
                        village: 'Mulawa',
                        landmark: 'Near Kira Police Station',
                        titleType: 'Mailo',
                        images: [
                          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=70',
                          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=70'
                        ],
                        totalUnits: 2,
                        occupiedUnits: 1,
                        monthlyExpectedUGX: 2400000,
                        caretakerName: 'Mugisha Ronald',
                        caretakerPhone: '+256 782 112233',
                        description: 'Newly constructed block of two flats with individual Yaka meters.'
                      };
                      setProperties(prev => [newProp, ...prev]);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-4 h-4" /> Add New Property
                  </button>
                </div>

                {/* Property Cards List with Thumbnail Galleries */}
                <div className="grid grid-cols-1 gap-6">
                  {properties.map(property => {
                    const propertyUnits = units.filter(u => u.property === property.title);
                    return (
                      <div
                        key={property.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 hover:border-slate-700/80 transition-colors"
                      >
                        {/* Top Info Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-white text-base">{property.title}</h4>
                              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                                {property.propertyType}
                              </span>
                              {property.titleType && (
                                <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-blue-600/30 text-blue-300 border border-blue-500/40">
                                  {property.titleType} Title
                                </span>
                              )}
                              <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-400">
                                {property.occupiedUnits}/{property.totalUnits} Units Occupied
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{property.village}, {property.division}, {property.district}</span>
                              <span>&bull;</span>
                              <span className="text-slate-500">Near {property.landmark}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setManagingImagesProperty(property);
                                setNewImageUrl('');
                                setUrlError('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Add or remove image URLs for this property"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Manage Photos ({property.images.length})</span>
                            </button>
                            <button
                              onClick={() => setPropertyToDelete(property)}
                              className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                              title="Delete this property from portfolio"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                            <div className="text-right pl-3 border-l border-slate-800">
                              <div className="text-[10px] text-slate-500 uppercase">Monthly Income</div>
                              <div className="text-sm font-bold text-amber-400">{formatUGX(property.monthlyExpectedUGX)}</div>
                            </div>
                          </div>
                        </div>

                        {/* THUMBNAIL GALLERY SECTION */}
                        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                              Photo Gallery ({property.images.length} {property.images.length === 1 ? 'image' : 'images'})
                            </span>
                            <span className="text-[11px] text-slate-500">Click any thumbnail to expand &amp; inspect</span>
                          </div>

                          {/* Thumbnails Row */}
                          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                            {property.images.map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                onClick={() => setActiveGallery({ property, currentIndex: imgIdx })}
                                className="relative group shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-lg overflow-hidden border-2 border-slate-800 hover:border-amber-400 cursor-pointer transition-all shadow-md"
                              >
                                {!lowDataMode ? (
                                  <img
                                    src={imgUrl}
                                    alt={`${property.title} photo ${imgIdx + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 text-[10px]">
                                    <ImageIcon className="w-4 h-4 mb-0.5" />
                                    <span>#{imgIdx + 1}</span>
                                  </div>
                                )}

                                {/* Primary Badge on First Image */}
                                {imgIdx === 0 && (
                                  <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 font-bold text-[9px] px-1 rounded shadow">
                                    Cover
                                  </span>
                                )}

                                {/* Hover Overlay with Zoom Icon */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <Maximize2 className="w-4 h-4 text-white drop-shadow" />
                                </div>
                              </div>
                            ))}

                            {/* Add More Photos Quick Button */}
                            <button
                              onClick={() => {
                                setManagingImagesProperty(property);
                                setNewImageUrl('');
                                setUrlError('');
                              }}
                              className="shrink-0 w-24 h-20 sm:w-28 sm:h-22 rounded-lg border-2 border-dashed border-slate-800 hover:border-amber-400/80 bg-slate-900/50 hover:bg-slate-900 flex flex-col items-center justify-center text-slate-400 hover:text-amber-400 gap-1 text-[11px] font-medium transition-colors"
                            >
                              <PlusCircle className="w-5 h-5 text-amber-500" />
                              <span>Add Photo</span>
                            </button>
                          </div>
                        </div>

                        {/* Units in this property */}
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-slate-300">Units in {property.title}:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {propertyUnits.map(unit => (
                              <div
                                key={unit.id}
                                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-col justify-between"
                              >
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-white text-xs">{unit.code}</span>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                    unit.status === 'Occupied' ? 'bg-emerald-500/20 text-emerald-400' :
                                    unit.status === 'Vacant' ? 'bg-amber-500/20 text-amber-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {unit.status}
                                  </span>
                                </div>
                                <div className="mt-2 text-[11px]">
                                  <div className="text-amber-400 font-semibold">{formatUGX(unit.monthlyRentUGX)}/mo</div>
                                  <div className="text-slate-400 truncate mt-0.5">
                                    {unit.currentTenant ? unit.currentTenant : <span className="text-slate-500 italic">No tenant</span>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer details */}
                        <div className="text-xs text-slate-400 border-t border-slate-800/80 pt-3 flex flex-wrap items-center justify-between gap-2">
                          <div>
                            Caretaker: <strong className="text-white">{property.caretakerName}</strong> ({property.caretakerPhone})
                          </div>
                          <p className="text-[11px] text-slate-500 max-w-xl truncate">
                            {property.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. RENT & MOMO RECEIPTS */}
            {businessSubtab === 'rent' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">Rent Submissions &amp; Numbered Receipts</h3>
                    <p className="text-xs text-slate-400">MTN MoMo, Airtel Money, Bank &amp; Cash payments with Uganda VAT/stamp details.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {payments.map(pay => (
                    <div key={pay.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-amber-400 font-bold">{pay.receiptNumber}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            pay.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {pay.status}
                          </span>
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                            {pay.method}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-white">
                          {pay.tenantName} &bull; <span className="text-slate-400 font-normal">{pay.unitCode} ({pay.propertyTitle})</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>Amount: <strong className="text-white">{formatUGX(pay.amountUGX)}</strong></span>
                          <span>TxID: <code className="text-amber-300 font-mono text-[11px]">{pay.transactionId}</code></span>
                          <span>Date: {pay.paymentDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full md:w-auto">
                        {pay.status === 'Pending Verification' && (
                          <button
                            onClick={() => handleConfirmPayment(pay.id)}
                            className="flex-1 md:flex-none px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirm Payment
                          </button>
                        )}
                        <button
                          onClick={() => setViewingReceipt(pay)}
                          className="flex-1 md:flex-none px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center justify-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5 text-amber-400" />
                          View / Share PDF Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. CHARTS & ANALYTICS (fl_chart simulator) */}
            {businessSubtab === 'charts' && (
              <div className="space-y-6">
                {/* Chart Controls Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-white text-sm">Interactive Charts &amp; Analytics (fl_chart engine)</h3>
                      <p className="text-xs text-slate-400">One-tap chart type switching, drill down, and WhatsApp report export.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Switch chart type */}
                    <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                      <button
                        onClick={() => setChartType('bar')}
                        className={`px-2.5 py-1 rounded-lg ${chartType === 'bar' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                      >
                        Bar
                      </button>
                      <button
                        onClick={() => setChartType('line')}
                        className={`px-2.5 py-1 rounded-lg ${chartType === 'line' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                      >
                        Line
                      </button>
                      <button
                        onClick={() => setChartType('donut')}
                        className={`px-2.5 py-1 rounded-lg ${chartType === 'donut' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                      >
                        Donut
                      </button>
                    </div>

                    {/* Period filter */}
                    <select
                      value={chartPeriod}
                      onChange={(e) => setChartPeriod(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                    >
                      <option value="thisMonth">October 2026</option>
                      <option value="lastMonth">September 2026</option>
                      <option value="thisYear">Full Year 2026</option>
                    </select>

                    <button
                      onClick={() => alert('PDF report generated! Ready to attach to WhatsApp message.')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" /> Export PDF
                    </button>
                  </div>
                </div>

                {/* 2 Chart Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Chart 1: Rent Collected vs Expected */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">Monthly Rent: Collected vs Expected</h4>
                        <p className="text-xs text-slate-400">Figures in Millions UGX</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                        71% Collection Rate
                      </span>
                    </div>

                    {/* Visual Bar/Line Chart Container */}
                    <div className="h-48 flex items-end justify-between gap-4 pt-6 px-2 border-b border-slate-800">
                      {[
                        { month: 'Jun', expected: 3.65, collected: 3.4 },
                        { month: 'Jul', expected: 3.65, collected: 3.65 },
                        { month: 'Aug', expected: 3.65, collected: 3.2 },
                        { month: 'Sep', expected: 3.65, collected: 3.5 },
                        { month: 'Oct', expected: 3.65, collected: 2.6 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <div className="flex items-end gap-1.5 w-full justify-center h-full">
                            {/* Expected Bar */}
                            <div
                              style={{ height: `${(item.expected / 4.0) * 100}%` }}
                              className="w-3 sm:w-5 bg-slate-700 rounded-t-sm group-hover:bg-slate-600 transition-colors"
                              title={`Expected: UGX ${item.expected}M`}
                            />
                            {/* Collected Bar */}
                            <div
                              style={{ height: `${(item.collected / 4.0) * 100}%` }}
                              className="w-3 sm:w-5 bg-amber-500 rounded-t-sm group-hover:bg-amber-400 transition-colors"
                              title={`Collected: UGX ${item.collected}M`}
                            />
                          </div>
                          <span className="text-[11px] text-slate-400">{item.month}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-slate-700" />
                        <span>Expected Rent</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-amber-500" />
                        <span>Collected Rent (MoMo/Airtel/Cash)</span>
                      </div>
                    </div>
                  </div>

                  {/* Chart 2: Expenses by Category */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-sm">Expenses Breakdown (Oct 2026)</h4>
                        <p className="text-xs text-slate-400">Total: {formatUGX(820000)}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold">
                        4 Categories
                      </span>
                    </div>

                    {/* Donut representation */}
                    <div className="space-y-3 pt-2">
                      {[
                        { label: 'Security Guard & Gatekeeper', amount: 350000, color: 'bg-amber-500', pct: 42.6 },
                        { label: 'Compound Cleaning & Garbage', amount: 180000, color: 'bg-emerald-500', pct: 21.9 },
                        { label: 'Umeme Common Lighting & Repairs', amount: 150000, color: 'bg-blue-500', pct: 18.3 },
                        { label: 'NWSC Water Sewage Charge', amount: 140000, color: 'bg-purple-500', pct: 17.2 },
                      ].map((cat, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-300 flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                              {cat.label}
                            </span>
                            <span className="text-white font-medium">{formatUGX(cat.amount)} ({cat.pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className={`${cat.color} h-full`} style={{ width: `${cat.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* E. MAINTENANCE */}
            {businessSubtab === 'maintenance' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white text-sm">Tenant Maintenance Requests &amp; Handyman Assignments</h3>
                    <p className="text-xs text-slate-400">Track plumbing, Umeme Yaka issues, roof leaks and inspection photos.</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Log New Issue
                  </button>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Water Tap Leakage in Bathroom</span>
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-semibold">Urgent</span>
                        <span className="text-[10px] text-slate-400">Unit A-02 &bull; Namata Grace</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        NWSC pressure caused connector burst under kitchen sink. Water shut off at local stopcock.
                      </p>
                      <div className="text-[11px] text-blue-400 font-medium">
                        Assigned to: Eng. Kato Joseph (Plumber) &bull; Estimated: UGX 45,000
                      </div>
                    </div>
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium">
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* LIGHTBOX GALLERY MODAL (Expand thumbnail to view full photo)   */}
        {/* ============================================================== */}
        {activeGallery && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full flex flex-col items-center">
              {/* Close Button */}
              <button
                onClick={() => setActiveGallery(null)}
                className="absolute -top-10 right-0 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 transition-colors"
                title="Close Lightbox"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Counter */}
              <div className="w-full flex items-center justify-between text-white text-xs mb-3 px-1">
                <div>
                  <span className="font-bold text-amber-400">{activeGallery.property.title}</span>
                  <span className="text-slate-400 ml-2">Photo {activeGallery.currentIndex + 1} of {activeGallery.property.images.length}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Use arrows to browse multi-angle property photos
                </div>
              </div>

              {/* Main Expanded Image */}
              <div className="relative w-full aspect-video sm:aspect-[16/9] max-h-[70vh] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                <img
                  src={activeGallery.property.images[activeGallery.currentIndex]}
                  alt={`${activeGallery.property.title} large view`}
                  className="w-full h-full object-contain"
                />

                {/* Left Arrow */}
                {activeGallery.property.images.length > 1 && (
                  <button
                    onClick={() => setActiveGallery({
                      ...activeGallery,
                      currentIndex: (activeGallery.currentIndex - 1 + activeGallery.property.images.length) % activeGallery.property.images.length
                    })}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}

                {/* Right Arrow */}
                {activeGallery.property.images.length > 1 && (
                  <button
                    onClick={() => setActiveGallery({
                      ...activeGallery,
                      currentIndex: (activeGallery.currentIndex + 1) % activeGallery.property.images.length
                    })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Miniature Thumbnails strip in Lightbox */}
              <div className="flex gap-2 mt-3 max-w-full overflow-x-auto p-1">
                {activeGallery.property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveGallery({ ...activeGallery, currentIndex: i })}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      activeGallery.currentIndex === i ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MANAGE PROPERTY IMAGE URLS MODAL                               */}
        {/* ============================================================== */}
        {managingImagesProperty && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl relative">
              <button
                onClick={() => setManagingImagesProperty(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Associate Image URLs</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Property: <strong className="text-amber-400">{managingImagesProperty.title}</strong> &bull; {managingImagesProperty.village}, {managingImagesProperty.district}
                </p>
              </div>

              {/* Add New Image URL Input */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="text-xs font-semibold text-slate-300 block">
                  Add New Image URL (CDN, Supabase Storage bucket, or web image):
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/property-photo.jpg"
                    value={newImageUrl}
                    onChange={(e) => {
                      setNewImageUrl(e.target.value);
                      setUrlError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImageUrl(managingImagesProperty.id, newImageUrl);
                      }
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleAddImageUrl(managingImagesProperty.id, newImageUrl)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {urlError && <p className="text-xs text-red-400">{urlError}</p>}

                {/* Quick Presets for Demo / Testing */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500">Quick Presets:</span>
                  <button
                    onClick={() => handleAddImageUrl(managingImagesProperty.id, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=70')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 border border-slate-700"
                  >
                    + Modern Exterior
                  </button>
                  <button
                    onClick={() => handleAddImageUrl(managingImagesProperty.id, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=70')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 border border-slate-700"
                  >
                    + Living Room
                  </button>
                  <button
                    onClick={() => handleAddImageUrl(managingImagesProperty.id, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=70')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 border border-slate-700"
                  >
                    + Tiled Bathroom
                  </button>
                  <button
                    onClick={() => handleAddImageUrl(managingImagesProperty.id, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=70')}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-300 border border-slate-700"
                  >
                    + Paved Compound
                  </button>
                </div>
              </div>

              {/* Current Associated Images List */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Current Images ({managingImagesProperty.images.length})
                </h4>

                {managingImagesProperty.images.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-500">
                    No images associated yet. Add an image URL above.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {managingImagesProperty.images.map((url, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                            <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white">Photo #{idx + 1}</span>
                              {idx === 0 && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                                  Primary Cover
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono truncate max-w-sm mt-0.5">
                              {url}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {idx !== 0 && (
                            <button
                              onClick={() => handleSetPrimaryImage(managingImagesProperty.id, idx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                              title="Set as primary cover image"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            onClick={() => handleRemoveImageUrl(managingImagesProperty.id, idx)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Done button */}
              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setManagingImagesProperty(null)}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View / Share Receipt Modal */}
        {viewingReceipt && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative border-4 border-amber-500">
              <button
                onClick={() => setViewingReceipt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-lg font-bold"
              >
                ✕
              </button>

              {/* Official Receipt Header */}
              <div className="text-center border-b pb-3">
                <div className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-sm mb-1 tracking-wider uppercase">
                  rize Official Rent Receipt
                </div>
                <div className="text-xs text-slate-500 font-mono">Receipt No: <strong>{viewingReceipt.receiptNumber}</strong></div>
                <div className="text-[11px] text-slate-400">Republic of Uganda &bull; Electronic Property Voucher</div>
              </div>

              {/* Receipt Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Tenant Name:</span>
                  <span className="font-bold text-slate-900">{viewingReceipt.tenantName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Unit / Property:</span>
                  <span className="font-semibold text-slate-900">{viewingReceipt.unitCode} ({viewingReceipt.propertyTitle})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Payment Period:</span>
                  <span className="font-semibold text-slate-900">{viewingReceipt.forMonth}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Payment Channel:</span>
                  <span className="font-bold text-amber-600">{viewingReceipt.method}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono text-[11px] font-bold text-slate-800">{viewingReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed">
                  <span className="text-slate-500">Date Paid:</span>
                  <span className="font-medium text-slate-800">{viewingReceipt.paymentDate}</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 mt-2 flex justify-between items-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Amount Paid (UGX)</div>
                    <div className="text-xl font-black text-slate-900">{formatUGX(viewingReceipt.amountUGX)}</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase">
                      CONFIRMED
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`*RIZE RENT RECEIPT*\nReceipt No: ${viewingReceipt.receiptNumber}\nTenant: ${viewingReceipt.tenantName}\nUnit: ${viewingReceipt.unitCode}\nAmount Paid: ${formatUGX(viewingReceipt.amountUGX)}\nMethod: ${viewingReceipt.method} (${viewingReceipt.transactionId})\nPeriod: ${viewingReceipt.forMonth}\nStatus: Confirmed. Thank you for paying on time!`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                >
                  <MessageSquare className="w-4 h-4" /> Share on WhatsApp
                </a>
                <button
                  onClick={() => alert('PDF receipt downloaded to device storage.')}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-4 h-4" /> Save PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* DELETE PROPERTY CONFIRMATION MODAL                             */}
        {/* ============================================================== */}
        {propertyToDelete && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-white">Delete Property Confirmation</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to remove <strong className="text-white">{propertyToDelete.title}</strong> from your management portfolio?
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
                <div className="flex justify-between">
                  <span>Location:</span>
                  <span className="text-slate-200 font-medium">{propertyToDelete.village}, {propertyToDelete.district}</span>
                </div>
                <div className="flex justify-between">
                  <span>Units:</span>
                  <span className="text-slate-200 font-medium">{propertyToDelete.totalUnits} Units ({propertyToDelete.occupiedUnits} Occupied)</span>
                </div>
                <div className="flex justify-between">
                  <span>Photos:</span>
                  <span className="text-slate-200 font-medium">{propertyToDelete.images.length} gallery images</span>
                </div>
                <p className="text-[11px] text-red-400/90 pt-1.5 border-t border-slate-800/80 font-medium">
                  ⚠️ This action will remove the property from your portfolio state.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setPropertyToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteProperty}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-red-900/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Delete Property</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SHARE TESTING URL MODAL (Direct Phone / WhatsApp Testing)      */}
        {/* ============================================================== */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
              <button
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Share Testing URL</h3>
                  <p className="text-xs text-slate-400">Test Maka UG directly on your Android phone or share with your team</p>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Direct Live Testing Link:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://ais-pre-vrg3kekmtkqbvxujubvpgg-189978757144.europe-west2.run.app"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://ais-pre-vrg3kekmtkqbvxujubvpgg-189978757144.europe-west2.run.app");
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <h4 className="font-semibold text-white">How to test on your Android Phone:</h4>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 leading-relaxed text-[11px]">
                  <li>Send this link to your phone using the WhatsApp button below.</li>
                  <li>Open the link on your Android phone in <strong>Google Chrome</strong> or <strong>Brave</strong>.</li>
                  <li>In Chrome, tap the 3 vertical dots (top right menu) and tap <strong>&ldquo;Add to Home screen&rdquo;</strong> (or &ldquo;Install app&rdquo;).</li>
                  <li>The app will launch full screen with an app icon on your phone just like an installed Android app!</li>
                </ol>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent("Test the rize Real Estate & Property Management app here: https://ais-pre-vrg3kekmtkqbvxujubvpgg-189978757144.europe-west2.run.app")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Link to WhatsApp</span>
                </a>
                <a
                  href="https://ais-pre-vrg3kekmtkqbvxujubvpgg-189978757144.europe-west2.run.app"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open New Tab</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-emerald-400/40 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. REACT NATIVE (EXPO) STEP-BY-STEP COMPANION                  */}
        {/* ============================================================== */}
        {activeTab === 'companion' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">React Native (Expo) Mobile Developer Curriculum</h2>
                  <p className="text-xs text-slate-400">Zero-budget, zero-Flutter setup. Test on your real Android phone in 60 seconds with Expo Go.</p>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pt-2">
                {[
                  { step: 'Step 0', title: 'React Native Concepts', status: 'Completed ✓' },
                  { step: 'Step 1', title: 'Node.js & Expo Go App', status: 'ACTIVE NOW' },
                  { step: 'Step 2', title: 'Supabase & SQL Schema', status: 'Next Step' },
                  { step: 'Step 3', title: 'Create App & Scan QR', status: 'Upcoming' },
                  { step: 'Step 4', title: 'Build Modules (Auth -> Rent)', status: 'Upcoming' },
                  { step: 'Step 5', title: 'EAS Free Cloud APK Build', status: 'Upcoming' },
                ].map((s, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border ${idx === 1 ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 ring-2 ring-amber-500/30' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
                    <div className="text-[10px] uppercase font-bold tracking-wider">{s.step}</div>
                    <div className="text-xs font-semibold text-white mt-0.5">{s.title}</div>
                    <div className="text-[10px] mt-1 text-slate-500">{s.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why React Native + Expo is easier on Windows */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Why React Native (Expo) is 10x Easier for You:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    No Heavy Flutter SDK
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    You don’t need to download gigabytes of Android Studio, configure PATH variables, or debug Gradle build scripts on Windows.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Instant Expo Go on Phone
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Install the free &ldquo;Expo Go&rdquo; app from Google Play Store on your Android phone, scan the QR code, and your app runs live on your phone instantly.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Free Cloud APK Builds
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Expo Application Services (EAS) builds your standalone Android APK in the cloud for free—ready to share on WhatsApp!
                  </p>
                </div>
              </div>
            </div>

            {/* Step 1 React Native Setup Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Laptop className="w-4 h-4 text-blue-400" />
                Step 1 Guide: Setup with Node.js &amp; Expo Go
              </h3>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300 leading-relaxed font-sans">
                <p><strong>1. Install Node.js LTS on Windows:</strong> Go to <code>https://nodejs.org</code> and download the <strong>LTS (Recommended for Most Users)</strong> Windows installer. Double click and click Next until installed.</p>
                <p><strong>2. Install Expo Go on your Android Phone:</strong> Open the <strong>Google Play Store</strong> on your phone, search for <strong>Expo Go</strong>, and tap Install.</p>
                <p><strong>3. Verify in Command Prompt:</strong> Open Windows Command Prompt (press Windows key, type <code>cmd</code>) and run:
                  <code className="block mt-1 p-2 bg-slate-900 text-emerald-400 rounded-lg font-mono">node -v && npm -v</code>
                </p>
              </div>
            </div>

            {/* package.json dependencies preview */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-sm">Free React Native Dependencies (package.json)</h3>
                  <p className="text-xs text-slate-400">All 100% open-source, no billing or credit cards needed.</p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`{
  "dependencies": {
    "expo": "~52.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "@supabase/supabase-js": "^2.48.0",
    "expo-print": "~14.0.2",
    "expo-sharing": "~13.0.1",
    "expo-image-picker": "~16.0.4",
    "react-native-maps": "1.18.0",
    "react-native-chart-kit": "^6.12.0",
    "react-native-svg": "15.8.0",
    "lucide-react-native": "^0.475.0",
    "intl": "^1.2.5"
  }
}`);
                    setCopiedReceipt('package');
                    setTimeout(() => setCopiedReceipt(null), 2000);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  {copiedReceipt === 'package' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedReceipt === 'package' ? 'Copied!' : 'Copy package.json'}</span>
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto">
                <pre>{`"dependencies": {
  "expo": "~52.0.0",                 // Free Expo framework
  "@supabase/supabase-js": "^2.48.0",// Free PostgreSQL, Auth & Storage
  "react-native-maps": "1.18.0",     // OpenStreetMap pins across Uganda
  "react-native-chart-kit": "^6.12.0", // Rent collection & expense charts
  "react-native-svg": "15.8.0",       // SVG engine for charts
  "expo-print": "~14.0.2",           // PDF rent receipts generator
  "expo-sharing": "~13.0.1",         // 1-tap share PDF receipt to WhatsApp
  "expo-image-picker": "~16.0.4",     // Camera / gallery photo upload
  "lucide-react-native": "^0.475.0", // Clean UI icons
  "intl": "^1.2.5"                   // UGX currency formatting
}`}</pre>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. SUPABASE FULL SQL SCHEMA & RLS                               */}
        {/* ============================================================== */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-xl font-bold text-white">Full Uganda Real Estate Supabase SQL Schema</h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Includes multi-image array column (<code>images TEXT[]</code>) and image table support with Row Level Security (RLS).
                </p>
              </div>

              <button
                onClick={() => {
                  const sqlContent = `-- ============================================================
-- MAKA UGANDA: REAL ESTATE & PROPERTY MANAGEMENT SCHEMA
-- Free Tier Compatible: Supabase Postgres + RLS
-- ============================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM (
  'Owner', 'Property Manager', 'Agent', 'Accountant', 'Caretaker', 'Tenant', 'Service Provider', 'Admin'
);

CREATE TYPE listing_category AS ENUM (
  'Apartment', 'Standalone', 'Rental', 'Commercial', 'Land', 'Hostel'
);

CREATE TYPE land_title_type AS ENUM (
  'Mailo', 'Freehold', 'Leasehold', 'Customary'
);

CREATE TYPE payment_channel AS ENUM (
  'MTN MoMo', 'Airtel Money', 'Bank', 'Cash'
);

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  nin TEXT, -- Uganda National ID Number (NIN)
  role user_role NOT NULL DEFAULT 'Tenant',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties Table (Includes Multi-Image URLs array)
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  property_type TEXT NOT NULL,
  district TEXT NOT NULL,
  division_parish TEXT NOT NULL,
  village_zone TEXT NOT NULL,
  landmark TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  title_type land_title_type,
  images TEXT[] DEFAULT '{}', -- Array of image URLs (compound, gates, interiors, title scans)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Units Table
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_code TEXT NOT NULL,
  monthly_rent_ugx BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Vacant',
  current_tenant_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rent Payments (MoMo & Airtel Money Focus)
CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES profiles(id),
  amount_ugx BIGINT NOT NULL,
  payment_method payment_channel NOT NULL,
  transaction_id TEXT NOT NULL,
  for_month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Verification',
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
CREATE POLICY "Public read for listings and properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Tenants see own payments" ON rent_payments FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Owners see all payments on their units" ON rent_payments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM units u 
    JOIN properties p ON u.property_id = p.id 
    WHERE u.id = rent_payments.unit_id AND p.owner_id = auth.uid()
  )
);`;
                  navigator.clipboard.writeText(sqlContent);
                  setCopiedReceipt('sql');
                  setTimeout(() => setCopiedReceipt(null), 2000);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow"
              >
                {copiedReceipt === 'sql' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedReceipt === 'sql' ? 'Copied Full SQL!' : 'Copy Supabase SQL Script'}</span>
              </button>
            </div>

            {/* Code Display */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 overflow-hidden">
              <div className="bg-slate-950 p-4 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed border border-slate-800 max-h-[500px]">
                <pre>{`-- ============================================================
-- MAKA UGANDA: REAL ESTATE & PROPERTY MANAGEMENT SCHEMA
-- Free Tier Compatible: Supabase Postgres + RLS
-- ============================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM (
  'Owner', 'Property Manager', 'Agent', 'Accountant', 'Caretaker', 'Tenant', 'Service Provider', 'Admin'
);

CREATE TYPE listing_category AS ENUM (
  'Apartment', 'Standalone', 'Rental', 'Commercial', 'Land', 'Hostel'
);

CREATE TYPE land_title_type AS ENUM (
  'Mailo', 'Freehold', 'Leasehold', 'Customary'
);

CREATE TYPE payment_channel AS ENUM (
  'MTN MoMo', 'Airtel Money', 'Bank', 'Cash'
);

-- 2. User Profiles Table (Linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  nin TEXT, -- Uganda National ID Number (NIN)
  role user_role NOT NULL DEFAULT 'Tenant',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Properties Table (Includes Multi-Image URLs array: images TEXT[])
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  property_type TEXT NOT NULL, -- e.g. Apartments, Rental Compound
  district TEXT NOT NULL, -- e.g. Kampala, Wakiso, Mbarara
  division_parish TEXT NOT NULL, -- e.g. Nakawa, Kira
  village_zone TEXT NOT NULL, -- e.g. Ministers Village
  landmark TEXT NOT NULL, -- e.g. Near Quality Supermarket
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  title_type land_title_type,
  images TEXT[] DEFAULT '{}', -- Supports multiple photo URLs per property
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Units Table
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  unit_code TEXT NOT NULL, -- e.g. Unit A-01, Muzigo 03
  monthly_rent_ugx BIGINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Vacant',
  current_tenant_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Rent Payments (MoMo & Airtel Money Focus)
CREATE TABLE rent_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_number TEXT UNIQUE NOT NULL,
  unit_id UUID REFERENCES units(id),
  tenant_id UUID REFERENCES profiles(id),
  amount_ugx BIGINT NOT NULL,
  payment_method payment_channel NOT NULL,
  transaction_id TEXT NOT NULL,
  for_month TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending Verification',
  verified_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_payments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
CREATE POLICY "Public read for listings and properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Tenants see own payments" ON rent_payments FOR SELECT USING (auth.uid() = tenant_id);
CREATE POLICY "Owners see all payments on their units" ON rent_payments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM units u 
    JOIN properties p ON u.property_id = p.id 
    WHERE u.id = rent_payments.unit_id AND p.owner_id = auth.uid()
  )
);`}</pre>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>rize &bull; Real Estate &amp; Property Management Suite &bull; Tailored for Uganda</div>
          <div className="flex items-center gap-3">
            <span>UGX Currency</span>
            <span>&bull;</span>
            <span>MTN &amp; Airtel MoMo</span>
            <span>&bull;</span>
            <span>OpenStreetMap</span>
            <span>&bull;</span>
            <span>Supabase Free Tier</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

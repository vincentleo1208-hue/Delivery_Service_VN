'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Address, PackageDetails, RateQuote, ContactInfo } from '@/types';

// Mock data for cities (in production, this would come from an API)
const CITIES: Record<string, { name: string; state?: string; country: string }[]> = {
  US: [
    { name: 'New York', state: 'NY', country: 'US' },
    { name: 'Los Angeles', state: 'CA', country: 'US' },
    { name: 'Chicago', state: 'IL', country: 'US' },
    { name: 'Houston', state: 'TX', country: 'US' },
    { name: 'Miami', state: 'FL', country: 'US' },
  ],
  GB: [
    { name: 'London', country: 'GB' },
    { name: 'Manchester', country: 'GB' },
    { name: 'Birmingham', country: 'GB' },
    { name: 'Edinburgh', country: 'GB' },
  ],
  CA: [
    { name: 'Toronto', state: 'ON', country: 'CA' },
    { name: 'Vancouver', state: 'BC', country: 'CA' },
    { name: 'Montreal', state: 'QC', country: 'CA' },
  ],
  DE: [
    { name: 'Berlin', country: 'DE' },
    { name: 'Munich', country: 'DE' },
    { name: 'Frankfurt', country: 'DE' },
  ],
};

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
];

export default function RatesPage() {
  const [originCountry, setOriginCountry] = useState('US');
  const [originCity, setOriginCity] = useState('');
  const [destinationCountry, setDestinationCountry] = useState('GB');
  const [destinationCity, setDestinationCity] = useState('');
  const [weight, setWeight] = useState<number>(5);
  const [weightUnit, setWeightUnit] = useState<'lb' | 'kg'>('lb');
  const [packages, setPackages] = useState<PackageDetails[]>([
    { weight: 5, weightUnit: 'lb', length: 10, width: 8, height: 6, dimensionUnit: 'in' },
  ]);
  const [isGuaranteed, setIsGuaranteed] = useState(false);
  const [hasFoodSupplements, setHasFoodSupplements] = useState(false);
  const [quotes, setQuotes] = useState<RateQuote[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<RateQuote | null>(null);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({ email: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);

  const addPackage = () => {
    setPackages([...packages, { weight: 1, weightUnit: 'lb' }]);
  };

  const removePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const updatePackage = (index: number, field: keyof PackageDetails, value: any) => {
    const updated = [...packages];
    updated[index] = { ...updated[index], [field]: value };
    setPackages(updated);
  };

  const handleShowRates = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock quotes
    const mockQuotes: RateQuote[] = [
      {
        id: 'fedex-1',
        carrierId: 'fedex',
        carrierName: 'FedEx',
        serviceName: 'International Economy',
        serviceCode: 'FEDEX_IE',
        baseRate: 45.00,
        surcharges: [{ name: 'Fuel Surcharge', amount: 6.75 }],
        totalCost: 51.75,
        currency: 'USD',
        estimatedDeliveryDate: '2024-05-15',
        transitDays: 5,
        reliabilityScore: 0.95,
        directLink: 'https://www.fedex.com/rates',
      },
      {
        id: 'ups-1',
        carrierId: 'ups',
        carrierName: 'UPS',
        serviceName: 'Worldwide Expedited',
        serviceCode: 'UPS_WE',
        baseRate: 52.00,
        surcharges: [{ name: 'Fuel Surcharge', amount: 7.80 }],
        totalCost: 59.80,
        currency: 'USD',
        estimatedDeliveryDate: '2024-05-14',
        transitDays: 4,
        reliabilityScore: 0.94,
        directLink: 'https://www.ups.com/rates',
      },
      {
        id: 'dhl-1',
        carrierId: 'dhl',
        carrierName: 'DHL',
        serviceName: 'Express Worldwide',
        serviceCode: 'DHL_EW',
        baseRate: 58.00,
        surcharges: [{ name: 'Fuel Surcharge', amount: 8.70 }],
        totalCost: 66.70,
        currency: 'USD',
        estimatedDeliveryDate: '2024-05-13',
        transitDays: 3,
        reliabilityScore: 0.96,
        directLink: 'https://www.dhl.com/rates',
      },
      {
        id: 'sc-consolidated-economy',
        carrierId: 'shipcompare-consolidated',
        carrierName: 'ShipCompare Open Router',
        serviceName: 'Open Router Economy',
        serviceCode: 'OPEN_ROUTER_ECONOMY',
        baseRate: 22.50,
        surcharges: [{ name: 'Consolidation Handling', amount: 2.00 }],
        totalCost: 24.50,
        currency: 'USD',
        estimatedDeliveryDate: '2024-05-18',
        transitDays: 8,
        reliabilityScore: 0.92,
      },
      {
        id: 'sc-consolidated-standard',
        carrierId: 'shipcompare-consolidated',
        carrierName: 'ShipCompare Open Router',
        serviceName: 'Open Router Standard',
        serviceCode: 'OPEN_ROUTER_STANDARD',
        baseRate: 28.00,
        surcharges: [{ name: 'Consolidation Handling', amount: 2.00 }],
        totalCost: 30.00,
        currency: 'USD',
        estimatedDeliveryDate: '2024-05-15',
        transitDays: 6,
        reliabilityScore: 0.94,
      },
    ];
    
    setQuotes(mockQuotes);
    setIsLoading(false);
  };

  const handleOpenRouterSelect = (quote: RateQuote) => {
    setSelectedQuote(quote);
    setShowContactForm(true);
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
  };

  const originCities = CITIES[originCountry] || [];
  const destinationCities = CITIES[destinationCountry] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            ShipCompare Pro
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/open-router-info" className="text-muted-foreground hover:text-primary transition-colors">
              How Open Router Works
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
          Compare and Choose the Available Rates
        </h1>

        {/* Input Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Shipment Details</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Origin */}
            <div>
              <label className="block text-sm font-medium mb-2">Origin Country *</label>
              <select
                value={originCountry}
                onChange={(e) => {
                  setOriginCountry(e.target.value);
                  setOriginCity('');
                }}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium mb-2">Destination Country *</label>
              <select
                value={destinationCountry}
                onChange={(e) => {
                  setDestinationCountry(e.target.value);
                  setDestinationCity('');
                }}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Origin City */}
            <div>
              <label className="block text-sm font-medium mb-2">Origin City *</label>
              <select
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select a city</option>
                {originCities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name}{city.state ? `, ${city.state}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination City */}
            <div>
              <label className="block text-sm font-medium mb-2">Destination City *</label>
              <select
                value={destinationCity}
                onChange={(e) => setDestinationCity(e.target.value)}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="">Select a city</option>
                {destinationCities.map(city => (
                  <option key={city.name} value={city.name}>
                    {city.name}{city.state ? `, ${city.state}` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Weight */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Total Weight *</label>
            <div className="flex gap-4">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                className="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                min="0"
                step="0.1"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as 'lb' | 'kg')}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="lb">lb</option>
                <option value="kg">kg</option>
              </select>
            </div>
          </div>

          {/* Package Details */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Package Details (Optional)</h3>
              <button
                onClick={addPackage}
                className="flex items-center gap-2 text-accent hover:text-accent/80 font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Package
              </button>
            </div>
            
            {packages.map((pkg, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium">Package {index + 1}</span>
                  {packages.length > 1 && (
                    <button
                      onClick={() => removePackage(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs mb-1">Weight</label>
                    <input
                      type="number"
                      value={pkg.weight}
                      onChange={(e) => updatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Length</label>
                    <input
                      type="number"
                      value={pkg.length || ''}
                      onChange={(e) => updatePackage(index, 'length', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="L"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Width</label>
                    <input
                      type="number"
                      value={pkg.width || ''}
                      onChange={(e) => updatePackage(index, 'width', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="W"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Height</label>
                    <input
                      type="number"
                      value={pkg.height || ''}
                      onChange={(e) => updatePackage(index, 'height', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                      placeholder="H"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Unit</label>
                    <select
                      value={pkg.dimensionUnit || 'in'}
                      onChange={(e) => updatePackage(index, 'dimensionUnit', e.target.value as 'in' | 'cm')}
                      className="w-full border rounded px-3 py-1.5 text-sm"
                    >
                      <option value="in">in</option>
                      <option value="cm">cm</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Options */}
          <div className="space-y-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGuaranteed}
                onChange={(e) => setIsGuaranteed(e.target.checked)}
                className="w-4 h-4 text-accent rounded focus:ring-accent"
              />
              <span className="text-sm">
                <strong>Guarantee / High Value Item</strong> - Additional insurance coverage
              </span>
            </label>
            
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasFoodSupplements}
                onChange={(e) => setHasFoodSupplements(e.target.checked)}
                className="w-4 h-4 text-accent rounded focus:ring-accent"
              />
              <span className="text-sm">
                <strong>Food / Supplements</strong> - Contains food items or supplements
              </span>
            </label>
          </div>

          {/* Show Rates Button */}
          <button
            onClick={handleShowRates}
            disabled={!originCity || !destinationCity || weight <= 0}
            className="w-full bg-accent text-white py-4 rounded-lg font-semibold text-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Checking Rates...' : 'Show Rates'}
          </button>
        </div>

        {/* Results */}
        {quotes && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Available Rates</h2>
            
            {/* Major Carriers */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-4 border-b">
                <h3 className="font-semibold text-lg">Major Carriers</h3>
              </div>
              <div className="divide-y">
                {quotes.filter(q => q.carrierId !== 'shipcompare-consolidated').map(quote => (
                  <div key={quote.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{quote.carrierName}</span>
                          <span className="text-sm text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                            {quote.serviceName}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Transit Time: {quote.transitDays} days</p>
                          <p>Est. Delivery: {new Date(quote.estimatedDeliveryDate).toLocaleDateString()}</p>
                          <p>Reliability: {(quote.reliabilityScore * 100).toFixed(0)}%</p>
                        </div>
                        {quote.directLink && (
                          <a
                            href={quote.directLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-accent hover:underline mt-2"
                          >
                            Check rate directly on {quote.carrierName} →
                          </a>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          ${quote.totalCost.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {quote.currency}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Router - Highlighted */}
            <div className="bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl shadow-md overflow-hidden border-2 border-accent">
              <div className="bg-accent text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">💰 ShipCompare Open Router - Best Price Guaranteed</h3>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                    Save up to 50%
                  </span>
                </div>
              </div>
              <div className="divide-y">
                {quotes.filter(q => q.carrierId === 'shipcompare-consolidated').map(quote => (
                  <div key={quote.id} className="p-6 hover:bg-white/50 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{quote.carrierName}</span>
                          <span className="text-sm text-white bg-accent px-2 py-1 rounded">
                            {quote.serviceName}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Transit Time: {quote.transitDays} days</p>
                          <p>Est. Delivery: {new Date(quote.estimatedDeliveryDate).toLocaleDateString()}</p>
                          <p>Reliability: {(quote.reliabilityScore * 100).toFixed(0)}%</p>
                          <p className="text-accent font-medium mt-2">
                            ✓ Always lower or equal to the lowest market price
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-accent">
                          ${quote.totalCost.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          {quote.currency}
                        </div>
                        <button
                          onClick={() => handleOpenRouterSelect(quote)}
                          className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                        >
                          Use Open Router
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  ℹ️ Open Router leverages our bulk shipping agreements to provide you with the best possible rates. 
                  Our sales team will contact you to finalize your shipment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Modal */}
        {showContactForm && selectedQuote && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              {!submitted ? (
                <>
                  <h3 className="text-xl font-bold mb-4">Complete Your Open Router Request</h3>
                  <p className="text-muted-foreground mb-6">
                    Selected: {selectedQuote.serviceName} - ${selectedQuote.totalCost.toFixed(2)}
                  </p>
                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Name (Optional)</label>
                      <input
                        type="text"
                        value={contactInfo.name || ''}
                        onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Pick-up Address (Optional)</label>
                      <textarea
                        value={contactInfo.pickupAddress?.street1 || ''}
                        onChange={(e) => setContactInfo({ 
                          ...contactInfo, 
                          pickupAddress: { ...contactInfo.pickupAddress!, street1: e.target.value, city: '', zip: '', country: '' }
                        })}
                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent"
                        placeholder="Street address"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-accent text-white py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Request Submitted!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you! Our sales team will contact you at {contactInfo.email} or {contactInfo.phone} within 24 hours to finalize your shipment.
                  </p>
                  <button
                    onClick={() => {
                      setShowContactForm(false);
                      setSubmitted(false);
                      setQuotes(null);
                    }}
                    className="bg-accent text-white px-8 py-3 rounded-lg font-medium hover:bg-accent/90 transition-colors"
                  >
                    Get Another Quote
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2024 ShipCompare Pro. All rights reserved.</p>
          <div className="mt-4 space-x-4 text-sm">
            <Link href="/open-router-info" className="hover:text-white transition-colors">
              How Open Router Works
            </Link>
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

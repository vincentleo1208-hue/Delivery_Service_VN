// ShipCompare Pro - Minimal Vite Implementation
// Single-file component approach with mock data for immediate UX testing

// ============================================
// MOCK DATA
// ============================================

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
];

const CITIES = {
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

const MOCK_QUOTES = [
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

// ============================================
// STATE MANAGEMENT
// ============================================

const state = {
  currentPage: 'home',
  originCountry: 'US',
  originCity: '',
  destinationCountry: 'GB',
  destinationCity: '',
  weight: 5,
  weightUnit: 'lb',
  packages: [{ weight: 5, weightUnit: 'lb', length: 10, width: 8, height: 6, dimensionUnit: 'in' }],
  isHighValue: false,
  containsFoodOrSupplements: false,
  quotes: null,
  isLoading: false,
  showContactForm: false,
  selectedQuote: null,
  contactInfo: { email: '', phone: '', name: '', pickupAddress: '' },
  submitted: false,
  error: null,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function getOriginCities() {
  return CITIES[state.originCountry] || [];
}

function getDestinationCities() {
  return CITIES[state.destinationCountry] || [];
}

// ============================================
// COMPONENT RENDERERS
// ============================================

function renderNavigation() {
  const nav = document.createElement('nav');
  nav.className = 'border-b bg-white/80 backdrop-blur-md sticky top-0 z-50';
  nav.innerHTML = `
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <a href="#" onclick="navigateTo('home')" class="text-2xl font-bold text-primary">
        ShipCompare Pro
      </a>
      <div class="hidden md:flex items-center gap-6">
        <a href="#how-it-works" class="text-muted-foreground hover:text-primary transition-colors">
          How It Works
        </a>
        <a href="#services" class="text-muted-foreground hover:text-primary transition-colors">
          Services
        </a>
        <a href="#policy" class="text-muted-foreground hover:text-primary transition-colors">
          Policy
        </a>
        <button onclick="navigateTo('rates')" class="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
          Check Rates
        </button>
      </div>
    </div>
  `;
  return nav;
}

function renderHomePage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  // Navigation
  app.appendChild(renderNavigation());
  
  // Hero Section
  const hero = document.createElement('section');
  hero.className = 'relative gradient-hero text-white py-24 md:py-32';
  hero.innerHTML = `
    <div class="container mx-auto px-4 text-center">
      <h1 class="text-4xl md:text-6xl font-bold mb-6">
        Smart Shipping,<br />
        <span class="text-accent">Better Prices</span>
      </h1>
      <p class="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
        Compare rates from all major carriers and unlock exclusive consolidated shipping discounts up to 50% off retail prices.
      </p>
      <button 
        onclick="navigateTo('rates')"
        class="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg btn-primary"
      >
        <i data-lucide="package"></i>
        Compare and Choose the Available Rates
      </button>
    </div>
  `;
  app.appendChild(hero);
  
  // Features Section
  const features = document.createElement('section');
  features.id = 'services';
  features.className = 'py-20 bg-gray-50';
  features.innerHTML = `
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
        Why Choose ShipCompare Pro?
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${renderFeatureCard('Globe', 'Global Coverage', 'Ship to over 220 countries worldwide with our network of trusted carriers.')}
        ${renderFeatureCard('Shield', 'Full Insurance', 'Every shipment includes comprehensive insurance coverage at no extra cost.')}
        ${renderFeatureCard('Clock', 'Fast Delivery', 'Multiple service levels from economy to express to match your timeline.')}
        ${renderFeatureCard('Package', 'Best Prices', 'Save up to 50% with our consolidated shipping options and bulk rates.')}
      </div>
    </div>
  `;
  app.appendChild(features);
  
  // How It Works Section
  const howItWorks = document.createElement('section');
  howItWorks.id = 'how-it-works';
  howItWorks.className = 'py-20 bg-white';
  howItWorks.innerHTML = `
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-8">
        How Open Router Shipping Works
      </h2>
      <p class="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
        Our Open Router service leverages broker relationships and bulk shipping agreements to provide you with the lowest possible rates.
      </p>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        ${renderStepCard('1', 'Enter Your Shipment Details', 'Provide origin, destination, and package information to get instant quotes from all carriers.')}
        ${renderStepCard('2', 'Compare All Options', 'See rates from FedEx, UPS, DHL, USPS, and our exclusive consolidated shipping options.')}
        ${renderStepCard('3', 'Choose Open Router for Best Price', 'Select Open Router to get the lowest rate. Our team will contact you to finalize your shipment.')}
      </div>
    </div>
  `;
  app.appendChild(howItWorks);
  
  // Policy Section
  const policy = document.createElement('section');
  policy.id = 'policy';
  policy.className = 'py-20 bg-gray-50';
  policy.innerHTML = `
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
        Our Commitment to You
      </h2>
      <div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        ${renderPolicyCard('Transparent Pricing', 'No hidden fees. What you see is what you pay. All surcharges and fees are clearly displayed upfront.')}
        ${renderPolicyCard('Secure Handling', 'Your packages are handled with care throughout the entire shipping process with full tracking.')}
        ${renderPolicyCard('Customer Support', 'Our dedicated support team is available to assist you at every step of your shipping journey.')}
      </div>
    </div>
  `;
  app.appendChild(policy);
  
  // CTA Section
  const cta = document.createElement('section');
  cta.className = 'py-20 bg-primary text-white';
  cta.innerHTML = `
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6">
        Ready to Save on Shipping?
      </h2>
      <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        Get instant quotes from multiple carriers and discover how much you can save with Open Router shipping.
      </p>
      <button 
        onclick="navigateTo('rates')"
        class="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 btn-primary"
      >
        Check Rates Now
      </button>
    </div>
  `;
  app.appendChild(cta);
  
  // Footer
  const footer = document.createElement('footer');
  footer.className = 'bg-gray-900 text-gray-400 py-12';
  footer.innerHTML = `
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8">
        <div>
          <h3 class="text-white font-bold text-lg mb-4">ShipCompare Pro</h3>
          <p class="text-sm">Smart shipping solutions for individuals and businesses worldwide.</p>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2 text-sm">
            <li><button onclick="navigateTo('rates')" class="hover:text-white transition-colors">Check Rates</button></li>
            <li><a href="#how-it-works" class="hover:text-white transition-colors">How It Works</a></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Services</h4>
          <ul class="space-y-2 text-sm">
            <li><span class="hover:text-white transition-colors cursor-pointer">Domestic Shipping</span></li>
            <li><span class="hover:text-white transition-colors cursor-pointer">International Shipping</span></li>
            <li><span class="hover:text-white transition-colors cursor-pointer">Consolidated Shipping</span></li>
          </ul>
        </div>
        <div>
          <h4 class="text-white font-semibold mb-4">Contact</h4>
          <ul class="space-y-2 text-sm">
            <li>support@shipcompare.pro</li>
            <li>1-800-SHIP-CMP</li>
          </ul>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2024 ShipCompare Pro. All rights reserved.</p>
      </div>
    </div>
  `;
  app.appendChild(footer);
  
  // Re-initialize Lucide icons
  setTimeout(() => lucide.createIcons(), 0);
}

function renderFeatureCard(iconName, title, description) {
  return `
    <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow card">
      <div class="mb-4"><i data-lucide="${iconName}" class="w-10 h-10 text-accent"></i></div>
      <h3 class="text-xl font-semibold mb-2">${title}</h3>
      <p class="text-muted-foreground">${description}</p>
    </div>
  `;
}

function renderStepCard(number, title, description) {
  return `
    <div class="text-center">
      <div class="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        ${number}
      </div>
      <h3 class="text-xl font-semibold mb-2">${title}</h3>
      <p class="text-muted-foreground">${description}</p>
    </div>
  `;
}

function renderPolicyCard(title, description) {
  return `
    <div class="bg-white p-6 rounded-xl shadow-md card">
      <h3 class="text-xl font-semibold mb-2">${title}</h3>
      <p class="text-muted-foreground">${description}</p>
    </div>
  `;
}

function renderRatesPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  // Header
  const header = document.createElement('header');
  header.className = 'bg-white border-b sticky top-0 z-50';
  header.innerHTML = `
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <a href="#" onclick="navigateTo('home')" class="text-2xl font-bold text-primary">
        ShipCompare Pro
      </a>
      <nav class="hidden md:flex items-center gap-6">
        <a href="#" onclick="navigateTo('home')" class="text-muted-foreground hover:text-primary transition-colors">Home</a>
        <a href="#how-it-works" class="text-muted-foreground hover:text-primary transition-colors">How Open Router Works</a>
      </nav>
    </div>
  `;
  app.appendChild(header);
  
  // Main Content
  const main = document.createElement('main');
  main.className = 'container mx-auto px-4 py-8';
  main.innerHTML = `
    <h1 class="text-3xl md:text-4xl font-bold mb-8 text-center">
      Compare and Choose the Available Rates
    </h1>
    
    <!-- Input Form -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-xl font-semibold mb-6">Shipment Details</h2>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- Origin Country -->
        <div>
          <label class="block text-sm font-medium mb-2">Origin Country *</label>
          <select id="originCountry" onchange="handleOriginCountryChange()" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent">
            ${COUNTRIES.map(c => `<option value="${c.code}" ${state.originCountry === c.code ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        
        <!-- Destination Country -->
        <div>
          <label class="block text-sm font-medium mb-2">Destination Country *</label>
          <select id="destinationCountry" onchange="handleDestinationCountryChange()" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent">
            ${COUNTRIES.map(c => `<option value="${c.code}" ${state.destinationCountry === c.code ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <!-- Origin City -->
        <div>
          <label class="block text-sm font-medium mb-2">Origin City *</label>
          <select id="originCity" onchange="state.originCity = this.value" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent">
            <option value="">Select a city</option>
            ${getOriginCities().map(c => `<option value="${c.name}" ${state.originCity === c.name ? 'selected' : ''}>${c.name}${c.state ? ', ' + c.state : ''}</option>`).join('')}
          </select>
        </div>
        
        <!-- Destination City -->
        <div>
          <label class="block text-sm font-medium mb-2">Destination City *</label>
          <select id="destinationCity" onchange="state.destinationCity = this.value" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent">
            <option value="">Select a city</option>
            ${getDestinationCities().map(c => `<option value="${c.name}" ${state.destinationCity === c.name ? 'selected' : ''}>${c.name}${c.state ? ', ' + c.state : ''}</option>`).join('')}
          </select>
        </div>
      </div>
      
      <!-- Weight -->
      <div class="mb-6">
        <label class="block text-sm font-medium mb-2">Total Weight *</label>
        <div class="flex gap-4">
          <input type="number" id="weight" value="${state.weight}" onchange="state.weight = parseFloat(this.value) || 0" class="flex-1 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent" min="0" step="0.1" />
          <select id="weightUnit" onchange="state.weightUnit = this.value" class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent">
            <option value="lb" ${state.weightUnit === 'lb' ? 'selected' : ''}>lb</option>
            <option value="kg" ${state.weightUnit === 'kg' ? 'selected' : ''}>kg</option>
          </select>
        </div>
      </div>
      
      <!-- Package Details -->
      <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium">Package Details (Optional)</h3>
          <button onclick="addPackage()" class="flex items-center gap-2 text-accent hover:text-accent/80 font-medium">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Add Package
          </button>
        </div>
        
        <div id="packagesContainer">
          ${state.packages.map((pkg, index) => renderPackageInput(pkg, index)).join('')}
        </div>
      </div>
      
      <!-- Options -->
      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <label class="flex items-center gap-2">
          <input type="checkbox" id="isHighValue" onchange="state.isHighValue = this.checked" ${state.isHighValue ? 'checked' : ''} class="rounded" />
          <span class="text-sm font-medium">High Value Shipment</span>
        </label>
        <label class="flex items-center gap-2">
          <input type="checkbox" id="containsFood" onchange="state.containsFoodOrSupplements = this.checked" ${state.containsFoodOrSupplements ? 'checked' : ''} class="rounded" />
          <span class="text-sm font-medium">Contains Food/Supplements</span>
        </label>
      </div>
      
      <!-- Error Message -->
      <div id="errorMessage" class="hidden bg-red-50 text-red-600 p-4 rounded-lg mb-4"></div>
      
      <!-- Show Rates Button -->
      <button onclick="handleShowRates()" id="showRatesBtn" class="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-colors btn-primary">
        Show Rates
      </button>
    </div>
    
    <!-- Loading State -->
    <div id="loadingState" class="hidden text-center py-12">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-muted-foreground">Fetching quotes...</p>
    </div>
    
    <!-- Quotes Display -->
    <div id="quotesDisplay" class="hidden">
      <h2 class="text-2xl font-bold mb-6">Available Shipping Rates</h2>
      <div class="space-y-4" id="quotesList"></div>
    </div>
    
    <!-- Contact Form Modal -->
    <div id="contactModal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <h3 class="text-xl font-bold mb-4">Complete Your Request</h3>
        <form onsubmit="handleSubmitContact(event)">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Name *</label>
              <input type="text" id="contactName" required class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Email *</label>
              <input type="email" id="contactEmail" required class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Phone *</label>
              <input type="tel" id="contactPhone" required class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Pickup Address</label>
              <textarea id="contactAddress" rows="3" class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent"></textarea>
            </div>
          </div>
          <div class="flex gap-4 mt-6">
            <button type="button" onclick="closeContactModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300">Cancel</button>
            <button type="submit" class="flex-1 bg-accent text-white py-2 rounded-lg font-medium hover:bg-accent/90">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Success Message -->
    <div id="successMessage" class="hidden bg-green-50 text-green-600 p-6 rounded-lg text-center">
      <i data-lucide="check-circle" class="w-12 h-12 mx-auto mb-4"></i>
      <h3 class="text-xl font-bold mb-2">Request Submitted!</h3>
      <p>Our team will contact you shortly to finalize your shipment.</p>
      <button onclick="navigateTo('home')" class="mt-4 bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90">Back to Home</button>
    </div>
  `;
  
  // Re-initialize Lucide icons
  setTimeout(() => lucide.createIcons(), 0);
}

function renderPackageInput(pkg, index) {
  return `
    <div class="border rounded-lg p-4 mb-4 bg-gray-50">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium">Package ${index + 1}</span>
        ${state.packages.length > 1 ? `
          <button onclick="removePackage(${index})" class="text-red-500 hover:text-red-700">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        ` : ''}
      </div>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label class="block text-xs mb-1">Weight</label>
          <input type="number" value="${pkg.weight}" onchange="updatePackage(${index}, 'weight', parseFloat(this.value) || 0)" class="w-full border rounded px-3 py-1.5 text-sm" min="0" step="0.1" />
        </div>
        <div>
          <label class="block text-xs mb-1">Length</label>
          <input type="number" value="${pkg.length || ''}" onchange="updatePackage(${index}, 'length', parseFloat(this.value) || 0)" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="L" />
        </div>
        <div>
          <label class="block text-xs mb-1">Width</label>
          <input type="number" value="${pkg.width || ''}" onchange="updatePackage(${index}, 'width', parseFloat(this.value) || 0)" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="W" />
        </div>
        <div>
          <label class="block text-xs mb-1">Height</label>
          <input type="number" value="${pkg.height || ''}" onchange="updatePackage(${index}, 'height', parseFloat(this.value) || 0)" class="w-full border rounded px-3 py-1.5 text-sm" placeholder="H" />
        </div>
        <div>
          <label class="block text-xs mb-1">Unit</label>
          <select onchange="updatePackage(${index}, 'dimensionUnit', this.value)" class="w-full border rounded px-3 py-1.5 text-sm">
            <option value="in" ${pkg.dimensionUnit === 'in' ? 'selected' : ''}>in</option>
            <option value="cm" ${pkg.dimensionUnit === 'cm' ? 'selected' : ''}>cm</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function renderQuoteCard(quote) {
  const isOpenRouter = quote.carrierId === 'shipcompare-consolidated';
  return `
    <div class="bg-white rounded-xl shadow-md p-6 card ${isOpenRouter ? 'border-2 border-accent' : ''}">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-lg font-bold">${quote.carrierName}</h3>
          <p class="text-muted-foreground">${quote.serviceName}</p>
        </div>
        ${isOpenRouter ? '<span class="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">Best Value</span>' : ''}
      </div>
      
      <div class="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p class="text-xs text-muted-foreground">Delivery</p>
          <p class="font-semibold">${quote.transitDays} days</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Reliability</p>
          <p class="font-semibold">${Math.round(quote.reliabilityScore * 100)}%</p>
        </div>
        <div>
          <p class="text-xs text-muted-foreground">Est. Delivery</p>
          <p class="font-semibold">${new Date(quote.estimatedDeliveryDate).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div class="flex items-center justify-between">
        <div>
          <p class="text-2xl font-bold text-primary">$${quote.totalCost.toFixed(2)}</p>
          <p class="text-xs text-muted-foreground">${quote.currency}</p>
        </div>
        ${isOpenRouter 
          ? `<button onclick="openContactModal('${quote.id}')" class="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 btn-primary">Select</button>`
          : `<a href="${quote.directLink}" target="_blank" class="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium hover:bg-gray-200">View Details</a>`
        }
      </div>
      
      ${quote.surcharges.length > 0 ? `
        <div class="mt-4 pt-4 border-t">
          <p class="text-xs text-muted-foreground mb-2">Breakdown:</p>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between">
              <span>Base Rate</span>
              <span>$${quote.baseRate.toFixed(2)}</span>
            </div>
            ${quote.surcharges.map(s => `
              <div class="flex justify-between text-xs text-muted-foreground">
                <span>${s.name}</span>
                <span>$${s.amount.toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// ============================================
// EVENT HANDLERS
// ============================================

function navigateTo(page) {
  state.currentPage = page;
  if (page === 'home') {
    renderHomePage();
  } else if (page === 'rates') {
    renderRatesPage();
  }
  window.scrollTo(0, 0);
}

function handleOriginCountryChange() {
  const select = document.getElementById('originCountry');
  state.originCountry = select.value;
  state.originCity = '';
  
  // Update city dropdown
  const citySelect = document.getElementById('originCity');
  citySelect.innerHTML = `
    <option value="">Select a city</option>
    ${getOriginCities().map(c => `<option value="${c.name}">${c.name}${c.state ? ', ' + c.state : ''}</option>`).join('')}
  `;
}

function handleDestinationCountryChange() {
  const select = document.getElementById('destinationCountry');
  state.destinationCountry = select.value;
  state.destinationCity = '';
  
  // Update city dropdown
  const citySelect = document.getElementById('destinationCity');
  citySelect.innerHTML = `
    <option value="">Select a city</option>
    ${getDestinationCities().map(c => `<option value="${c.name}">${c.name}${c.state ? ', ' + c.state : ''}</option>`).join('')}
  `;
}

function addPackage() {
  state.packages.push({ weight: 1, weightUnit: 'lb', length: 0, width: 0, height: 0, dimensionUnit: 'in' });
  renderPackages();
}

function removePackage(index) {
  state.packages.splice(index, 1);
  renderPackages();
}

function updatePackage(index, field, value) {
  state.packages[index][field] = value;
}

function renderPackages() {
  const container = document.getElementById('packagesContainer');
  if (container) {
    container.innerHTML = state.packages.map((pkg, index) => renderPackageInput(pkg, index)).join('');
    lucide.createIcons();
  }
}

async function handleShowRates() {
  state.isLoading = true;
  state.error = null;
  
  // Update UI
  document.getElementById('showRatesBtn').classList.add('hidden');
  document.getElementById('loadingState').classList.remove('hidden');
  document.getElementById('errorMessage').classList.add('hidden');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // In production, this would call the backend API
    // For now, use mock data
    state.quotes = MOCK_QUOTES;
    renderQuotes();
  } catch (err) {
    state.error = err.message || 'Failed to fetch quotes. Please try again.';
    document.getElementById('errorMessage').textContent = state.error;
    document.getElementById('errorMessage').classList.remove('hidden');
  } finally {
    state.isLoading = false;
    document.getElementById('loadingState').classList.add('hidden');
  }
}

function renderQuotes() {
  const quotesList = document.getElementById('quotesList');
  const quotesDisplay = document.getElementById('quotesDisplay');
  
  quotesList.innerHTML = state.quotes.map(quote => renderQuoteCard(quote)).join('');
  quotesDisplay.classList.remove('hidden');
  
  lucide.createIcons();
}

function openContactModal(quoteId) {
  state.selectedQuote = state.quotes.find(q => q.id === quoteId);
  document.getElementById('contactModal').classList.remove('hidden');
}

function closeContactModal() {
  document.getElementById('contactModal').classList.add('hidden');
}

function handleSubmitContact(event) {
  event.preventDefault();
  
  state.contactInfo = {
    name: document.getElementById('contactName').value,
    email: document.getElementById('contactEmail').value,
    phone: document.getElementById('contactPhone').value,
    pickupAddress: document.getElementById('contactAddress').value,
  };
  
  // Simulate submission
  setTimeout(() => {
    closeContactModal();
    document.getElementById('quotesDisplay').classList.add('hidden');
    document.getElementById('successMessage').classList.remove('hidden');
    state.submitted = true;
    lucide.createIcons();
  }, 500);
}

// ============================================
// APP INITIALIZATION
// ============================================

function initApp() {
  console.log('ShipCompare Pro - Minimal Vite Setup Initialized');
  console.log('Using CDN-based dependencies for minimal memory footprint');
  
  // Start on home page
  renderHomePage();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Export functions for global access (since we're using vanilla JS)
window.navigateTo = navigateTo;
window.handleOriginCountryChange = handleOriginCountryChange;
window.handleDestinationCountryChange = handleDestinationCountryChange;
window.addPackage = addPackage;
window.removePackage = removePackage;
window.updatePackage = updatePackage;
window.handleShowRates = handleShowRates;
window.openContactModal = openContactModal;
window.closeContactModal = closeContactModal;
window.handleSubmitContact = handleSubmitContact;

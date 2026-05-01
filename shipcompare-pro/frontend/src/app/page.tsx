'use client';

import Link from 'next/link';
import { Package, Shield, Clock, Globe } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-primary">
            ShipCompare Pro
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#services" className="text-muted-foreground hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="#policy" className="text-muted-foreground hover:text-primary transition-colors">
              Policy
            </Link>
            <Link href="/rates" className="bg-accent text-white px-6 py-2 rounded-lg font-medium hover:bg-accent/90 transition-colors">
              Check Rates
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Shipping,<br />
            <span className="text-accent">Better Prices</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Compare rates from all major carriers and unlock exclusive consolidated shipping discounts up to 50% off retail prices.
          </p>
          <Link 
            href="/rates" 
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg"
          >
            <Package className="w-5 h-5" />
            Compare and Choose the Available Rates
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose ShipCompare Pro?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Globe className="w-10 h-10 text-accent" />}
              title="Global Coverage"
              description="Ship to over 220 countries worldwide with our network of trusted carriers."
            />
            <FeatureCard
              icon={<Shield className="w-10 h-10 text-accent" />}
              title="Full Insurance"
              description="Every shipment includes comprehensive insurance coverage at no extra cost."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10 text-accent" />}
              title="Fast Delivery"
              description="Multiple service levels from economy to express to match your timeline."
            />
            <FeatureCard
              icon={<Package className="w-10 h-10 text-accent" />}
              title="Best Prices"
              description="Save up to 50% with our consolidated shipping options and bulk rates."
            />
          </div>
        </div>
      </section>

      {/* How Open Router Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
            How Open Router Shipping Works
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our Open Router service leverages broker relationships and bulk shipping agreements to provide you with the lowest possible rates.
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Enter Your Shipment Details"
              description="Provide origin, destination, and package information to get instant quotes from all carriers."
            />
            <StepCard
              number="2"
              title="Compare All Options"
              description="See rates from FedEx, UPS, DHL, USPS, and our exclusive consolidated shipping options."
            />
            <StepCard
              number="3"
              title="Choose Open Router for Best Price"
              description="Select Open Router to get the lowest rate. Our team will contact you to finalize your shipment."
            />
          </div>
          <div className="text-center mt-12">
            <Link 
              href="/open-router-info" 
              className="text-accent font-medium hover:underline inline-flex items-center gap-2"
            >
              Learn more about Open Router Shipping →
            </Link>
          </div>
        </div>
      </section>

      {/* Policy Section */}
      <section id="policy" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Commitment to You
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PolicyCard
              title="Transparent Pricing"
              description="No hidden fees. What you see is what you pay. All surcharges and fees are clearly displayed upfront."
            />
            <PolicyCard
              title="Secure Handling"
              description="Your packages are handled with care throughout the entire shipping process with full tracking."
            />
            <PolicyCard
              title="Customer Support"
              description="Our dedicated support team is available to assist you at every step of your shipping journey."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Save on Shipping?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Get instant quotes from multiple carriers and discover how much you can save with Open Router shipping.
          </p>
          <Link 
            href="/rates" 
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105"
          >
            Check Rates Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">ShipCompare Pro</h3>
              <p className="text-sm">
                Smart shipping solutions for individuals and businesses worldwide.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/rates" className="hover:text-white transition-colors">Check Rates</Link></li>
                <li><Link href="/open-router-info" className="hover:text-white transition-colors">Open Router Info</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="hover:text-white transition-colors cursor-pointer">Domestic Shipping</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">International Shipping</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Consolidated Shipping</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@shipcompare.pro</li>
                <li>1-800-SHIP-CMP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 ShipCompare Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PolicyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

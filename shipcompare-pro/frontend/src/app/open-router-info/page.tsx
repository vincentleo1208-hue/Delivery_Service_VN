'use client';

import Link from 'next/link';
import { ArrowLeft, Package, DollarSign, Clock, Shield, Truck, Globe, CheckCircle } from 'lucide-react';

export default function OpenRouterInfoPage() {
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
            <Link href="/rates" className="text-muted-foreground hover:text-primary transition-colors">
              Check Rates
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              How Open Router Shipping Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover how our innovative Open Router service delivers the lowest shipping rates through consolidated bulk shipping.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <BenefitCard
              icon={<DollarSign className="w-8 h-8 text-accent" />}
              title="Lowest Prices"
              description="Save up to 50% compared to retail carrier rates through our bulk shipping agreements."
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8 text-accent" />}
              title="Full Coverage"
              description="Every shipment includes comprehensive insurance with no hidden fees or surprises."
            />
            <BenefitCard
              icon={<Clock className="w-8 h-8 text-accent" />}
              title="Reliable Delivery"
              description="Multiple service levels from economy to express to match your timeline needs."
            />
          </div>

          {/* How It Works Steps */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">The Open Router Process</h2>
            
            <div className="space-y-8">
              <Step
                number="1"
                title="Enter Your Shipment Details"
                description="Provide origin, destination, weight, and package information. You can also specify if you're shipping multiple packages, high-value items, or food/supplements."
                icon={<Package className="w-6 h-6" />}
              />
              
              <Step
                number="2"
                title="Compare All Available Rates"
                description="See quotes from major carriers (FedEx, UPS, DHL, USPS) alongside our exclusive Open Router options. All rates are displayed transparently with no hidden fees."
                icon={<DollarSign className="w-6 h-6" />}
              />
              
              <Step
                number="3"
                title="Choose Open Router for Best Price"
                description="Select an Open Router option to get the lowest available rate. Our Open Router prices are always lower than or equal to the lowest market price."
                icon={<CheckCircle className="w-6 h-6" />}
              />
              
              <Step
                number="4"
                title="Provide Contact Information"
                description="Simply enter your email and phone number. Optionally provide your name and pick-up address. This is all we need to get started."
                icon={<Globe className="w-6 h-6" />}
              />
              
              <Step
                number="5"
                title="Our Sales Team Contacts You"
                description="Within 24 hours, our dedicated sales team will reach out to finalize your shipment details, arrange pickup, and provide your tracking information."
                icon={<Truck className="w-6 h-6" />}
              />
            </div>
          </div>

          {/* Why Open Router is Cheaper */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl shadow-md p-8 mb-12 border border-primary/20">
            <h2 className="text-2xl font-bold mb-6">Why Is Open Router So Much Cheaper?</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Bulk Consolidation</h3>
                  <p className="text-muted-foreground text-sm">
                    We combine multiple customer shipments into larger consolidated batches, qualifying for wholesale carrier rates that aren't available to individual shippers.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Broker Relationships</h3>
                  <p className="text-muted-foreground text-sm">
                    As a licensed shipping broker, we've negotiated preferential rates with major carriers based on our high shipping volume.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Optimized Routing</h3>
                  <p className="text-muted-foreground text-sm">
                    Shipments are routed through strategic consolidation hubs, maximizing efficiency and minimizing costs while keeping your package intact.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Streamlined Operations</h3>
                  <p className="text-muted-foreground text-sm">
                    We handle all customs paperwork and brokerage on your behalf, reducing administrative overhead and passing the savings to you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
            <div className="bg-primary text-white px-6 py-4">
              <h2 className="text-xl font-bold">Price Comparison Example</h2>
              <p className="text-sm text-white/80">5 lb package from Los Angeles, US to London, UK</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Carrier</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Transit Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">FedEx</td>
                    <td className="px-6 py-4">International Economy</td>
                    <td className="px-6 py-4 text-right font-medium">$51.75</td>
                    <td className="px-6 py-4 text-right">5 days</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">UPS</td>
                    <td className="px-6 py-4">Worldwide Expedited</td>
                    <td className="px-6 py-4 text-right font-medium">$59.80</td>
                    <td className="px-6 py-4 text-right">4 days</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">DHL</td>
                    <td className="px-6 py-4">Express Worldwide</td>
                    <td className="px-6 py-4 text-right font-medium">$66.70</td>
                    <td className="px-6 py-4 text-right">3 days</td>
                  </tr>
                  <tr className="bg-accent/10 hover:bg-accent/20">
                    <td className="px-6 py-4 font-bold text-accent">Open Router</td>
                    <td className="px-6 py-4">
                      <span className="bg-accent text-white text-xs px-2 py-1 rounded">Best Value</span>
                      <span className="ml-2">Economy</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-accent">$24.50</td>
                    <td className="px-6 py-4 text-right">8 days</td>
                  </tr>
                  <tr className="bg-accent/10 hover:bg-accent/20">
                    <td className="px-6 py-4 font-bold text-accent">Open Router</td>
                    <td className="px-6 py-4">Standard</td>
                    <td className="px-6 py-4 text-right font-bold text-accent">$30.00</td>
                    <td className="px-6 py-4 text-right">6 days</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 px-6 py-4 text-sm text-muted-foreground">
              * Prices shown are examples and may vary based on actual shipment details, current fuel surcharges, and route availability.
            </div>
          </div>

          {/* What Happens to Your Package */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">What Happens to Your Package?</h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Your shipment stays intact throughout the entire journey. Here's the typical flow:
            </p>
            
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent/30 hidden md:block"></div>
              
              <TimelineItem
                title="Pickup"
                description="Your package is collected from your specified location."
              />
              <TimelineItem
                title="Origin Hub"
                description="Arrives at our consolidation facility where it's batched with other shipments heading to the same region."
              />
              <TimelineItem
                title="Consolidation"
                description="Your package remains in its original packaging but travels as part of a larger consolidated freight shipment."
              />
              <TimelineItem
                title="Line Haul"
                description="Transported via air or ground to the destination country's hub."
              />
              <TimelineItem
                title="Customs Clearance"
                description="We handle all customs paperwork and brokerage on your behalf."
              />
              <TimelineItem
                title="Final Mile"
                description="Handed to local carrier for final delivery to your recipient."
              />
              <TimelineItem
                title="Delivered"
                description="Package arrives at its destination with full tracking history available."
              />
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <FAQItem
                question="Is my package safe with consolidated shipping?"
                answer="Absolutely! Your package maintains its original packaging throughout the journey. We simply group multiple shipments together for bulk transport. Every shipment includes full insurance coverage."
              />
              
              <FAQItem
                question="Will my shipment be separated from its original packaging?"
                answer="No! Your package stays intact from pickup to delivery. We never open or repackage your items. The consolidation happens at the pallet or container level, not by opening individual packages."
              />
              
              <FAQItem
                question="How do I track my Open Router shipment?"
                answer="You'll receive a single ShipCompare tracking number that covers the entire journey from pickup to delivery. Our sales team will provide this when they contact you to finalize your shipment."
              />
              
              <FAQItem
                question="Can I ship food or supplements?"
                answer="Yes! Just indicate during checkout that your package contains food or supplements. We'll ensure proper handling and documentation for customs clearance."
              />
              
              <FAQItem
                question="What if I have a high-value item?"
                answer="Check the 'Guarantee / High Value Item' option during checkout. This ensures additional insurance coverage and enhanced security handling for valuable shipments."
              />
              
              <FAQItem
                question="How quickly will someone contact me?"
                answer="Our sales team typically reaches out within 24 hours during business days. For urgent shipments, mention this in the optional notes field and we'll prioritize your request."
              />
            </div>
          </div>

          {/* CTA */}
          <div className="bg-primary text-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Save on Your Next Shipment?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Get instant quotes from multiple carriers and see how much you can save with Open Router shipping.
            </p>
            <Link 
              href="/rates" 
              className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent/90 transition-all transform hover:scale-105"
            >
              Check Rates Now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2024 ShipCompare Pro. All rights reserved.</p>
          <div className="mt-4 space-x-4 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/rates" className="hover:text-white transition-colors">
              Check Rates
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-center">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

function Step({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function TimelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-4 mb-6 relative">
      <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 z-10">
        <div className="w-8 h-8 bg-accent rounded-full"></div>
      </div>
      <div className="pt-2">
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="border-b pb-6 last:border-0">
      <h3 className="font-semibold mb-2">{question}</h3>
      <p className="text-muted-foreground">{answer}</p>
    </div>
  );
}

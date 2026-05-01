# ShipCompare Pro - Consolidated Shipping Feature

## Overview

ShipCompare Pro now includes a **Consolidated Shipping** service that provides lower-cost shipping options by leveraging our broker relationships and bulk shipping agreements with major carriers.

## How It Works

### The Problem
Retail customers pay full price for individual shipments through carriers like FedEx, UPS, DHL, and USPS.

### Our Solution
As a licensed broker, ShipCompare Pro:
1. **Aggregates multiple customer shipments** into larger consolidated batches
2. **Negotiates bulk rates** with carriers (25-35% discount off retail)
3. **Routes shipments** to nearest consolidation hubs in destination countries
4. **Keeps your shipment intact** - never separated from its original packaging
5. **Handles all customs and brokerage** on your behalf

### Customer Benefits
- ✅ **Lower prices** than direct carrier retail rates
- ✅ **Single tracking** for entire journey
- ✅ **No separation** - your package stays together
- ✅ **Full insurance coverage** included
- ✅ **Simplified customs** - we handle all paperwork

## Technical Implementation

### New Carrier Adapter: `ConsolidatedAdapter`

Located at: `backend/src/carriers/adapters/consolidated.adapter.ts`

This adapter implements the `ICarrierAdapter` interface and provides three service levels:

#### Service Levels

| Service | Transit Time (Domestic) | Transit Time (International) | Discount |
|---------|------------------------|------------------------------|----------|
| **Consolidated Economy** | 5 days | 10 days | 25-35% off retail |
| **Consolidated Standard** | 3 days | 8 days | 22-32% off retail |
| **Consolidated Express** | 2 days | 5 days | 20% off retail |

### Rate Calculation

The consolidated adapter calculates rates based on:

```typescript
// Base rate factors
- Weight (lb or kg)
- Service speed (Economy/Standard/Express)
- Domestic vs International
- Broker discount tier

// Surcharges (reduced vs retail)
- Fuel Surcharge: 10% (vs 15% retail)
- Consolidation Handling: $2.00 flat fee
- Signature Confirmation: $3.50 (optional)
- Saturday Delivery: $8.00 (Express only)
- Hazmat Handling: $25.00 (if applicable)
```

### Consolidation Hubs

Shipments are routed through strategic hubs:

| Region | Hub Airports |
|--------|--------------|
| United States | LAX, JFK, ORD, DFW, MIA |
| Europe | LHR, CDG, FRA, AMS |
| Asia | NRT, ICN, SIN, HKG |
| Canada | YYZ, YVR, YUL |
| Mexico | MEX, GDL |
| Australia | SYD, MEL |

## API Usage

### Get Quotes (Including Consolidated Options)

```bash
POST /api/v1/quotes
Content-Type: application/json

{
  "origin": {
    "street1": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "destination": {
    "street1": "456 High Street",
    "city": "London",
    "state": "",
    "zip": "SW1A 1AA",
    "country": "GB"
  },
  "weight": 5.5,
  "weightUnit": "lb",
  "packageType": "parcel"
}
```

### Response Example

```json
{
  "quotes": [
    {
      "id": "sc-consolidated-economy-1234567890",
      "carrierId": "shipcompare-consolidated",
      "carrierName": "ShipCompare Pro Consolidated",
      "serviceName": "Consolidated Economy",
      "serviceCode": "CONSOLIDATED_ECONOMY",
      "baseRate": 18.75,
      "surcharges": [
        { "name": "Fuel Surcharge", "amount": 1.88 },
        { "name": "Consolidation Handling", "amount": 2.00 }
      ],
      "totalCost": 22.63,
      "currency": "USD",
      "estimatedDeliveryDate": "2024-05-15T00:00:00.000Z",
      "transitDays": 10,
      "reliabilityScore": 0.92
    },
    {
      "id": "sc-consolidated-standard-1234567890",
      "carrierId": "shipcompare-consolidated",
      "carrierName": "ShipCompare Pro Consolidated",
      "serviceName": "Consolidated Standard",
      "serviceCode": "CONSOLIDATED_STANDARD",
      "baseRate": 24.50,
      "surcharges": [
        { "name": "Fuel Surcharge", "amount": 2.45 },
        { "name": "Consolidation Handling", "amount": 2.00 }
      ],
      "totalCost": 28.95,
      "currency": "USD",
      "estimatedDeliveryDate": "2024-05-10T00:00:00.000Z",
      "transitDays": 8,
      "reliabilityScore": 0.95
    },
    {
      "id": "sc-consolidated-express-1234567890",
      "carrierId": "shipcompare-consolidated",
      "carrierName": "ShipCompare Pro Consolidated",
      "serviceName": "Consolidated Express",
      "serviceCode": "CONSOLIDATED_EXPRESS",
      "baseRate": 35.00,
      "surcharges": [
        { "name": "Fuel Surcharge", "amount": 3.50 },
        { "name": "Consolidation Handling", "amount": 2.00 }
      ],
      "totalCost": 40.50,
      "currency": "USD",
      "estimatedDeliveryDate": "2024-05-07T00:00:00.000Z",
      "transitDays": 5,
      "reliabilityScore": 0.97
    }
  ],
  "expiresAt": "2024-05-02T12:30:00.000Z",
  "quoteSessionId": "qs_1714651800000_abc123xyz"
}
```

## Comparison: Retail vs Consolidated

### Example: 5 lb Package from US to UK

| Carrier | Service | Retail Price | Consolidated | Savings |
|---------|---------|--------------|--------------|---------|
| FedEx | International Economy | $45.00 | - | - |
| UPS | Worldwide Expedited | $52.00 | - | - |
| DHL | Express Worldwide | $58.00 | - | - |
| **ShipCompare** | **Consolidated Economy** | - | **$22.63** | **~50%** |
| **ShipCompare** | **Consolidated Standard** | - | **$28.95** | **~40%** |
| **ShipCompare** | **Consolidated Express** | - | **$40.50** | **~30%** |

*Note: Savings vary by route, weight, and current fuel surcharges*

## Integration Points

### Backend Changes

1. **New Adapter**: `ConsolidatedAdapter` 
   - Implements `ICarrierAdapter` interface
   - Extends `BaseCarrierAdapter` for common functionality
   
2. **Updated Module**: `CarriersModule`
   - Registered `ConsolidatedAdapter` as a provider
   - Injected into `CarriersService`

3. **Updated Service**: `CarriersService`
   - Now registers 5 carriers: FedEx, UPS, DHL, USPS, and Consolidated
   - All carriers queried in parallel for quotes

### Frontend Display Recommendations

When displaying quote results to customers:

```typescript
// Pseudo-code for frontend display
const quotes = await getQuotes(shipment);

// Group by carrier type
const retailCarriers = quotes.filter(q => 
  ['fedex', 'ups', 'dhl', 'usps'].includes(q.carrierId)
);

const consolidatedOptions = quotes.filter(q => 
  q.carrierId === 'shipcompare-consolidated'
);

// Display retail options first
renderSection("Major Carriers", retailCarriers);

// Then highlight our consolidated savings
renderSection("💰 ShipCompare Consolidated - Save Up to 50%", consolidatedOptions, {
  highlight: true,
  badge: "Best Value",
  tooltip: "Your shipment stays intact. We combine multiple packages for bulk rates."
});
```

## Tracking Flow

Consolidated shipments follow this tracking journey:

1. **Pickup** - Package collected from sender
2. **Origin Hub** - Arrives at consolidation facility
3. **Consolidation** - Batched with other shipments to same region
4. **Line Haul** - Transported on consolidated freight
5. **Destination Hub** - Arrives at destination country hub
6. **Customs Clearance** - We handle all brokerage
7. **Final Mile** - Handed to local carrier for delivery
8. **Delivered** - Package arrives at recipient

All tracked under a single ShipCompare tracking number.

## Future Enhancements

- [ ] Real-time carrier API integration (currently using mock rates)
- [ ] Dynamic hub selection based on capacity
- [ ] Carbon footprint comparison vs direct shipping
- [ ] Customer dashboard showing consolidation batches
- [ ] White-label tracking page with our branding
- [ ] SMS notifications at each consolidation milestone

## Support

For questions about the consolidated shipping feature:
- Technical implementation: See `backend/src/carriers/adapters/consolidated.adapter.ts`
- Pricing inquiries: Contact partnerships team
- Customer support: support@shipcompare.pro

---

**ShipCompare Pro** - Shipping smarter, not harder.

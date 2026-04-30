# Carrier Pricing Management Guide

## Overview

ShipCompare Pro allows administrators to manually configure carrier pricing structures through a comprehensive admin interface. This guide explains how to provide and manage pricing data for each supplier/carrier.

## How to Provide Pricing Data

### Option 1: CSV Bulk Upload (Recommended)

The fastest way to upload multiple pricing records is via CSV file upload.

#### Step 1: Download the Template

```bash
GET /api/v1/admin/pricing/template/csv
```

Or download from the Admin Dashboard → Pricing → "Download Template"

#### Step 2: CSV Format

The CSV file must contain the following columns:

| Column | Type | Required | Description | Example |
|--------|------|----------|-------------|---------|
| `carrier` | string | Yes | Carrier identifier (lowercase) | `fedex`, `ups`, `dhl`, `usps` |
| `serviceCode` | string | Yes | Service type code | `ground`, `overnight`, `2day`, `express` |
| `zone` | string | No | Shipping zone | `domestic`, `international`, `regional` |
| `baseRate` | number | Yes | Base shipping rate in USD | `8.50` |
| `fuelSurchargePercent` | number | No | Fuel surcharge percentage | `15.5` |
| `residentialSurcharge` | number | No | Additional fee for residential delivery | `4.95` |
| `signatureRequiredFee` | number | No | Fee for signature confirmation | `6.25` |
| `saturdayDeliveryFee` | number | No | Fee for Saturday delivery | `12.50` |
| `oversizeFee` | number | No | Fee for oversized packages | `80.00` |
| `minWeightLbs` | number | No | Minimum weight in pounds | `1` |
| `maxWeightLbs` | number | No | Maximum weight in pounds | `150` |
| `pricingTier` | string | No | Pricing tier level | `standard`, `premium`, `contract` |
| `isActive` | boolean | No | Whether this pricing is active | `true` or `false` |
| `notes` | string | No | Additional notes | `Standard ground shipping` |

#### Example CSV File

```csv
carrier,serviceCode,zone,baseRate,fuelSurchargePercent,residentialSurcharge,signatureRequiredFee,saturdayDeliveryFee,oversizeFee,minWeightLbs,maxWeightLbs,pricingTier,isActive,notes
fedex,ground,domestic,8.50,15.5,4.95,6.25,12.50,80.00,1,150,standard,true,Standard ground shipping
fedex,2day,domestic,15.75,15.5,4.95,6.25,12.50,80.00,1,150,standard,true,2-day delivery
fedex,overnight,domestic,35.00,15.5,4.95,6.25,12.50,80.00,1,150,premium,true,Next day air
ups,ground,domestic,8.25,14.8,4.85,6.15,12.00,75.00,1,150,standard,true,UPS Ground service
ups,2day,domestic,15.50,14.8,4.85,6.15,12.00,75.00,1,150,standard,true,UPS 2nd Day Air
usps,priority,domestic,7.95,0,0,3.25,0,0,1,70,standard,true,USPS Priority Mail
dhl,express,international,45.00,12.5,0,8.50,25.00,100.00,1,150,premium,true,DHL Express Worldwide
```

#### Step 3: Upload via API

```bash
POST /api/v1/admin/pricing/bulk
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "pricingRecords": [
    {
      "carrier": "fedex",
      "serviceCode": "ground",
      "zone": "domestic",
      "baseRate": 8.50,
      "fuelSurchargePercent": 15.5,
      "residentialSurcharge": 4.95,
      "isActive": true
    }
    // ... more records
  ]
}
```

#### Response

```json
{
  "success": 10,
  "failed": 2,
  "errors": [
    {
      "index": 5,
      "record": { "carrier": "fedex", ... },
      "error": "Pricing already exists for fedex - ground in zone domestic"
    }
  ]
}
```

---

### Option 2: Single Record via API

Create individual pricing records one at a time:

```bash
POST /api/v1/admin/pricing
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "carrier": "fedex",
  "serviceCode": "ground",
  "zone": "domestic",
  "baseRate": 8.50,
  "fuelSurchargePercent": 15.5,
  "residentialSurcharge": 4.95,
  "signatureRequiredFee": 6.25,
  "saturdayDeliveryFee": 12.50,
  "oversizeFee": 80.00,
  "minWeightLbs": 1,
  "maxWeightLbs": 150,
  "pricingTier": "standard",
  "isActive": true,
  "notes": "Standard FedEx Ground pricing"
}
```

---

### Option 3: Admin UI (Web Interface)

1. Log in as an admin user
2. Navigate to **Admin Dashboard** → **Pricing Management**
3. Click **"Add New Pricing"**
4. Fill in the form fields
5. Click **"Save"**

---

## Pricing Fields Explained

### Core Fields

- **carrier**: The carrier identifier. Use lowercase values: `fedex`, `ups`, `dhl`, `usps`, `ontrac`, `canadapost`
- **serviceCode**: The service level code. Common values:
  - `ground` - Standard ground shipping
  - `2day` - 2-day delivery
  - `overnight` - Next day air
  - `express` - Express international
  - `priority` - Priority mail
  - `economy` - Economy/saver option
- **zone**: Geographic zone for pricing
  - `domestic` - Within same country
  - `international` - Cross-border shipments
  - `regional` - Specific regional zones

### Rate Components

- **baseRate**: The fundamental shipping cost before any surcharges
- **fuelSurchargePercent**: Percentage added based on current fuel prices (e.g., 15.5 = 15.5%)
- **residentialSurcharge**: Flat fee for deliveries to residential addresses
- **signatureRequiredFee**: Fee when signature confirmation is required
- **saturdayDeliveryFee**: Fee for Saturday delivery service
- **oversizeFee**: Fee for packages exceeding standard dimensions

### Weight Limits

- **minWeightLbs**: Minimum package weight for this pricing tier
- **maxWeightLbs**: Maximum package weight for this pricing tier

### Metadata

- **pricingTier**: Customer pricing tier
  - `standard` - Default public pricing
  - `premium` - Premium customer pricing
  - `contract` - Negotiated contract pricing
- **isActive**: Toggle to enable/disable without deleting
- **notes**: Internal notes about this pricing configuration

---

## API Endpoints Reference

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| `GET` | `/api/v1/admin/pricing` | List all pricing records with filters | admin, owner |
| `GET` | `/api/v1/admin/pricing/:id` | Get single pricing record | admin, owner |
| `POST` | `/api/v1/admin/pricing` | Create new pricing record | admin, owner |
| `PUT` | `/api/v1/admin/pricing/:id` | Update existing pricing record | admin, owner |
| `DELETE` | `/api/v1/admin/pricing/:id` | Delete pricing record | admin, owner |
| `POST` | `/api/v1/admin/pricing/bulk` | Bulk upload pricing records | admin, owner |
| `POST` | `/api/v1/admin/pricing/:id/toggle` | Toggle active status | admin, owner |
| `GET` | `/api/v1/admin/pricing/export/csv` | Export all pricing to CSV | admin, owner |
| `GET` | `/api/v1/admin/pricing/template/csv` | Download CSV template | admin, owner |
| `GET` | `/api/v1/pricing/carrier/:carrier` | Get active pricing by carrier | team_member+ |

---

## Query Parameters for Filtering

When listing pricing records, you can filter using these query parameters:

```bash
GET /api/v1/admin/pricing?carrier=fedex&zone=domestic&isActive=true&page=1&limit=50
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `carrier` | string | Filter by carrier name (partial match) |
| `serviceCode` | string | Filter by service code (partial match) |
| `zone` | string | Filter by zone (exact match) |
| `pricingTier` | string | Filter by pricing tier |
| `isActive` | boolean | Filter by active status |
| `search` | string | Search across carrier and service fields |
| `page` | number | Page number (default: 1) |
| `limit` | number | Records per page (default: 20, max: 100) |

---

## Best Practices

1. **Use Consistent Naming**: Always use lowercase for carrier names and consistent service codes
2. **Set Weight Ranges**: Define min/max weights to prevent incorrect pricing application
3. **Keep Active Flag**: Use `isActive: false` instead of deleting outdated pricing
4. **Document Changes**: Use the `notes` field to track pricing changes and effective dates
5. **Regular Updates**: Review and update fuel surcharges monthly based on carrier announcements
6. **Test Before Deploy**: Upload a small batch first to verify format before bulk uploading hundreds of records
7. **Version Control**: Export your pricing to CSV regularly as backup before making major changes

---

## Integration with Quote System

The pricing data is automatically used by the quote system when:
1. A user submits a shipment request
2. The system queries carrier APIs for real-time rates
3. Manual pricing overrides are applied based on configured rules
4. Final quotes are calculated including all surcharges

Manual pricing takes precedence over carrier API rates when:
- The carrier API is unavailable
- Contract pricing tiers are configured for specific users
- Custom negotiated rates need to be applied

---

## Troubleshooting

### Common Errors

**"Pricing already exists"**
- Each carrier + serviceCode + zone combination must be unique
- Update existing records instead of creating duplicates

**"Invalid carrier value"**
- Ensure carrier names are lowercase: `fedex` not `FedEx`

**"Base rate must be positive"**
- All rate values must be >= 0

**CSV Upload Fails**
- Verify column headers match exactly
- Check that numeric fields don't contain currency symbols
- Ensure boolean fields use `true`/`false` (not `yes`/`no`)

---

For additional support, contact the ShipCompare Pro development team.

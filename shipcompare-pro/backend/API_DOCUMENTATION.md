# ShipCompare Backend API

## Open Router Shipment Workflow - Backend Implementation

This document describes the backend API implementation for the Open Router shipment workflow.

## API Endpoints

### 1. Get Shipping Rates

**Endpoint:** `POST /api/quotes`

**Description:** Get all available shipping rates from carriers plus the Open Router Rate.

**Request Body:**
```json
{
  "origin": {
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "destination": {
    "street1": "456 Oak Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zip": "90001",
    "country": "US"
  },
  "weight": 5,
  "weightUnit": "lb",
  "packages": [
    {
      "weight": 3,
      "dimensions": {
        "length": 10,
        "width": 8,
        "height": 6,
        "unit": "in"
      }
    }
  ],
  "isHighValue": false,
  "containsFoodOrSupplements": false
}
```

**Required Fields:**
- `origin.city`, `origin.state`, `origin.zip`, `origin.country`
- `destination.city`, `destination.state`, `destination.zip`, `destination.country`
- `weight`

**Optional Fields:**
- `packages[]` - Multiple packages with weight and dimensions
- `isHighValue` - Guarantee/high value item flag
- `containsFoodOrSupplements` - Food/supplements flag
- `declaredValue` - Package value for insurance
- `signatureRequired` - Signature requirement
- `isHazmat` - Hazardous materials flag
- `saturdayDelivery` - Saturday delivery preference
- `preferredDeliveryDate` - Preferred delivery date

**Response:**
```json
{
  "quotes": [
    {
      "id": "quote_123",
      "carrierId": "ups",
      "carrierName": "UPS",
      "serviceName": "UPS Ground",
      "serviceCode": "GROUND",
      "baseRate": 12.50,
      "surcharges": [],
      "totalCost": 12.50,
      "currency": "USD",
      "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
      "transitDays": 5,
      "isCheapest": true,
      "isFastest": false
    }
  ],
  "openRouterRate": {
    "id": "open_router_1234567890",
    "carrierId": "open_router",
    "carrierName": "Open Router (Best Rate)",
    "serviceName": "Open Router Consolidated",
    "serviceCode": "OR-BEST",
    "baseRate": 11.88,
    "surcharges": [],
    "totalCost": 11.88,
    "currency": "USD",
    "estimatedDeliveryDate": "2024-01-15T00:00:00.000Z",
    "transitDays": 5,
    "reliabilityScore": 95
  },
  "expiresAt": "2024-01-10T12:00:00.000Z",
  "quoteSessionId": "qs_1234567890_abcdef"
}
```

**Notes:**
- `openRouterRate` is always 5% lower than the lowest carrier rate
- Quotes expire after 10 minutes
- `quoteSessionId` should be used when submitting lead information

---

### 2. Submit Lead Information (Open Router Rate)

**Endpoint:** `POST /api/leads`

**Description:** Submit contact information to receive actual Open Router pricing. This is called when user clicks "Using Open Router button".

**Request Body:**
```json
{
  "email": "customer@example.com",
  "phone": "+1-555-123-4567",
  "name": "John Doe",
  "pickupAddress": "123 Main St, New York, NY 10001",
  "quoteSessionId": "qs_1234567890_abcdef",
  "shipmentDetails": {
    "weight": 5,
    "origin": "New York, NY",
    "destination": "Los Angeles, CA"
  }
}
```

**Required Fields:**
- `email` - Valid email address
- `phone` - Phone number (minimum 7 characters)

**Optional Fields:**
- `name` - Customer name
- `pickupAddress` - Pick-up address
- `quoteSessionId` - Session ID from quotes endpoint
- `shipmentDetails` - Additional shipment information

**Response:**
```json
{
  "id": "lead-uuid-here",
  "message": "Thank you! Our sales team will contact you shortly."
}
```

**Status Codes:**
- `201 Created` - Lead successfully created

---

### 3. Admin: Get All Leads

**Endpoint:** `GET /api/leads`

**Description:** Retrieve all leads (admin only - should be protected by auth in production).

**Query Parameters:**
- `status` (optional) - Filter by status: `new`, `contacted`, `qualified`, `converted`, `lost`

**Response:**
```json
[
  {
    "id": "lead-uuid",
    "email": "customer@example.com",
    "phone": "+1-555-123-4567",
    "name": "John Doe",
    "pickupAddress": "123 Main St",
    "quoteSessionId": "qs_1234567890_abcdef",
    "shipmentDetails": {...},
    "status": "new",
    "notes": null,
    "createdAt": "2024-01-10T10:00:00.000Z"
  }
]
```

---

### 4. Admin: Get Lead by ID

**Endpoint:** `GET /api/leads/:id`

**Description:** Retrieve a specific lead by ID.

**Response:** Single lead object or `null` if not found.

---

### 5. Admin: Update Lead Status

**Endpoint:** `PATCH /api/leads/:id/status`

**Description:** Update the status of a lead (admin only).

**Request Body:**
```json
{
  "status": "contacted",
  "notes": "Customer interested, following up next week"
}
```

**Valid Status Values:**
- `new` - Default status when lead is created
- `contacted` - Sales team has contacted the customer
- `qualified` - Lead is qualified and interested
- `converted` - Lead converted to a sale
- `lost` - Lead lost/not interested

**Response:** Updated lead object.

---

### 6. Admin: Delete Lead

**Endpoint:** `DELETE /api/leads/:id`

**Description:** Delete a lead (admin only).

**Response:** `204 No Content`

---

### 7. Health Check

**Endpoint:** `GET /api/health`

**Description:** Check API health status.

**Response:**
```json
{
  "status": "ok",
  "memory": "150MB"
}
```

---

## Database Schema

### Leads Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | VARCHAR | Customer email (required) |
| phone | VARCHAR | Customer phone (required) |
| name | VARCHAR | Customer name (optional) |
| pickupAddress | TEXT | Pick-up address (optional) |
| quoteSessionId | VARCHAR | Quote session reference |
| shipmentDetails | JSONB | Shipment details snapshot |
| status | ENUM | Lead status (default: 'new') |
| notes | TEXT | Admin notes |
| createdAt | TIMESTAMP | Creation timestamp |

---

## Workflow Summary

1. **Landing Page** → User clicks "Check Rates"
2. **Main Product Page** → User fills in:
   - Required: Weight, Origin (city), Destination (city)
   - Optional: Package details, High value, Food/supplements
3. **Show Rates** → `POST /api/quotes` returns all carrier rates + Open Router Rate
4. **Open Router Selection** → User clicks "Using Open Router"
5. **Contact Form** → User provides email & phone (required), name & pickup address (optional)
6. **Submit Lead** → `POST /api/leads` creates lead record
7. **Confirmation** → User receives confirmation message
8. **Sales Follow-up** → Sales team contacts customer via admin dashboard

---

## Environment Variables

Create a `.env` file in the backend root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=shipcompare

# Application
PORT=3001
NODE_ENV=development
```

---

## Installation & Running

```bash
# Install dependencies
npm install

# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

---

## Notes for Frontend Integration

1. **Quote Session**: Store `quoteSessionId` from the quotes response and include it in the lead submission
2. **Open Router Rate**: Display the `openRouterRate` prominently as it's always the best price
3. **Courier Links**: The `quotes` array may include links to direct courier checking sites (to be added in carrier adapters)
4. **Form Validation**: Backend validates all required fields; frontend should provide real-time validation
5. **Error Handling**: Handle API errors gracefully and display user-friendly messages

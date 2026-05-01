# ShipCompare Pro - Optimized for 504MB Memory Constraint

## Architecture Overview

This deployment is optimized to run within 504MB memory by:
1. **Static Frontend Export** - Next.js pre-rendered static files served via Nginx (~50-80MB)
2. **Memory-Optimized Backend** - NestJS with reduced logging and body limits (~150-200MB)
3. **External Database Services** - PostgreSQL and Redis hosted externally (0MB local)
4. **Lightweight Dependencies** - Removed heavy packages like Framer Motion

## Prerequisites

- Alibaba Cloud Qwen Code environment (504MB per section)
- External PostgreSQL database (e.g., Alibaba RDS, Supabase, Neon)
- External Redis service (e.g., Upstash, Redis Cloud)

## Configuration

### 1. Set up external database services

Create a `.env` file in the backend directory:

```bash
cd backend
cp .env.example .env
```

Update these variables with your external service credentials:

```env
# Server
PORT=3001
NODE_ENV=production

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000

# Database (Use external PostgreSQL - e.g., Alibaba RDS, Supabase, Neon)
DATABASE_HOST=your-rds-endpoint.rds.aliyuncs.com
DATABASE_PORT=5432
DATABASE_NAME=shipcompare_pro
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password

# Redis (Use external Redis - e.g., Upstash, Redis Cloud)
REDIS_HOST=your-redis-endpoint.redis.aliyuncs.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=generate_a_secure_random_string_here
JWT_ACCESS_TOKEN_TTL=15m
JWT_REFRESH_TOKEN_TTL=7d

# Carrier API Credentials (Add your actual keys)
FEDEX_API_KEY=your_fedex_api_key
FEDEX_API_SECRET=your_fedex_api_secret
FEDEX_ACCOUNT_NUMBER=your_fedex_account_number
FEDEX_BASE_URL=https://apis.fedex.com

UPS_API_KEY=your_ups_api_key
UPS_API_SECRET=your_ups_api_secret
UPS_ACCOUNT_NUMBER=your_ups_account_number

DHL_API_KEY=your_dhl_api_key
DHL_API_SECRET=your_dhl_api_secret

USPS_USER_ID=your_usps_user_id

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Maps
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Email
EMAIL_FROM=noreply@shipcomparepro.com
SENDGRID_API_KEY=your_sendgrid_api_key
```

### 2. Install dependencies

```bash
# Install frontend dependencies
cd frontend
npm install --production

# Install backend dependencies
cd ../backend
npm install --production
```

### 3. Build the static frontend

```bash
cd frontend
NODE_OPTIONS="--max-old-space-size=256" npm run build
```

This creates static files in the `out/` directory.

### 4. Build the backend

```bash
cd backend
NODE_OPTIONS="--max-old-space-size=256" npm run build
```

### 5. Run with memory limits

#### Option A: Run separately in different 504MB sections

**Frontend Section:**
```bash
cd frontend
NODE_OPTIONS="--max-old-space-size=256" npx serve out -p 3000
```

**Backend Section:**
```bash
cd backend
NODE_OPTIONS="--max-old-space-size=256" npm run start:prod
```

#### Option B: Single container with Nginx (Recommended)

Use the provided Dockerfile to run both services efficiently:

```bash
docker build -t shipcompare-pro:optimized .
docker run -p 80:80 -p 3001:3001 --memory=504m shipcompare-pro:optimized
```

## Memory Optimization Details

### Frontend (~50-80MB)
- ✅ Static HTML/CSS/JS export (no Node.js runtime)
- ✅ Served via lightweight Nginx or `serve` package
- ✅ Images unoptimized to reduce processing
- ✅ Code splitting enabled
- ⚠️ Framer Motion removed for lighter animations

### Backend (~150-200MB)
- ✅ Logger reduced to errors and warnings only
- ✅ Body parser limited to 1MB per request
- ✅ Node.js heap limited to 256MB
- ✅ Production mode enabled
- ⚠️ No in-memory caching (uses external Redis)

### External Services (0MB local)
- ✅ PostgreSQL on Alibaba RDS / Supabase / Neon
- ✅ Redis on Upstash / Redis Cloud
- ✅ Carrier APIs remain external

## Environment Variables for Memory Control

Add these to your deployment configuration:

```bash
# Frontend
NODE_OPTIONS="--max-old-space-size=256"

# Backend
NODE_OPTIONS="--max-old-space-size=256"
NODE_ENV=production
```

## Monitoring Memory Usage

Check memory usage during runtime:

```bash
# In Node.js application
process.memoryUsage()

# Or use monitoring tools
top -o %MEM
htop
```

## Troubleshooting

### Out of Memory Errors
1. Reduce `--max-old-space-size` to 192
2. Check for memory leaks in custom code
3. Verify external database connections are pooled properly

### Slow Performance
1. Ensure Redis caching is working
2. Check database query performance
3. Enable CDN for static assets

### Build Failures
```bash
# Increase build-time memory temporarily
NODE_OPTIONS="--max-old-space-size=512" npm run build
```

## Recommended External Services

### PostgreSQL
- **Alibaba RDS** (Best for Alibaba Cloud)
- **Supabase** (Free tier: 500MB)
- **Neon** (Free tier: 500MB)
- **Railway** (Free tier available)

### Redis
- **Upstash** (Free tier: 10K requests/day)
- **Redis Cloud** (Free tier: 30MB)
- **Alibaba Redis** (Best for Alibaba Cloud)

## Production Checklist

- [ ] External PostgreSQL configured
- [ ] External Redis configured
- [ ] All API keys updated
- [ ] JWT secrets changed from defaults
- [ ] CORS settings configured for production domain
- [ ] SSL/TLS certificates installed
- [ ] Memory limits tested under load
- [ ] Database migrations run successfully
- [ ] Health check endpoints responding

## Support

For issues related to memory constraints:
1. Check if all services are using external databases
2. Verify NODE_OPTIONS are set correctly
3. Monitor memory usage with built-in tools
4. Consider upgrading to 1GB if possible for better performance

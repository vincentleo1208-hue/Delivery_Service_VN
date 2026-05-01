# 🚀 SHIPCOMPARE PRO: 504MB MODULAR BUILD INSTRUCTIONS

**IMPORTANT:** Execute these steps **SEQUENTIALY**. After completing each module, you **MUST** run the cleanup commands before proceeding to the next. This prevents memory/disk overflow.

---

## 📋 OVERVIEW
- **Goal:** Build a shipping comparison app within 504MB RAM/storage
- **Strategy:** Build backend → Build frontend → Merge → Clean source code
- **Key Rule:** Never have both frontend and backend node_modules installed simultaneously

---

## 🔧 MODULE 0: PROJECT STRUCTURE SETUP

### Actions:
1. Create directory structure:
```bash
cd /workspace/shipcompare-pro
mkdir -p backend/src frontend
```

2. Create minimal `backend/package.json`:
```json
{
  "name": "shipcompare-backend",
  "version": "1.0.0",
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.0.0",
    "redis": "^4.0.0",
    "axios": "^1.0.0"
  }
}
```

3. Create `backend/.env`:
```
DATABASE_URL=your_supabase_url
REDIS_URL=your_upstash_url
NODE_ENV=production
PORT=3001
```

### 🧹 CLEANUP (REQUIRED):
```bash
rm -rf node_modules package-lock.json 2>/dev/null || true
```

---

## 🔧 MODULE 1: BACKEND BUILD

### Actions:
1. Install and build backend:
```bash
cd backend
npm install --production
npm run build
```

2. Verify build success:
```bash
ls -la dist/
```

### 🧹 CLEANUP (REQUIRED):
```bash
cd ..
# Remove TypeScript source files (keep only compiled JS)
find backend/src -type f -name "*.ts" -delete 2>/dev/null || true
# Clear npm cache
rm -rf backend/node_modules/.cache 2>/dev/null || true
# Remove unnecessary dev files
find backend -name "*.spec.ts" -delete 2>/dev/null || true
```

---

## 🔧 MODULE 2: FRONTEND STATIC BUILD

### Actions:
1. Create minimal `frontend/package.json` with Next.js static export:
```json
{
  "name": "shipcompare-frontend",
  "version": "1.0.0",
  "scripts": {
    "build": "next build",
    "export": "next export"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

2. Create `frontend/next.config.js`:
```javascript
module.exports = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true }
}
```

3. Build frontend with memory limit:
```bash
cd frontend
NODE_OPTIONS="--max-old-space-size=256" npm install
NODE_OPTIONS="--max-old-space-size=256" npm run build
```

### 🧹 CLEANUP (CRITICAL):
```bash
cd ..
# Remove ALL frontend source code, keep ONLY the 'out' folder
rm -rf frontend/src frontend/pages frontend/components frontend/public 2>/dev/null || true
rm -rf frontend/node_modules frontend/.next 2>/dev/null || true
rm -rf frontend/package.json frontend/next.config.js 2>/dev/null || true
# Verify only 'out' folder remains
ls -la frontend/
```

---

## 🔧 MODULE 3: FINAL ASSEMBLY & OPTIMIZATION

### Actions:
1. Merge frontend static files into backend:
```bash
mkdir -p backend/dist/public
if [ -d "frontend/out" ]; then
  cp -r frontend/out/* backend/dist/public/
fi
```

2. Create production start script `start.sh`:
```bash
#!/bin/bash
export NODE_OPTIONS="--max-old-space-size=256"
export PORT=${PORT:-3001}
cd backend
exec node dist/main.js
```
Make executable: `chmod +x start.sh`

3. Create root `.env` file with all required variables.

### 🧹 FINAL CLEANUP (MANDATORY):
```bash
# Remove entire frontend directory (no longer needed)
rm -rf frontend

# Remove all test files
find . -type d -name "test" -exec rm -rf {} + 2>/dev/null || true
find . -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null || true

# Remove all log files
find . -name "*.log" -delete 2>/dev/null || true

# Clear all npm caches
npm cache clean --force 2>/dev/null || true

# Remove any remaining source maps
find . -name "*.map" -delete 2>/dev/null || true

# Show final disk usage
echo "=== FINAL DISK USAGE ==="
du -sh * 
du -sh .
```

---

## ✅ VERIFICATION & TESTING

### 1. Check Memory Usage:
```bash
# Should show < 504MB total
du -sh .
```

### 2. Start Application:
```bash
./start.sh &
sleep 5
```

### 3. Test Endpoints:
```bash
# Health check
curl http://localhost:3001/api/health

# Static frontend
curl http://localhost:3001/
```

### 4. Expected Output:
- Backend health: `{"status":"ok"}`
- Frontend: HTML content
- Memory usage: < 400MB

---

## ⚠️ CRITICAL RULES FOR AI CODER

1. **SEQUENTIAL EXECUTION:** Complete Module 0 → Cleanup → Module 1 → Cleanup → Module 2 → Cleanup → Module 3 → Final Cleanup
2. **NEVER SKIP CLEANUP:** Each cleanup step is mandatory to prevent OOM errors
3. **MEMORY LIMITS:** Always use `NODE_OPTIONS="--max-old-space-size=256"` for Node.js commands
4. **NO SIMULTANEOUS INSTALLS:** Never install frontend and backend dependencies at the same time
5. **DELETE SOURCE CODE:** After building, remove all `.ts`, `.tsx`, `.js` source files; keep only compiled output
6. **EXTERNAL SERVICES:** Ensure DATABASE_URL and REDIS_URL point to external services (Supabase/Upstash)

---

## 🎯 SUCCESS CRITERIA

✅ Project runs with `./start.sh`
✅ Total disk usage < 450MB
✅ Memory usage < 504MB during runtime
✅ Both API (`/api/health`) and frontend (`/`) respond correctly
✅ No TypeScript source files remain in final build
✅ No node_modules in final deployment except backend production deps

---

**BEGIN EXECUTION NOW WITH MODULE 0**

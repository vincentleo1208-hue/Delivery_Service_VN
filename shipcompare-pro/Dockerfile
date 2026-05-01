# Multi-stage Dockerfile optimized for 504MB memory constraint
# ShipCompare Pro - Memory Efficient Deployment

# ============================================
# Stage 1: Build Frontend (Static Export)
# ============================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY frontend/ ./
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy source and build
COPY backend/ ./
ENV NODE_OPTIONS="--max-old-space-size=512"
RUN npm run build

# ============================================
# Stage 3: Production Runtime (Optimized)
# ============================================
FROM node:20-alpine AS production

# Install nginx for serving static files
RUN apk add --no-cache nginx

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy built frontend static files
COPY --from=frontend-builder /app/frontend/out ./public

# Copy built backend
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package.json ./backend/

# Copy backend .env if exists (optional)
COPY backend/.env ./backend/.env || true

# Configure nginx
COPY <<EOF /etc/nginx/nginx.conf
worker_processes 1;
error_log /var/log/nginx/error.log warn;
pid /tmp/nginx.pid;

events {
    worker_connections 256;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent"';
    
    access_log /var/log/nginx/access.log main;
    
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 30;
    types_hash_max_size 2048;
    client_max_body_size 1M;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;
    
    # Frontend - serve static files
    server {
        listen 80;
        server_name localhost;
        
        root /app/public;
        index index.html;
        
        location / {
            try_files \$uri \$uri/ /index.html;
            expires 1d;
            add_header Cache-Control "public, immutable";
        }
        
        # API proxy to backend
        location /api/ {
            proxy_pass http://localhost:3001;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 30s;
            proxy_connect_timeout 30s;
            proxy_send_timeout 30s;
            client_max_body_size 1M;
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

# Set up backend environment
WORKDIR /app/backend
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=256"
ENV PORT=3001
ENV FRONTEND_URL=http://localhost:80

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose ports
EXPOSE 80 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/health || exit 1

# Start script
COPY <<EOF /app/start.sh
#!/bin/sh
set -e

echo "Starting ShipCompare Pro with memory optimization..."
echo "Node.js max memory: 256MB"
echo "Memory limit: 504MB"

# Start backend in background
cd /app/backend
node dist/main.js &
BACKEND_PID=\$!

# Start nginx in foreground
exec nginx -g 'daemon off;'
EOF

RUN chmod +x /app/start.sh

CMD ["/app/start.sh"]

# ============================================
# Labels and metadata
# ============================================
LABEL maintainer="ShipCompare Pro"
LABEL version="1.0.0"
LABEL description="ShipCompare Pro - Memory optimized for 504MB constraint"
LABEL features="static-frontend,memory-optimized,multi-stage-build"

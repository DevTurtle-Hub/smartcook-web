# ==========================================
# Stage 1: Build Vite React App
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies cleanly
RUN npm ci

# Copy application sources and configs
COPY index.html ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY public/ ./public/
COPY src/ ./src/

# Build static production bundle
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server
# ==========================================
FROM nginx:1.27-alpine AS runner

# Remove default nginx configs
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

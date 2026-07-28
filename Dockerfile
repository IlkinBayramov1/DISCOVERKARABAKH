# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/front

# Copy frontend source
COPY front/package*.json ./
COPY front/apps ./apps
COPY front/packages ./packages
COPY front/scripts ./scripts
COPY front/tsconfig.base.json ./

# Install and build
RUN npm install
RUN node scripts/build.js

# Stage 2: Build Backend & Final Image
FROM node:18-alpine
RUN apk add --no-cache openssl libc6-compat
WORKDIR /app

# Copy backend source
COPY back ./back
WORKDIR /app/back
RUN npm install
RUN chmod +x start.sh

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/front/dist /app/front/dist

# Expose port (default Express port)
EXPOSE 4000

# Health check using wget (pre-installed in Alpine node images)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Start command running migrations first
CMD ["./start.sh"]

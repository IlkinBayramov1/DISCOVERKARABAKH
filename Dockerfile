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
WORKDIR /app

# Copy backend source
COPY back ./back
WORKDIR /app/back
RUN npm install

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/front/dist /app/front/dist

# Expose port (default Express port)
EXPOSE 4000

# Start command
# Adjust if your backend port is different
CMD ["npm", "start"]

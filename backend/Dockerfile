# Backend Dockerfile for Wiztopia Cyber Security Toy Store API
# Exposes Express API that talks to Redis for catalog, carts, and sessions.
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

COPY . .

RUN mkdir -p /app/data

ENV PORT=4000 \
    CORS_ORIGIN=http://localhost:3000 \
    REDIS_SESSION_URL=redis://redis-session:6379 \
    REDIS_CART_URL=redis://redis-cart:6379 \
    REDIS_PRODUCT_URL=redis://redis-products:6379

EXPOSE 4000

CMD ["npm", "start"]

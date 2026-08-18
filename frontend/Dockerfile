# Use a multi-stage build for optimization
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Build the app
FROM base AS builder
WORKDIR /app
ENV NEXT_PUBLIC_BASE_URL=''
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/next.config.js* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

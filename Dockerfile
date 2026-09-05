# ── Stage 1: Install dependencies ──────────────────────────────────────────────
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 3: Production ───────────────────────────────────────────────────────
FROM node:22-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy production deps
COPY --from=deps /app/node_modules ./node_modules
# Copy built output
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/server/server.js"]

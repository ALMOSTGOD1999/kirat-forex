# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Production ───────────────────────────────────────────────────────
FROM node:22-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV HOST=0.0.0.0

# Nitro bundles everything into .output — no node_modules needed
COPY --from=build /app/.output ./.output
COPY --from=build /app/package.json ./

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]

# -------------------------
# 1. BUILD STAGE
# -------------------------
FROM node:18 AS builder

WORKDIR /app

# Fix Alpine build issues
#RUN apk add --no-cache python3 make g++ libc6-compat

#ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV NEXT_TELEMETRY_DISABLED=1

# Copy dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy all source code
COPY . .

# Build Next.js
RUN npm run build

# -------------------------
# 2. RUNNER STAGE
# -------------------------
FROM node:18-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/certs ./certs
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/src ./src

EXPOSE 3001
CMD ["npm", "run", "start", "--", "-p", "3001"]

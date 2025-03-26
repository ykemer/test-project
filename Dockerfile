FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig-paths-bootstrap.js ./
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build


# Create production image
FROM node:22-alpine

WORKDIR /app


# Copy package files and install production dependencies
COPY package*.json ./
COPY tsconfig-paths-bootstrap.js ./
RUN npm ci --production

# Copy compiled files from builder
COPY --from=builder /app/build ./build

# Set the command to run the application
CMD ["node", "build/server.js"]

# Expose application port
EXPOSE 3000
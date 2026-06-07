# ##############################################################################
# BACKEND DOCKERFILE - lsd-payments
#
# Multi-stage build:
#   Stage 1 (builder) - installs all dependencies including devDependencies
#   Stage 2 (runtime) - copies only production dependencies and source
#
# Why multi-stage:
#   The builder stage has jest, nodemon, and other dev tools that should
#   never be in a production image. They increase image size and attack surface.
#   The final image only contains what is needed to run the application.
#
# Security:
#   - Non-root user (node) runs the application
#   - No shell access needed in production
#   - Minimal base image (alpine)
# ##############################################################################

# Stage 1 - install dependencies
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2 - runtime image
FROM node:20-alpine AS runtime

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules

# Copy application source
COPY --chown=appuser:appgroup src/ ./src/
COPY --chown=appuser:appgroup package.json ./

# Switch to non-root user
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "src/index.js"]

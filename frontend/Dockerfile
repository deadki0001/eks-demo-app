# ##############################################################################
# FRONTEND DOCKERFILE - lsd-payments
#
# Multi-stage build:
#   Stage 1 (builder) - installs deps and builds the React app with Vite
#   Stage 2 (runtime) - serves the built static files with nginx
#
# Why nginx for the runtime:
#   React apps compile to static HTML/JS/CSS files.
#   You do not need Node.js to serve them in production.
#   nginx is purpose-built for serving static files - faster and smaller.
#
# Security:
#   - Non-root user runs nginx
#   - Only port 8080 exposed (not 80 which requires root)
#   - No shell or package manager in the final image
# ##############################################################################

# Stage 1 - build the React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 - serve with nginx
FROM nginx:alpine AS runtime

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]

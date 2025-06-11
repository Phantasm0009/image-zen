# Use official Node.js runtime as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install system dependencies for Sharp
RUN apk add --no-cache \
    libc6-compat \
    vips-dev \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY models/ ./models/

# Create non-root user
RUN addgroup -g 1001 -S imageuser && \
    adduser -S imageuser -u 1001 -G imageuser

# Create output directory with proper permissions
RUN mkdir -p /app/output && chown -R imageuser:imageuser /app

# Switch to non-root user
USER imageuser

# Expose CLI globally
ENV PATH="/app/src:${PATH}"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node src/cli.js info || exit 1

# Set entrypoint
ENTRYPOINT ["node", "src/cli.js"]

# Default command
CMD ["--help"]

# Labels
LABEL maintainer="phantasm0009 <phantasm0009@gmail.com>"
LABEL description="Local-first image optimizer with AI-powered processing"
LABEL version="1.0.0"
LABEL repository="https://github.com/phantasm0009/image-zen"

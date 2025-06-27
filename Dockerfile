FROM node:20.19.2

# Install build dependencies (using debian instead of alpine)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libudev-dev \
    libusb-1.0-0-dev \
    curl && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    rm -rf /var/lib/apt/lists/*

# Add Rust to PATH
ENV PATH="/root/.cargo/bin:${PATH}"

WORKDIR /app

# Copy everything
COPY . .

# Clean install with complete rebuild for ARM64
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm rebuild && \
    rm -rf node_modules/lightningcss && \
    npm install lightningcss --build-from-source

EXPOSE 3000

# Run in development mode
CMD ["npm", "run", "dev"]
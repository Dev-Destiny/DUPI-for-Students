# Use Python 3.11 slim as base
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Generate Prisma Python client
RUN prisma generate --schema=../api/prisma/schema.prisma

# Expose port
EXPOSE 8000

# Start both the main API and the worker using a start script
# In production, you might want to run them as separate containers, 
# but for MVP a single container with a simple manager works well.
CMD ["python", "start.py"]

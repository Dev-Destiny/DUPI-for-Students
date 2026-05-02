# ---- Python 3.11 slim base ----
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies (libpq for psycopg2, curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for Docker layer caching
# Use repo-root relative paths because deploy platforms often build from repo root context.
COPY apps/processor/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Build-safe defaults so prisma generate does not fail
# when deployment platform does not provide DB env vars during image build.
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV DIRECT_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder

# Copy the local Prisma schema so this image can build independently
COPY apps/processor/prisma/schema.prisma ./prisma/schema.prisma

# Generate Prisma Python client using the copied schema
RUN prisma generate --schema=./prisma/schema.prisma --generator py

# Copy processor source code
COPY apps/processor/src ./src
COPY apps/processor/start.py ./start.py

# Set PYTHONPATH so imports from src/ work correctly
ENV PYTHONPATH=/app/src

EXPOSE 8000

CMD ["python", "start.py"]

# --- Base Image ---
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all files
COPY . .

# Ensure artifacts directory exists
RUN mkdir -p artifacts

# Run training automatically if artifacts not found
CMD ["bash", "start.sh"]

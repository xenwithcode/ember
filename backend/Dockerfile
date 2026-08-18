# Ember backend — Cloud Run image
# Deploys the FastAPI server on Google Cloud Run (Hackathon requirement).

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install dependencies first (better layer caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code into its package path (imports use backend.*)
COPY . /app/backend/

# Cloud Run injects PORT and connects with a plain HTTP health check
EXPOSE 8080

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080"]
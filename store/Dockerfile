FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Cloud Run sets the PORT environment variable automatically
# Using gunicorn for production as specified in best practices
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 store_service.wsgi:application
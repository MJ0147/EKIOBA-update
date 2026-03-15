FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Assuming standard Django wsgi setup. 
# Adjust 'cargo.wsgi' if your project structure uses 'cargo_service.wsgi'
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 cargo.wsgi:application
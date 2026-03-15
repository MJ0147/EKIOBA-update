FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Iyobo often uses FastAPI/Uvicorn. 
# If using standard Python, adjust this entrypoint to your main script.
CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app.main:app -k uvicorn.workers.UvicornWorker
FROM python:3.11-slim

WORKDIR /app

# Install MySQL client dependencies
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential pkg-config

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create data directory
RUN mkdir -p data

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5001"] 
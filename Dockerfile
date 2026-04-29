FROM ghcr.io/puppeteer/puppeteer:latest

USER root
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Puerto que definiste en tu server
EXPOSE 8000

CMD ["node", "server.js"]
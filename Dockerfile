# Etapa 1: build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: producción
FROM nginx:alpine

# Copia los archivos estáticos desde la etapa de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Elimina la configuración por defecto de nginx y usa una personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

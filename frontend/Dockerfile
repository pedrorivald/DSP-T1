FROM node:22 as build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build:prod

FROM nginx:stable-alpine

# Remover configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copiar a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d
# Copiar os arquivos construídos da aplicação Angular
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 8001

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]

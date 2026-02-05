# Usa a imagem oficial do Node.js para construir os arquivos estáticos
FROM node:18 AS build

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json .
RUN npm install

# Copia o restante do código do frontend para o contêiner
COPY . .

# Compila a aplicação para produção
RUN npm run build

# Usa a imagem do Nginx para servir o frontend
FROM nginx:alpine

# Copia o arquivo de configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos construídos para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expor a porta que o Nginx vai rodar
EXPOSE 80

# Comando para rodar o Nginx
CMD ["nginx", "-g", "daemon off;"]

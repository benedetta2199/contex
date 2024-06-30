FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD npm run dev

# docker build -t prova-proj .
# docker run --name prova -p 3000:3000 prova-proj
# docker ps -a
# docker rm prova
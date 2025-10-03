FROM node:22-alpine

COPY ./ /api-meteo

WORKDIR /api-meteo

RUN npm install

CMD ["npm", "run", "setup"]
FROM node:14.15.4-alpine3.10 as build_stage

WORKDIR /home/src

COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build

FROM node:14.15.4-alpine3.10 as app_stage

WORKDIR /app

COPY --from=build_stage /home/src/tsconfig.json ./
COPY --from=build_stage /home/src/ormconfig.js ./
COPY --from=build_stage /home/src/package*.json ./

RUN npm ci --production

COPY --from=build_stage /home/src/dist ./dist/

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]

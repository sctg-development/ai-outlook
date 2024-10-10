# (c) 2024 Ronan LE MEILLAT for SCTG Development
# This file is licensed under the AGPLv3 License
# See the LICENSE file for more information

FROM node:20 AS builder
COPY . /app
WORKDIR /app
RUN npm ci
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
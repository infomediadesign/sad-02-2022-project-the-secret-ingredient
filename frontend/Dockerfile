FROM node:lts-alpine AS build
WORKDIR /root/the-secret-ingredient-frontend
COPY . .
RUN yarn
RUN yarn build

FROM nginx:stable-alpine AS the-secret-ingredient-frontend
WORKDIR /usr/share/nginx/html
COPY --from=build /root/the-secret-ingredient-frontend/build ./
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
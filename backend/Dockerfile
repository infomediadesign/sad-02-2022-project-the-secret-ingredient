FROM denoland/deno:1.22.1 AS build
WORKDIR /root/backend
COPY . .
RUN deno compile --allow-all --output backend ./src/main.ts

FROM denoland/deno:1.22.1
WORKDIR /root/backend
COPY --from=build /root/backend/backend ./
CMD ./backend
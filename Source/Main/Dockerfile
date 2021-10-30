# Backend Build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS backend-build

WORKDIR /app/Source/Main
COPY Source/Main/*.csproj ./
RUN dotnet restore

COPY Source/Main ./

RUN dotnet publish -c Release -o out

# Web Build
FROM node:16 AS web-build
WORKDIR /app
COPY package.json ./

WORKDIR /app/Source/Web
COPY Source/Web/package.json ./package.json
RUN yarn

COPY .eslintrc.js /app
COPY tsconfig.json /app
COPY Source/Web ./
RUN yarn build

# Resulting Image
FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app
COPY --from=backend-build /app/Source/Main/appsettings.json ./
COPY --from=backend-build /app/Source/Main/out ./
COPY --from=web-build /app/Source/Web/wwwroot ./wwwroot

ENTRYPOINT ["dotnet", "Main.dll"]

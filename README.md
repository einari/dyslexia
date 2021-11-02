# Dyslexia accessibility project

[![Build](https://github.com/einari/dyslexia/actions/workflows/build.yml/badge.svg)](https://github.com/einari/dyslexia/actions/workflows/build.yml)
[![Publish](https://github.com/einari/dyslexia/actions/workflows/publish.yml/badge.svg)](https://github.com/einari/dyslexia/actions/workflows/publish.yml)

The goal of this project is researching and hopefully come up with a new accessibility
option for people with dyslexia (reading disability). The project is based on
the research described [here](https://onlinelibrary.wiley.com/doi/full/10.1002/brb3.2114).

You can test it out live [here](http://dyslexia.westeurope.azurecontainer.io/).
The running solution is running as a Docker instance with the image found [here](https://hub.docker.com/repository/docker/einari/dyslexia/general).

View the [changelog](./CHANGELOG.md) for details of every version as it is being developed.

## Running locally

The solution is primarily a Web solution today, the backend will be expanded on at a later stage.
To get the Web solution running, you'll need the following:

- [NodeJS v16](https://nodejs.org)
- [Yarn](https://yarnpkg.com)

Clone the project locally and open a terminal and then navigate to the `./Source/Web/` folder
and simply run the following:

```shell
yarn start:dev
```

You should see something like the following:

```shell
yarn run v1.22.11
$ webpack serve --mode=development --progress --hot
<i> [webpack-dev-server] [HPM] Proxy created: /graphql  -> http://localhost:5000
<i> [webpack-dev-server] [HPM] Proxy created: /api  -> http://localhost:5000
<i> [webpack-dev-server] Project is running at:
<i> [webpack-dev-server] Loopback: http://localhost:9000/
<i> [webpack-dev-server] On Your Network (IPv4): http://192.168.20.136:9000/
<i> [webpack-dev-server] On Your Network (IPv6): http://[fe80::1]:9000/
<i> [webpack-dev-server] Content not from webpack is served from '/Users/einari/Projects/dyslexia/Source/Web' directory
<i> [webpack-dev-server] 404s will fallback to '/'
assets by chunk 11.8 MiB (id hint: vendors) 33 assets
asset main-styles_theme_scss-9d2a5d45.e99ecb6c9da54d6b8576.bundle.js 2.61 MiB [emitted] [immutable] (name: main-styles_theme_scss-9d2a5d45)
asset main-index_scss-1d2798f1.e99ecb6c9da54d6b8576.bundle.js 2.6 MiB [emitted] [immutable] (name: main-index_scss-1d2798f1)
asset runtime~main.e99ecb6c9da54d6b8576.bundle.js 109 KiB [emitted] [immutable] (name: runtime~main)
asset main-A.e99ecb6c9da54d6b8576.bundle.js 92.8 KiB [emitted] [immutable] (name: main-A)
asset index.html 4.2 KiB [emitted]
Entrypoint main 17.2 MiB = 37 assets
1135 modules
webpack 5.58.1 compiled successfully in 2719 ms
No issues found.
```

Now you can open the browser to [http://localhost:9000](http://localhost:9000).

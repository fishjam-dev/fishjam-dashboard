# Fishjam Dashboard

![GitHub Repo stars](https://img.shields.io/github/stars/fishjam-dev/fishjam-dashboard)

## What is Fishjam Dashboard?

Fishjam Dashboard is a web application that allows you to manage your Fishjam Media Server instance.
It is a React application that uses the [Fishjam React Client API](https://github.com/fishjam-dev/react-client-sdk)
for adding and receiving tracks
and [Fishjam Server API](https://github.com/fishjam-dev/fishjam/blob/main/openapi.yaml)
for adding peers, creating rooms etc.

It was created to help Fishjam developers in testing but was later extended and adapted as a tool for tutorials and
demos.
[Here](https://fishjam-dev.github.io/fishjam-docs/tutorials/dashboard), we present a short introduction to the
dashboard and its features.

## Prerequisites

Make sure you have:

- Running [Fishjam](https://github.com/fishjam-dev/fishjam) server

## Usage

### Try it live

Up-to-date version is available online [here](https://fishjam-dev.github.io/fishjam-dashboard/)

### Use docker image

```shell
docker pull ghcr.io/fishjam-dev/fishjam-dashboard:main
```

### Run locally

```shell
git clone https://github.com/fishjam-dev/fishjam-dashboard.git
cd fishjam-dashboard
# in the cloned repo root directory
npm ci
npm run dev
```

## Quick start

Take a look at our [Dashboard quick start guide]() to get started.

## Next steps

### Once you have the dashboard up and running, you can

- [Try out our React examples](https://github.com/fishjam-dev/react-client-sdk/tree/main/examples)
- Experiment with mobile SDKs:
  - [Android](https://github.com/fishjam-dev/android-client-sdk)
  - [iOS](https://github.com/fishjam-dev/ios-client-sdk)
  - [React Native](https://github.com/fishjam-dev/react-native-client-sdk)
- [Take deep dive into Fishjam with our documentation](https://fishjam-dev.github.io/fishjam-docs/)
- [Read more about our joureney to the Fishjam Media Server](https://fishjam-dev.github.io/book/)

# Generate Server SDK client

```shell
npx @openapitools/openapi-generator-cli generate -i http://localhost:5002/openapi.json -g typescript-axios -o ./src/server-sdk
```

## Contributing

We welcome contributions to Fishjam Dashboard. Please report any bugs or issues you find or feel free to make a pull
request with your own bug fixes and/or features.

Detailed information about contributing to Fishjam Dashboard can be found in [contributing](./CONTRIBUTING.md)
document.

## Fishjam Ecosystem

|             |                                                                                                                                                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Client SDKs | [React](https://github.com/fishjam-dev/react-client-sdk), [React Native](https://github.com/fishjam-dev/react-native-client-sdk), [iOs](https://github.com/fishjam-dev/ios-client-sdk), [Android](https://github.com/fishjam-dev/android-client-sdk) |
| Server SDKs | [Elixir](https://github.com/fishjam-dev/elixir_server_sdk), [Python](https://github.com/fishjam-dev/python-server-sdk), [OpenAPI](https://fishjam-dev.github.io/fishjam-docs/api_reference/rest_api)                                                 |
| Services    | [Videoroom](https://github.com/fishjam-dev/fishjam-videoroom) - an example videoconferencing app written in elixir <br/> [Dashboard](https://github.com/fishjam-dev/fishjam-dashboard) - an internal tool used to showcase Fishjam's capabilities    |
| Resources   | [Fishjam Book](https://fishjam-dev.github.io/book/) - theory of the framework, [Docs](https://fishjam-dev.github.io/fishjam-docs/), [Tutorials](https://github.com/fishjam-dev/fishjam-clients-tutorials)                                            |
| Membrane    | Fishjam is based on [Membrane](https://membrane.stream/), [Discord](https://discord.gg/nwnfVSY)                                                                                                                                                      |
| Compositor  | [Compositor](https://github.com/membraneframework/membrane_video_compositor_plugin) - Membrane plugin to transform video                                                                                                                             |
| Protobufs   | If you want to use Fishjam on your own, you can use our [protobufs](https://github.com/fishjam-dev/protos)                                                                                                                                           |

## Copyright and License

Copyright 2023, [Software Mansion](https://swmansion.com/?utm_source=git&utm_medium=readme&utm_campaign=fishjam)

[![Software Mansion](https://logo.swmansion.com/logo?color=white&variant=desktop&width=200&tag=membrane-github)](https://swmansion.com/?utm_source=git&utm_medium=readme&utm_campaign=fishjam)

Licensed under the [Apache License, Version 2.0](LICENSE)

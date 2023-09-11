# Jellyfish React Client Demo - Dashboard

![GitHub Repo stars](https://img.shields.io/github/stars/jellyfish-dev/jellyfish-dashboard)

An internal tool used to showcase [Jellyfish](https://github.com/jellyfish-dev/jellyfish)'s capabilities.

## Prerequisites

Make sure you have:

- Running [Jellyfish](https://github.com/jellyfish-dev/jellyfish) server

## Usage

### Try it live

Up-to-date version is available online [here](https://jellyfish-dev.github.io/jellyfish-dashboard/)

### Use docker image

```shell
docker pull ghcr.io/jellyfish-dev/jellyfish-dashboard:main
```

### Run locally

```shell
git clone https://github.com/jellyfish-dev/jellyfish-dashboard.git
cd jellyfish-dashboard
# in the cloned repo root directory
npm ci
npm run dev
```

## Quick start

Take a look at our [Dashboard quick start guide]() to get started.

## Next steps

### Once you have the dashboard up and running, you can

- [Try out our React examples](https://github.com/jellyfish-dev/react-client-sdk/tree/main/examples)
- Experiment with mobile SDKs:
  - [Android](https://github.com/jellyfish-dev/android-client-sdk)
  - [iOS](https://github.com/jellyfish-dev/ios-client-sdk)
  - [React Native](https://github.com/jellyfish-dev/react-native-client-sdk)
- [Take deep dive into Jellyfish with our documentation](https://jellyfish-dev.github.io/jellyfish-docs/)
- [Read more about our joureney to the Jellyfish Media Server](https://jellyfish-dev.github.io/book/)

# Generate Server SDK client

```shell
npx @openapitools/openapi-generator-cli generate -i http://localhost:5002/openapi.json -g typescript-axios -o ./src/server-sdk
```

## Contributing

We welcome contributions to Jellyfish Dashboard. Please report any bugs or issues you find or feel free to make a pull request with your own bug fixes and/or features.

Detailed information about contributing to Jellyfish Dashboard can be found in [contributing](./CONTRIBUTING.md) document.

## Jellyfish Ecosystem

|             |                                                                                                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Client SDKs | [React](https://github.com/jellyfish-dev/react-client-sdk), [React Native](https://github.com/jellyfish-dev/react-native-client-sdk), [iOs](https://github.com/jellyfish-dev/ios-client-sdk), [Android](https://github.com/jellyfish-dev/android-client-sdk) |
| Server SDKs | [Elixir](https://github.com/jellyfish-dev/elixir_server_sdk), [Python](https://github.com/jellyfish-dev/python-server-sdk), [OpenAPI](https://jellyfish-dev.github.io/jellyfish-docs/api_reference/rest_api)                                                 |
| Services    | [Videoroom](https://github.com/jellyfish-dev/jellyfish_videoroom) - an example videoconferencing app written in elixir <br/> [Dashboard](https://github.com/jellyfish-dev/jellyfish-dashboard) - an internal tool used to showcase Jellyfish's capabilities  |
| Resources   | [Jellyfish Book](https://jellyfish-dev.github.io/book/) - theory of the framework, [Docs](https://jellyfish-dev.github.io/jellyfish-docs/), [Tutorials](https://github.com/jellyfish-dev/jellyfish-clients-tutorials)                                        |
| Membrane    | Jellyfish is based on [Membrane](https://membrane.stream/), [Discord](https://discord.gg/nwnfVSY)                                                                                                                                                            |
| Compositor  | [Compositor](https://github.com/membraneframework/membrane_video_compositor_plugin) - Membrane plugin to transform video                                                                                                                                     |
| Protobufs   | If you want to use Jellyfish on your own, you can use our [protobufs](https://github.com/jellyfish-dev/protos)                                                                                                                                               |

## Credits

This project has been built and is maintained thanks to the support from [Software Mansion](https://swmansion.com).

<img alt="Software Mansion" src="https://logo.swmansion.com/logo?color=white&variant=desktop&width=150&tag=react-native-reanimated-github"/>

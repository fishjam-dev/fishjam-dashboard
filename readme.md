# Jellyfish React Client Demo - Dashboard

## Run

```shell
# Build `react-client-sdk`. Run following command in the project root directory
npm ci
npm run build

# Change directory
cd examples/dashboard

# Start development server
npm ci
npm run dev
```

```shell
yarn run dev
# or

npm run dev
```

# Generate Server SDK client

```shell
npx @openapitools/openapi-generator-cli generate -i http://localhost:5002/openapi.json -g typescript-axios -o ./src/server-sdk
```

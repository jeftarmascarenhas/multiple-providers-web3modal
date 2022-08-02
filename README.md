# Multiple Providers with React and Web3modal

This project is using:

- [Create React App](https://create-react-app.dev/)
- [Web3Modal](https://github.com/WalletConnect/web3modal)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Walletconnect](https://github.com/walletconnect/walletconnect-monorepo)
- [Coinbase](https://github.com/coinbase/coinbase-wallet-sdk)

If you will use this repository
install using

```shell
yarn
```

If you don't want to use this repository and want create from scratch following the video

Create project with create react app

```shell
yarn create react-app multple-wallet-providers --template typescript
```

install ethers and web3modal

```shell
yarn add ethers web3modal
```

install wallet Providers

```shell
yarn add @walletconnect/web3-provider @coinbase/wallet-sd
```

Yes the create-react-app version >=5 you may run into issues building. This is because NodeJS polyfills are not included in the latest version of create-react-app.

```shell
yarn add --dev react-app-rewired process crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url buffer
```

- Create config-overrides.js in the root of your project folder with the content:

```javascript
const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
  });
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  config.ignoreWarnings = [/Failed to parse source map/];
  return config;
};
```

- Within package.json change the scripts field for start, build and test. Instead of react-scripts replace it with react-app-rewired

before:

```shell
"scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
},
```

after:

```shell
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
},
```

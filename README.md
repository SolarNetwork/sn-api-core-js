# SolarNetwork Core API - JavaScript

This project contains JavaScript code to help access the [SolarNetwork API][solarnet-api].

# Building

The build uses [NPM][npm] or [yarn][yarn]. First, initialize the dependencies:

```shell
# NPM
npm install

# or, yarn
yarn install
```

Then you can run the `build` script:

```shell
# NPM
npm run build

# or, yarn
yarn run build
```

That will produce `lib/solarnetwork-api-core.js` and `lib/solarnetwork-api-core.min.js` bundles
of all sources, transpiled into an ES5 compatible UMD module, suitable for use in both browsers
and Node.

# API docs

You can build the API documentation by running the `apidoc` script:

```shell
# NPM
npm run apidoc

# or, yarn
yarn run apidoc
```

That will produce HTML documentation in `docs/api`.

# Unit tests

The unit tests can be run by running the `test` script:

```shell
# NPM
npm test

# or, yarn
yarn test

# for more verbose output, add --verbose
yarn test -- --verbose
```

To generate a unit test code coverage report, run the `coverage` script:

```shell
# NPM
npm run coverage

# or, yarn
yarn run coverage
```

That will produce a HTML code coverage report at `coverage/index.html`.

  [npm]: https://www.npmjs.com/
  [yarn]: https://yarnpkg.com/
  [solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide

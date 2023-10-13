# SolarNetwork Core API - JavaScript

This project contains JavaScript code to help access the [SolarNetwork API][solarnet-api].

# Building

The build uses [NPM][npm] and requires Node 17+. First, initialize the dependencies:

```sh
npm ci
```

Then you can run the `build` script:

```sh
npm run build:dist
```

That will produce ES2022 modules with an entry point in `lib/index.js`.

You can also produce an ES2022 bundle by running `npm run build:bundle`. That will produce
a single bundled file at `lib/solarnetwork-api-core.es.js`.

# API docs

The API documentation is published [here](https://solarnetwork.github.io/), or
you can build the API documentation by running the `apidoc` script:

```sh
npm run apidoc
```

That will produce HTML documentation in `docs/api`.

# Unit tests

The unit tests can be run by running the `test` script:

```sh
npm test
```

That will output the test results and produce a HTML code coverage report
at `coverage/index.html`.

# Releases

Releases are done using the gitflow branching model. Gitflow must
be installed on your host system. Then you can run

```shell
npm run release
```

to version, build, commit, and publish the release. See the
[generate-release][generate-release] site for more information.

[npm]: https://www.npmjs.com/
[solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
[generate-release]: https://github.com/mrkmg/node-generate-release

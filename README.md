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

Additionally the build produces `lib/solarnetwork-api-core.es.js` and
`lib/solarnetwork-api-core.es.min.js` bundels of all sources, transpiled into an ES6 compatible
module, suitable for use in other projects with build tools that know how to use ES6 modules
(like Rollup or Webpack).

Finally, the non-transpiled source is available via the `lib.js` file which exports ES6
modules for all the modules in the project. This is suitable for use by other projects with
build tools that know how to use ES6 modules (like Rollup or Webpack) where you'd like to
transpile the source for a different target, for example ES2015.

# API docs

The API documentation is published [here](https://solarnetwork.github.io/), or
you can build the API documentation by running the `apidoc` script:

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

# Releases

Releases are done using the gitflow branching model. Gitflow must
be installed on your host system. Then you can run

```shell
npm run release
```

to version, build, commit, and publish the release. See the
[generate-release][generate-release] site for more information.

[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
[solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
[generate-release]: https://github.com/mrkmg/node-generate-release

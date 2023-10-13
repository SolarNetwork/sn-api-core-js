# SolarNetwork Core API - JavaScript

This project contains JavaScript code to help access the [SolarNetwork API][solarnet-api].
To include the library in your NPM-based project, run the following:

```sh
npm i solarnetwork-api-core
```

# API docs

The latest API documentation is published [here](https://solarnetwork.github.io/sn-api-core-js/), or
you can build the API documentation by running the `apidoc` script:

```sh
npm run apidoc
```

That will produce HTML documentation in `docs/html`.

# Example

Here's an example use of the library, targeted for use in a browser using the [Fetch API][fetch] to
access the [/datum/stream/reading][stream-reading] SolarNetwork API:

```ts
import {
	Aggregations,
	DatumFilter,
	DatumReadingTypes,
} from "solarnetwork-api-core/lib/domain";
import {
	AuthorizationV2Builder,
	HttpContentType,
	HttpHeaders,
	HttpMethod,
	SolarQueryApi,
} from "solarnetwork-api-core/lib/net";
import { DatumStreamMetadataRegistry } from "solarnetwork-api-core/lib/util";
import { datumForStreamData } from "solarnetwork-api-core/lib/util/datum";

// declare a basic "datum" interface for the data returned from SN
interface GeneralDatum extends Object {
	nodeId: number;
	sourceId: string;
	date: Date;
	[index: string]: any;
}

/**
 * Fetch hourly reading data for a datum stream using the stream API.
 *
 * @param nodeId - the node ID to fetch data for
 * @param sourceId  - the source ID to fetch data for
 * @param startDate - the minimum date
 * @param endDate - the maximum date
 * @param token - the security token to authenticate with
 * @param tokenSecret - the security token secret
 * @returns the data, as an array of general datum
 */
async function fetchReadingDatumStream(
	nodeId: number,
	sourceId: string,
	startDate: Date,
	endDate: Date,
	token: string,
	tokenSecret: string
): Promise<GeneralDatum[]> {
	const filter = new DatumFilter();
	filter.aggregation = Aggregations.Hour;
	filter.nodeId = nodeId;
	filter.sourceId = sourceId;
	filter.startDate = startDate;
	filter.endDate = endDate;

	// encode the URL request for the /datum/stream/reading API
	const urlHelper = new SolarQueryApi();
	const streamDataUrl = urlHelper.streamReadingUrl(
		DatumReadingTypes.Difference,
		filter
	);

	// create URL and auth headers for API request
	const auth = new AuthorizationV2Builder(token);
	const authHeader = auth.snDate(true).url(streamDataUrl).build(tokenSecret);
	const headers = new Headers({
		Authorization: authHeader,
		Accept: HttpContentType.APPLICATION_JSON,
	});
	headers.set(HttpHeaders.X_SN_DATE, auth.requestDateHeaderValue!);

	// make API request and get response as JSON
	const res = await fetch(streamDataUrl, {
		method: HttpMethod.GET,
		headers: headers,
	});
	const json = await res.json();

	// convert stream result into GeneralDatum objects
	const result: GeneralDatum[] = [];
	const reg = DatumStreamMetadataRegistry.fromJsonObject(json.meta);
	if (!reg) {
		return Promise.reject("JSON could not be parsed.");
	}
	for (const data of json.data) {
		const meta = reg.metadataAt(data[0]);
		if (!meta) {
			continue;
		}
		const d = datumForStreamData(data, meta)?.toObject();
		if (d) {
			result.push(d as GeneralDatum);
		}
	}
	return Promise.resolve(result);
}
```

# Upgrading from 1.x

The 2.x version of this library has changed somewhat as the 1.x library was ported
to TypeScript and updated to ES2022. Most of the same classes and methods have
been preserved, but some things have moved namespaces. Thankfully the move to
TypeScript makes refactoring an application using the 1.x API pretty straightforward,
as your IDE can usually offer the correct `import` path to use for a given class.

For example, in the 1.x API you might have:

```js
import {
	Aggregations,
	AuthorizationV2Builder,
	DatumFilter,
	DatumReadingTypes,
	DatumStreamMetadataRegistry,
	NodeDatumUrlHelper,
	streamDatumUtils,
} from "solarnetwork-api-core";
```

Most of those exist in the 2.x API, just under different import paths:

```ts
import {
	Aggregations,
	DatumFilter,
	DatumReadingTypes,
} from "solarnetwork-api-core/lib/domain";
import {
	AuthorizationV2Builder,
	SolarQueryApi, // <-- this replaces the NodeDatumUrlHelper!
} from "solarnetwork-api-core/lib/net";
import { DatumStreamMetadataRegistry } from "solarnetwork-api-core/lib/util";
import { datumForStreamData } from "solarnetwork-api-core/lib/util/datum";
```

One area that has changed somewhat significantly is the `net` namespace. The
various `*UrlHelper` classes have been reworked into `Solar*Api` classes, such
as `SolarQueryApi` and `SolarUserApi`. The methods offered on those classes
remain mostly the same as in the 1.x library, but be sure to confirm with
the API docs. Here again your IDE will generally be able to point out broken
API usage, thanks to the TypeScript definitions included in the library.

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

You can also produce an ES2022 bundle by running `npm run build:bundle`. That will produce a single
bundled file at `lib/solarnetwork-api-core.es.js`.

# Releases

Releases are done using the gitflow branching model. Gitflow must be installed on your host system.
Then you can run

```shell
npm run release
```

to version, build, commit, and publish the release. See the [generate-release][generate-release]
site for more information.

# Unit tests

The unit tests can be run by running the `test` script:

```sh
npm test
```

That will output the test results and produce a HTML code coverage report at `coverage/index.html`.

[![codecov](https://codecov.io/gh/SolarNetwork/sn-api-core-js/graph/badge.svg?token=2YA6X8LUX7)](https://codecov.io/gh/SolarNetwork/sn-api-core-js)

Having a well-tested and reliable library is a core goal of this project. Unit tests are executed
automatically after every push into the `develop` branch of this repository and their associated code
coverage is uploaded to [Codecov](https://codecov.io/github/SolarNetwork/sn-api-core-js/).

[![codecov](https://codecov.io/gh/SolarNetwork/sn-api-core-js/graphs/sunburst.svg?token=2YA6X8LUX7)](https://codecov.io/github/SolarNetwork/sn-api-core-js)

[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[generate-release]: https://github.com/mrkmg/node-generate-release
[npm]: https://www.npmjs.com/
[solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
[stream-reading]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list

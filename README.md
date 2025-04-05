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

# Example: Query datum

Here's an example use of the library, targeted for use in a browser using the [Fetch API][fetch] to
access the [/datum/stream/reading][stream-reading] SolarNetwork API:

```ts
import {
	Aggregations,
	Datum,
	DatumFilter,
	DatumReadingTypes,
	DatumStreamMetadataInfo,
	Result,
} from "solarnetwork-api-core/domain";
import {
	AuthorizationV2Builder,
	HttpContentType,
	HttpHeaders,
	HttpMethod,
	SolarQueryApi,
} from "solarnetwork-api-core/net";
import {
	DatumStreamMetadataRegistry,
	Datum as DatumUtil,
} from "solarnetwork-api-core/util";

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
): Promise<Datum[]> {
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
	const json = (await res.json()) as Result<any>;

	// convert stream result into Datum objects
	const result: Datum[] = [];
	const meta: DatumStreamMetadataInfo[] = json.meta!;
	const reg = DatumStreamMetadataRegistry.fromJsonObject(meta);
	if (!reg) {
		return Promise.reject("JSON could not be parsed.");
	}
	for (const data of json.data) {
		const meta = reg.metadataAt(data[0]);
		if (!meta) {
			continue;
		}
		const d = DatumUtil.datumForStreamData(data, meta)?.toObject();
		if (d) {
			result.push(new Datum(d.toObject()));
		}
	}
	return Promise.resolve(result);
}
```

# Example: DatumLoader

The `DatumLoader` class helps return data from the SolarQuery [/datum/list][api-datum-list]
endpoint. The class takes care of loading all results for a given search criteria, including making
multiple API requests to download all result pages when more than one page of results are available.

Here's an example of loading a month's worth of data for SolarNode 123:

```js
const filter = new DatumFilter();
filter.nodeId = 123;
filter.startDate = new Date("Sat, 1 Apr 2017 12:00:00 GMT");
filter.endDate = new Date("Mon, 1 May 2017 12:00:00 GMT");

const api = new SolarQueryApi();

new DatumLoader(api, filter).load((error, results) => {
	// results is an array of Datum objects
});
```

A Promise based API is available as well:

```js
const result = await new DatumLoader(api, filter).fetch();
```

# Example: MultiLoader

The `MultiLoader` class helps load data from multiple `Loader` objects (the
`DatumLoader` class conforms to that interface). This is useful for pulling
down data from different search criterias all in one go. For example:

```js
const filter1 = new DatumFilter();
filter1.nodeId = 123;
filter1.sourceId = "a";

const filter2 = new DatumFilter();
filter2.nodeId = 234;
filter2.sourceIds = ["b", "c"];

const api = new SolarQueryApi();

new MultiLoader([
	new DatumLoader(api, filter1),
	new DatumLoader(api, filter2),
]).load((error, results) => {
	// results is a 2-element array of Datum arrays
});

# or via promise...
const result = await new MultiLoader([
	new DatumLoader(api, filter1),
	new DatumLoader(api, filter2),
]).fetch();
```

# Example: DatumRangeFinder

The `DatumRangeFinder` class helps find the date range of available data for a set of SolarNodes.
This is useful when generating reports or charts for a set of SolarNode datum streams, so the
overall start/end dates can be determined before requesting the actual data. For example:

```js
const api = new SolarQueryApi();

const filter = new DatumFilter();
filter.nodeId = 123;
filter.sourceIds = ["a", "b"];

const range = await new DatumRangeFinder(api, filter).fetch();
```

Ranges for more complex queries can be accomplished by passing in an array of filters, like this
example, continuing from the last one:

```js
const filter2 = new DatumFilter();
filter2.nodeId = 234;
filter2.sourceId = "c";

const range2 = await new DatumRangeFinder(api, [filter1, filter2]).fetch();
```

# Example: DatumSourceFinder

The `DatumSourceFinder` class helps find the available source IDs for a set of node IDs.

```js
const api = new SolarQueryApi();

const filter = new DatumFilter();
filter.nodeId = 123;

const sources = await new DatumSourceFinder(api, filter).fetch();
```

Wildcard patterns can also be used to limit the search to a more specific set of source IDs,
and start/end dates can also be used to narrow the search, for example:

```js
const api = new SolarQueryApi();

const filter = new DatumFilter();
filter.startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
filter.sourceId = "/power/**";

const sources2 = await new DatumSourceFinder(api, filter).fetch();
```

# Example: Control Toggler

Control Toggler is a helper class that uses the SolarNetwork [Instruction API][api-queue-instr] to
request a SolarNode to set the value of a _control_ to `1` (on) or `0` (off), and the
SolarNetwork [Datum Query API][api-datum-recent] to track the value of the control.

The Instruction API is asynchronous and changing a control value requires the following steps:

-   Enqueue instruction to set control value
-   Wait for SolarNode to receive, execute, and update instruction status to `Completed` (or `Rejected`)
-   Wait for SolarNode to post updated control value datum for confirmation

Control Toggler handles these steps through a simple API for setting the desired value and using
a callback function to get notified when the value changes.

Some example SolarNode plugins that support on/off switching are:

-   [Mock Control](https://github.com/SolarNetwork/solarnetwork-node/tree/master/net.solarnetwork.node.control.mock) (good for testing)
-   [LATA switch](https://github.com/SolarNetwork/solarnetwork-node/tree/master/net.solarnetwork.node.control.jf2.lata)
-   [Modbus switch](https://github.com/SolarNetwork/solarnetwork-node/tree/master/net.solarnetwork.node.control.modbus.toggle)

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
} from "solarnetwork-api-core/domain";
import {
	AuthorizationV2Builder,
	SolarQueryApi, // <-- this replaces the NodeDatumUrlHelper!
} from "solarnetwork-api-core/net";
import { DatumStreamMetadataRegistry } from "solarnetwork-api-core/util";
import { datumForStreamData } from "solarnetwork-api-core/util/datum";
```

One area that has changed somewhat significantly is the `net` namespace. The
various `*UrlHelper` classes have been reworked into `Solar*Api` classes, such
as `SolarQueryApi` and `SolarUserApi`. The methods offered on those classes
remain mostly the same as in the 1.x library, but be sure to confirm with
the API docs. Here again your IDE will generally be able to point out broken
API usage, thanks to the TypeScript definitions included in the library.

# Building

The build uses [NPM][npm] and requires Node 20+. First, initialize the dependencies:

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

You can also produce an CJS bundle by running `npm run build:bundle:cjs`. That will produce a single
bundled file at `lib/solarnetwork-api-core.es.cjs`. This bundle embeds 3rd party dependencies as well.

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

[api-queue-instr]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarUser-API#queue-instruction
[api-datum-list]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#datum-list
[api-datum-recent]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-API#most-recent-datum
[fetch]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[generate-release]: https://github.com/mrkmg/node-generate-release
[npm]: https://www.npmjs.com/
[solarnet-api]: https://github.com/SolarNetwork/solarnetwork/wiki/API-Developer-Guide
[stream-reading]: https://github.com/SolarNetwork/solarnetwork/wiki/SolarQuery-Stream-API#datum-stream-reading-list

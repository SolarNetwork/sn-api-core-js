import { default as Aggregations } from "../../main/domain/aggregation.js";
import { default as Datum } from "../../main/domain/datum.js";
import { default as DatumFilter } from "../../main/domain/datumFilter.js";
import { DatumStreamMetadataInfo } from "../../main/domain/datumStreamMetadata.js";
import DatumReadingTypes from "../../main/domain/datumReadingType.js";
import { Result } from "../../main/domain/result.js";
import AuthorizationV2Builder from "../../main/net/authV2.js";
import {
	default as HttpHeaders,
	HttpContentType,
	HttpMethod,
} from "../../main/net/httpHeaders.js";
import SolarQueryApi from "../../main/net/solarQueryUrlHelper.js";
import { default as DatumStreamMetadataRegistry } from "../../main/util/datumStreamMetadataRegistry.js";
import { datumForStreamData } from "../../main/util/datum.js";

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
		const d = datumForStreamData(data, meta)?.toObject();
		if (d) {
			result.push(new Datum(d.toObject()));
		}
	}
	return Promise.resolve(result);
}

await fetchReadingDatumStream(
	123,
	"test",
	new Date("2025-01-01"),
	new Date("2025-01-02"),
	"token",
	"secret"
);

import { DatumFilterKeys } from "../domain/datumFilter.js";
import Instruction from "../domain/instruction.js";
import SshSession from "../domain/sshSession.js";
import AuthorizationV2Builder from "./authV2.js";
import AuthUrlHelperMixin from "./authUrlHelperMixin.js";
import { default as Environment, HostConfigInfo } from "./environment.js";
import { HttpContentType } from "./httpHeaders.js";
import { HttpMethod } from "./httpHeaders.js";
import {
	default as SolarSshUrlHelperMixin,
	SolarSshPathKey,
	SolarSshDefaultPath,
} from "./solarSshUrlHelperMixin.js";
import SolarUserApi from "./solarUserUrlHelper.js";
import UrlHelper from "./urlHelper.js";

/**
 * The SolarSsh default host.
 */
export const SolarSshDefaultHost = "ssh.solarnetwork.net";

/**
 * The SolarSsh default port.
 */
export const SolarSshDefaultPort = 8443;

/**
 * The SolarSsh REST API path.
 */
export const SolarSshApiPathV1 = "/api/v1";

/** The sub-protocol to use for SolarSSH WebSocket connections. */
export const SolarSshTerminalWebSocketSubProtocol = "solarssh";

/** The node instruction for initiating a SolarSSH connection. */
export const StartRemoteSshInstructionName = "StartRemoteSsh";

/** The node instruction for closing a SolarSSH connection. */
export const StopRemoteSshInstructionName = "StopRemoteSsh";

/** An {@link Net.UrlHelper} parameter key for a {@link Domain.SshSession} instance. */
export const SshSessionKey = "sshSession";

/**
 * Extension of `UrlHelper` for SolarSsh APIs.
 *
 * The base URL uses the configured environment to resolve the
 * `hostUrl` and a `solarSshPath` context path. If the context path
 * is not available, it will default to an empty string.
 */
export class SolarSshUrlHelper extends UrlHelper {
	readonly #userApi;

	/**
	 * Constructor.
	 *
	 * @param environment the optional initial environment to use;
	 *        if a non-`Environment` object is passed then the properties of that object will
	 *        be used to construct a new `Environment` instance
	 * @param userApi the {@link Net.SolarUserApi} to use for instruction handling
	 */
	constructor(environment?: HostConfigInfo, userApi?: SolarUserApi) {
		let env;
		if (environment) {
			env =
				environment instanceof Environment
					? (environment as typeof Environment)
					: new Environment(environment);
		} else {
			env = new Environment({
				tls: true,
				host: SolarSshDefaultHost,
				port: SolarSshDefaultPort,
			});
		}
		super(env);
		this.#userApi = userApi || new SolarUserApi();
	}

	baseUrl(): string {
		const path = this.env(SolarSshPathKey) || SolarSshDefaultPath;
		return super.baseUrl() + path + SolarSshApiPathV1;
	}

	/**
	 * A SSH session object.
	 */
	get sshSession(): SshSession | undefined {
		return this.parameter(SshSessionKey);
	}

	set sshSession(sshSession: SshSession) {
		this.parameter(SshSessionKey, sshSession);
	}

	/**
	 * Shortcut for getting the SSH session ID from the {@link Domain.SshSession#sessionId} property.
	 */
	get sshSessionId(): string | undefined {
		const session = this.sshSession;
		return session ? session.sessionId : undefined;
	}

	/**
	 * Create an instruction auth builder for pre-signing the create session request.
	 *
	 * The returned builder will be configured for a `GET` request using the
	 * `viewPendingInstructionsUrl()` URL.
	 *
	 * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
	 * @returns the builder
	 * @throws Error if no node ID available
	 */
	createSshSessionAuthBuilder(nodeId?: number): AuthorizationV2Builder {
		const node = nodeId || this.param(DatumFilterKeys.NodeId);
		if (!node) {
			throw new Error("No node ID available.");
		}
		return new AuthorizationV2Builder()
			.snDate(true)
			.method(HttpMethod.GET)
			.url(this.#userApi.viewPendingInstructionsUrl(node));
	}

	/**
	 * Create an instruction auth builder for pre-signing the start session request.
	 *
	 * The returned builder will be configured for a `POST` request using the
	 * `queueInstructionUrl()` URL  with the `StartRemoteSsh` instruction.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the builder
	 * @throws Error if no session or node ID available
	 */
	startSshSessionAuthBuilder(
		sshSession?: SshSession
	): AuthorizationV2Builder {
		const session = sshSession || this.sshSession;
		if (!session) {
			throw new Error("No SSH session available.");
		}
		const node = session.nodeId;
		if (!node) {
			throw new Error("No node ID available.");
		}
		return new AuthorizationV2Builder()
			.snDate(true)
			.method(HttpMethod.POST)
			.contentType(HttpContentType.FORM_URLENCODED)
			.url(
				this.#userApi.queueInstructionUrl(
					StartRemoteSshInstructionName,
					[
						Instruction.parameter("host", session.sshHost),
						Instruction.parameter("user", session.sessionId),
						Instruction.parameter("port", session.sshPort),
						Instruction.parameter("rport", session.reverseSshPort),
					],
					node,
					true
				)
			);
	}

	/**
	 * Create an instruction auth builder for pre-signing the stop session request.
	 *
	 * The returned builder will be configured for a `POST` request using the
	 * `queueInstructionUrl()` URL with the `StopRemoteSsh` instruction.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the builder
	 * @throws Error if no session or node ID available
	 */
	stopSshSessionAuthBuilder(sshSession?: SshSession): AuthorizationV2Builder {
		const session = sshSession || this.sshSession;
		if (!session) {
			throw new Error("No SSH session available.");
		}
		const node = session.nodeId;
		if (!node) {
			throw new Error("No node ID available.");
		}
		return new AuthorizationV2Builder()
			.snDate(true)
			.method(HttpMethod.POST)
			.contentType(HttpContentType.FORM_URLENCODED)
			.url(
				this.#userApi.queueInstructionUrl(
					StopRemoteSshInstructionName,
					[
						Instruction.parameter("host", session.sshHost),
						Instruction.parameter("user", session.sessionId),
						Instruction.parameter("port", session.sshPort),
						Instruction.parameter("rport", session.reverseSshPort),
					],
					node,
					true
				)
			);
	}

	/**
	 * Generate a URL for viewing the `StartRemoteSsh` instruction.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the URL
	 * @throws Error if no instruction ID available
	 */
	viewStartRemoteSshInstructionUrl(sshSession?: SshSession): string {
		const session = sshSession || this.sshSession;
		if (!session) {
			throw new Error("No SSH session available.");
		}
		const instrId = session.startInstructionId;
		if (!instrId) {
			throw new Error("No instruction ID available.");
		}
		return this.#userApi.viewInstructionUrl(instrId);
	}

	/**
	 * Create an instruction auth builder for signing the request to view the
	 * `StartRemoteSsh` instruction.
	 *
	 * <p>The returned builder will be configured with the same URL returned from
	 * {@link Net.SolarSshApi#viewStartRemoteSshInstructionUrl}.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the builder
	 * @throws Error if no instruction ID available
	 */
	viewStartRemoteSshInstructionAuthBuilder(
		sshSession?: SshSession
	): AuthorizationV2Builder {
		return new AuthorizationV2Builder()
			.snDate(true)
			.url(this.viewStartRemoteSshInstructionUrl(sshSession));
	}

	/**
	 * Generate a URL for viewing the `StopRemoteSsh` instruction.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the URL
	 * @throws Error if no instruction ID available
	 */
	viewStopRemoteSshInstructionUrl(sshSession?: SshSession): string {
		const session = sshSession || this.sshSession;
		if (!session) {
			throw new Error("No SSH session available.");
		}
		const instrId = session.stopInstructionId;
		if (!instrId) {
			throw new Error("No instruction ID available.");
		}
		return this.#userApi.viewInstructionUrl(instrId);
	}

	/**
	 * Create an instruction auth builder for signing the request to view the
	 * `StopRemoteSsh` instruction.
	 *
	 * The returned builder will be configured with the same URL returned from
	 * {@link Net.SolarSshApi#viewStopRemoteSshInstructionUrl}.
	 *
	 * @param sshSession the session to use; if not provided the {@link Net.SolarSshApi#sshSession} property of this object will be used
	 * @returns the builder
	 * @throws Error if no instruction ID available
	 */
	viewStopRemoteSshInstructionAuthBuilder(
		sshSession?: SshSession
	): AuthorizationV2Builder {
		return new AuthorizationV2Builder()
			.snDate(true)
			.url(this.viewStopRemoteSshInstructionUrl(sshSession));
	}

	/**
	 * Create an instruction auth builder for pre-signing the terminal connect request.
	 *
	 * The returned builder will be configured for a `GET` request using the
	 *`viewNodeMetadataUrl()` URL.
	 *
	 * @param nodeId the node ID to connect to; if not provided the `nodeId` parameter of this object will be used
	 * @returns the builder
	 */
	connectTerminalWebSocketAuthBuilder(
		nodeId?: number
	): AuthorizationV2Builder {
		const node = nodeId || this.param(DatumFilterKeys.NodeId);
		if (!node) {
			throw new Error("No node ID available.");
		}
		return new AuthorizationV2Builder()
			.snDate(true)
			.method(HttpMethod.GET)
			.url(this.#userApi.viewNodeMetadataUrl(node));
	}
}

/**
 * The SolarSSH API URL helper.
 */
export default class SolarSshApi extends AuthUrlHelperMixin(
	SolarSshUrlHelperMixin(SolarSshUrlHelper)
) {}

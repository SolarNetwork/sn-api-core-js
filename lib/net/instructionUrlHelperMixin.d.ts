import { default as InstructionParameter } from "../domain/instructionParameter.js";
import { InstructionState } from "../domain/instructionState.js";
import { UrlHelperConstructor } from "./urlHelper.js";
/**
 * Common API for queue instruction requests.
 */
interface QueueInstructionRequestBase {
    /** The node ID. */
    nodeId: number;
    /** The instruction topic. */
    topic?: string;
}
/**
 * A queue instruction request.
 */
interface QueueInstructionRequest extends QueueInstructionRequestBase {
    /** The instruction parameters. */
    parameters?: InstructionParameter[];
}
/**
 * A simplified queue instruction request.
 *
 * This request does not support repeated parameter names.
 */
interface QueueInstructionSimpleRequest extends QueueInstructionRequestBase {
    /** The simple instruction parameters. */
    params?: Record<string, string>;
}
/**
 * Create a InstructionUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
declare const InstructionUrlHelperMixin: <T extends UrlHelperConstructor>(superclass: T) => {
    new (...args: any[]): {
        /**
         * Generate a URL to get all details for a specific instruction.
         *
         * @param instructionId - the instruction ID to get
         * @returns the URL
         */
        viewInstructionUrl(instructionId: number): string;
        /**
         * Generate a URL for viewing active instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewActiveInstructionsUrl(nodeId?: number): string;
        /**
         * Generate a URL for viewing pending instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewPendingInstructionsUrl(nodeId?: number): string;
        /**
         * Generate a URL for changing the state of an instruction.
         *
         * @param instructionId - the instruction ID to update
         * @param state - the instruction state to set
         * @returns the URL
         * @see the {@link Domain.InstructionStates} enum for possible state values
         */
        updateInstructionStateUrl(instructionId: number, state: InstructionState): string;
        "__#private@#instructionUrl"(exec: boolean, topic: string, parameters?: InstructionParameter[], nodeIds?: number[] | number, topicAsParam?: boolean): string;
        /**
         * Generate a URL for posting an instruction request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeId the specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @param topicAsParam `true` to encode topic as request parameter, `false` as the final URL path segment
         * @returns the URL
         */
        queueInstructionUrl(topic: string, parameters?: InstructionParameter[], nodeId?: number, topicAsParam?: boolean): string;
        /**
         * Generate a URL for posting instruction requests for multiple nodes.
         *
         * @param topic the instruction topic
         * @param parameters an array of parameter objects
         * @param nodeIds a list of node IDs to use; if not provided the `nodeIds` parameter of this class will be used
         * @param topicAsParam `true` to encode topic as request parameter, `false` as the final URL path segment
         * @returns the URL
         */
        queueInstructionsUrl(topic: string, parameters?: InstructionParameter[], nodeIds?: number[], topicAsParam?: boolean): string;
        /**
         * Generate a URL for posting an instruction execution request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeIds - the specific node ID(s) to use; if not provided the `nodeIds` parameter of this class will be used
         * @returns the URL
         */
        execInstructionUrl(topic: string, parameters?: InstructionParameter[], nodeIds?: number[] | number): string;
        /**
         * Create a queue instruction request object, suitable for submitting as JSON content.
         *
         * @param topic the topic to include (can be omitted if the topic is included in the request URL)
         * @param parameters the parameter to include
         * @param nodeId - the specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @param executionDate - a deferred execution date; this will be encoded as a `executionDate` parameter as an
         *     ISO 8601 timestamp value
         * @returns the request, encoded as a {@link Net.QueueInstructionSimpleRequest} if possible
         */
        queueInstructionRequest(topic?: string, parameters?: InstructionParameter[], nodeId?: number, executionDate?: Date): QueueInstructionRequest | QueueInstructionSimpleRequest;
        readonly "__#private@#environment": import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        readonly "__#private@#parameters": import("../util/configuration.js").default;
        get environment(): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        get parameters(): import("../util/configuration.js").default;
        env(key: string): any;
        env(key: string, val: any): import("./environment.js").EnvironmentConfig & import("./environment.js").HostConfig;
        parameter(key: string): any;
        parameter(key: string, val: any): import("../util/configuration.js").default;
        param<T_1>(key: string): T_1 | undefined;
        hostUrl(): string;
        hostRequestUrl(): string;
        toRequestUrl(url: string): string;
        hostWebSocketUrl(): string;
        baseUrl(): string;
        resolveTemplatePath(template: string): string;
        resolveTemplateUrl(template: string): string;
        datumFilter(): import("../domain/datumFilter.js").default;
    };
    /**
     * Generate URL encoded query string for posting instruction parameters.
     *
     * @param parameters - an array of parameter objects
     * @returns the URL encoded query string, or an empty string if `parameters` is empty
     */
    urlEncodeInstructionParameters(parameters?: InstructionParameter[]): string;
    /**
     * Test if a list of instructions can be encoded as a {@link Net.QueueInstructionSimpleRequest} object.
     * @param parameters the parameters to inspect
     * @returns `true` if a `QueueInstructionSimpleRequest` can be used to encode the instruction parameters
     */
    canUseSimpleRequest(parameters?: InstructionParameter[]): boolean;
    /**
     * Create an instruction parameter.
     *
     * @param name the parameter name
     * @param value the parameter value
     * @returns the parameter object
     * @see {@link Domain.Instruction.parameter}
     */
    instructionParameter(name: string, value: string): InstructionParameter;
} & T;
export default InstructionUrlHelperMixin;
export { type QueueInstructionRequest, type QueueInstructionSimpleRequest };
//# sourceMappingURL=instructionUrlHelperMixin.d.ts.map
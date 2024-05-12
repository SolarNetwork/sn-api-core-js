import { DatumFilterKeys } from "../domain/datumFilter.js";
import { CommonInstructionParameterName, } from "../domain/instructionParameter.js";
/**
 * Create a InstructionUrlHelperMixin class.
 *
 * @param superclass - the UrlHelper class to mix onto
 * @return the mixin class
 * @ignore
 */
const InstructionUrlHelperMixin = (superclass) => {
    var _a;
    /**
     * A mixin class that adds SolarNode instruction support to {@link Net.UrlHelper}.
     */
    return class InstructionUrlHelperMixin extends superclass {
        /**
         * Generate a URL to get all details for a specific instruction.
         *
         * @param instructionId - the instruction ID to get
         * @returns the URL
         */
        viewInstructionUrl(instructionId) {
            return (this.baseUrl() +
                "/instr/view?id=" +
                encodeURIComponent(instructionId));
        }
        /**
         * Generate a URL for viewing active instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewActiveInstructionsUrl(nodeId) {
            return (this.baseUrl() +
                "/instr/viewActive?nodeId=" +
                (nodeId || this.param(DatumFilterKeys.NodeId)));
        }
        /**
         * Generate a URL for viewing pending instructions.
         *
         * @param nodeId - a specific node ID to use; if not provided the `nodeId` parameter of this instance will be used
         * @returns the URL
         */
        viewPendingInstructionsUrl(nodeId) {
            return (this.baseUrl() +
                "/instr/viewPending?nodeId=" +
                (nodeId || this.param(DatumFilterKeys.NodeId)));
        }
        /**
         * Generate a URL for changing the state of an instruction.
         *
         * @param instructionId - the instruction ID to update
         * @param state - the instruction state to set
         * @returns the URL
         * @see the {@link Domain.InstructionStates} enum for possible state values
         */
        updateInstructionStateUrl(instructionId, state) {
            return (this.baseUrl() +
                "/instr/updateState?id=" +
                encodeURIComponent(instructionId) +
                "&state=" +
                encodeURIComponent(state.name));
        }
        /**
         * Generate URL encoded query string for posting instruction parameters.
         *
         * @param parameters - an array of parameter objects
         * @returns the URL encoded query string, or an empty string if `parameters` is empty
         */
        static urlEncodeInstructionParameters(parameters) {
            let url = "", i, len;
            if (Array.isArray(parameters)) {
                for (i = 0, len = parameters.length; i < len; i += 1) {
                    if (url.length > 0) {
                        url += "&";
                    }
                    url +=
                        encodeURIComponent("parameters[" + i + "].name") +
                            "=" +
                            encodeURIComponent(parameters[i].name) +
                            "&" +
                            encodeURIComponent("parameters[" + i + "].value") +
                            "=" +
                            encodeURIComponent(parameters[i].value);
                }
            }
            return url;
        }
        #instructionUrl(exec, topic, parameters, nodeIds) {
            const nodes = Array.isArray(nodeIds)
                ? nodeIds
                : nodeIds !== undefined
                    ? [nodeIds]
                    : this.param(DatumFilterKeys.NodeIds);
            let url = this.baseUrl() +
                "/instr/" +
                (exec ? "exec" : "add") +
                "/" +
                encodeURIComponent(topic);
            if (nodes && nodes.length) {
                url += "?";
                if (nodes.length > 1) {
                    url += "nodeIds=" + nodes.join(",");
                }
                else {
                    url += "nodeId=" + nodes[0];
                }
            }
            if (Array.isArray(parameters) && parameters.length > 0) {
                if (nodes && nodes.length) {
                    url += "&";
                }
                else {
                    url += "?";
                }
                url +=
                    InstructionUrlHelperMixin.urlEncodeInstructionParameters(parameters);
            }
            return url;
        }
        /**
         * Generate a URL for posting an instruction request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeId - the specific node ID to use; if not provided the `nodeId` parameter of this class will be used
         * @returns the URL
         */
        queueInstructionUrl(topic, parameters, nodeId) {
            return this.#instructionUrl(false, topic, parameters, nodeId);
        }
        /**
         * Generate a URL for posting instruction requests for multiple nodes.
         *
         * @param topic the instruction topic
         * @param parameters an array of parameter objects
         * @param nodeIds - a list of node IDs to use; if not provided the `nodeIds` parameter of this class will be used
         * @returns the URL
         */
        queueInstructionsUrl(topic, parameters, nodeIds) {
            return this.#instructionUrl(false, topic, parameters, nodeIds);
        }
        /**
         * Generate a URL for posting an instruction execution request.
         *
         * @param topic - the instruction topic
         * @param parameters - an array of parameter objects
         * @param nodeIds - the specific node ID(s) to use; if not provided the `nodeIds` parameter of this class will be used
         * @returns the URL
         */
        execInstructionUrl(topic, parameters, nodeIds) {
            return this.#instructionUrl(true, topic, parameters, nodeIds);
        }
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
        queueInstructionRequest(topic, parameters, nodeId, executionDate) {
            const result = {
                nodeId: nodeId || this.param(DatumFilterKeys.NodeId),
            };
            if (topic) {
                result.topic = topic;
            }
            if (executionDate) {
                const executionDateParam = {
                    name: CommonInstructionParameterName.ExecutionDate,
                    value: executionDate.toISOString(),
                };
                if (parameters && parameters.length > 0) {
                    const newParameters = [...parameters];
                    // replace all executionDate parameters (should be only 1)
                    let exists = false;
                    for (let i = 0; i < newParameters.length; i += 1) {
                        const param = newParameters[i];
                        if (param.name ===
                            CommonInstructionParameterName.ExecutionDate) {
                            // replace
                            newParameters[i] = executionDateParam;
                            exists = true;
                        }
                    }
                    // executionDate parameter not replaced, so add now
                    if (!exists) {
                        newParameters.push(executionDateParam);
                    }
                    parameters = newParameters;
                }
                else {
                    parameters = [executionDateParam];
                }
            }
            // check for any duplicate parameter names; if none found use simple request
            if (parameters && parameters.length > 0) {
                if (InstructionUrlHelperMixin.canUseSimpleRequest(parameters)) {
                    const params = {};
                    for (const param of parameters) {
                        if (!param.name) {
                            continue;
                        }
                        params[param.name] = param.value;
                    }
                    if (Object.keys(params).length > 0) {
                        result.params =
                            params;
                    }
                }
                else {
                    result.parameters = parameters;
                }
            }
            return result;
        }
        /**
         * Test if a list of instructions can be encoded as a {@link Net.QueueInstructionSimpleRequest} object.
         * @param parameters the parameters to inspect
         * @returns `true` if a `QueueInstructionSimpleRequest` can be used to encode the instruction parameters
         */
        static canUseSimpleRequest(parameters) {
            const len = Array.isArray(parameters) ? parameters.length : 0;
            if (len < 2) {
                return true;
            }
            const seen = new Set();
            for (let i = 0; i < len; i += 1) {
                const k = parameters[i].name;
                if (!k) {
                    continue;
                }
                if (seen.has(k)) {
                    return false;
                }
                seen.add(k);
            }
            return true;
        }
        /**
         * Create an instruction parameter suitable to passing to {@link Net.InstructionUrlHelperMixin#queueInstructionUrl}.
         *
         * @param name the parameter name
         * @param value the parameter value
         * @returns the parameter object
         */
        static instructionParameter(name, value) {
            return { name: name, value: value };
        }
    };
};
export default InstructionUrlHelperMixin;
//# sourceMappingURL=instructionUrlHelperMixin.js.map
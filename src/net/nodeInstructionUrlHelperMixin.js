import UrlHelper from "./urlHelper";
import NodeUrlHelperMixin from "./nodeUrlHelperMixin";
import UserUrlHelperMixin from "./userUrlHelperMixin";

/**
 * Create a NodeInstructionUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeInstructionUrlHelperMixin} the mixin class
 */
const NodeInstructionUrlHelperMixin = superclass =>
	/**
	 * A mixin class that adds SolarNode instruction support to {@link module:net~UrlHelper}.
	 *
	 * @mixin
	 * @alias module:net~NodeInstructionUrlHelperMixin
	 */
	class extends superclass {
		/**
		 * Generate a URL to get all details for a specific instruction.
		 *
		 * @param {number} instructionId the instruction ID to get
		 * @returns {string} the URL
		 */
		viewInstructionUrl(instructionId) {
			return this.baseUrl() + "/instr/view?id=" + encodeURIComponent(instructionId);
		}

		/**
		 * Generate a URL for viewing active instructions.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @returns {string} the URL
		 */
		viewActiveInstructionsUrl(nodeId) {
			return this.baseUrl() + "/instr/viewActive?nodeId=" + (nodeId || this.nodeId);
		}

		/**
		 * Generate a URL for viewing pending instructions.
		 *
		 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
		 * @returns {string} the URL
		 */
		viewPendingInstructionsUrl(nodeId) {
			return this.baseUrl() + "/instr/viewPending?nodeId=" + (nodeId || this.nodeId);
		}

		/**
		 * Generate a URL for changing the state of an instruction.
		 *
		 * @param {number} instructionId the instruction ID to update
		 * @param {InstructionState} state the instruction state to set
		 * @returns {string} the URL
		 * @see the {@link InstructionStates} enum for possible state values
		 */
		updateInstructionStateUrl(instructionId, state) {
			return (
				this.baseUrl() +
				"/instr/updateState?id=" +
				encodeURIComponent(instructionId) +
				"&state=" +
				encodeURIComponent(state.name)
			);
		}

		/**
		 * Generate URL encoded query string for posting instruction parameters.
		 *
		 * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
		 * @returns {string} the URL encoded query string, or an empty string if `parameters` is empty
		 */
		urlEncodeInstructionParameters(parameters) {
			var url = "",
				i,
				len;
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

		/**
		 * Generate a URL for posting an instruction request.
		 *
		 * @param {string} topic the instruction topic
		 * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
		 * @param {number} [nodeId] a specific node ID to use; if not provided the `nodeId` property of this class will be used
		 * @returns {string} the URL
		 */
		queueInstructionUrl(topic, parameters, nodeId) {
			var url =
				this.baseUrl() +
				"/instr/add/" +
				encodeURIComponent(topic) +
				"?nodeId=" +
				(nodeId || this.nodeId);
			if (Array.isArray(parameters) && parameters.length > 0) {
				url += "&" + this.urlEncodeInstructionParameters(parameters);
			}
			return url;
		}

		/**
		 * Generate a URL for posting instruction requests for multiple nodes.
		 *
		 * @param {string} topic the instruction topic
		 * @param {Object[]} [parameters] an array of parameter objects in the form `{name:n1, value:v1}`
		 * @param {number[]} [nodeIds] a list of node IDs to use; if not provided the `nodeIds` property of this class will be used
		 * @returns {string} the URL
		 */
		queueInstructionsUrl(topic, parameters, nodeIds) {
			var url =
				this.baseUrl() +
				"/instr/add/" +
				encodeURIComponent(topic) +
				"?nodeIds=" +
				(Array.isArray(nodeIds) && nodeIds.length > 0
					? nodeIds.join(",")
					: Array.isArray(this.nodeIds)
					? this.nodeIds.join(",")
					: "");
			if (Array.isArray(parameters) && parameters.length > 0) {
				url += "&" + this.urlEncodeInstructionParameters(parameters);
			}
			return url;
		}

		/**
		 * Create an instruction parameter suitable to passing to {@link NodeInstructionUrlHelperMixin#queueInstructionUrl}.
		 *
		 * @param {string} name the parameter name
		 * @param {*} value the parameter value
		 * @returns {object} with `name` and `value` properties
		 */
		static instructionParameter(name, value) {
			return { name: name, value: value };
		}
	};

/**
 * A concrete {@link UrlHelper} with the {@link module:net~NodeInstructionUrlHelperMixin},
 * {@link module:net~UserUrlHelperMixin}, and {@link module:net~NodeUrlHelperMixin} mixins.
 *
 * @mixes module:net~NodeInstructionUrlHelperMixin
 * @mixes module:net~UserUrlHelperMixin
 * @mixes module:net~NodeUrlHelperMixin
 * @extends module:net~UrlHelper
 * @alias module:net~NodeInstructionUrlHelper
 */
class NodeInstructionUrlHelper extends NodeInstructionUrlHelperMixin(
	UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))
) {}

/**
 * The static {@link NodeInstructionUrlHelperMixin#instructionParameter} method so it can be imported directly.
 *
 * @alias module:net~instructionParameter
 */
const instructionParameter = NodeInstructionUrlHelper.instructionParameter;

export default NodeInstructionUrlHelperMixin;
export { instructionParameter, NodeInstructionUrlHelper };

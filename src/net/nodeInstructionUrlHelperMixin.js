/** @module net */

import UrlHelper from './urlHelper';
import NodeUrlHelperMixin from './nodeUrlHelperMixin';
import UserUrlHelperMixin from './userUrlHelperMixin'

/**
 * Create a NodeInstructionUrlHelperMixin class.
 *
 * @exports net
 * @param {module:net~UrlHelper} superclass the UrlHelper class to mix onto
 * @return {module:net~NodeInstructionUrlHelperMixin} the mixin class
 */
const NodeInstructionUrlHelperMixin = (superclass) => 

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
		return (this.baseUrl() +'/instr/view?id=' +encodeURIComponent(instructionId));
	}

	/**
	 * Generate a URL for viewing active instructions.
	 * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @returns {string} the URL
	 */
	viewActiveInstructionsUrl(nodeId) {
		return (this.baseUrl() +'/instr/viewActive?nodeId=' 
			+(nodeId || this.nodeId));
	}

	/**
	 * Generate a URL for viewing pending instructions.
	 * 
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @returns {string} the URL
	 */
	viewPendingInstructionsUrl(nodeId) {
		return (this.baseUrl() +'/instr/viewPending?nodeId=' 
			+(nodeId || this.nodeId));
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
		return (this.baseUrl()
			+'/instr/updateState?id=' +encodeURIComponent(instructionId)
			+'&state=' +encodeURIComponent(state.name));
	}

	/**
	 * Generate a URL for posting an instruction request.
	 *
	 * @param {string} topic the instruction topic.
	 * @param {Object[]} [parameters] an array of parameter objects in the form <code>{name:n1, value:v1}</code>.
	 * @param {number} [nodeId] a specific node ID to use; if not provided the <code>nodeId</code> property of this class will be used
	 * @returns {string} the URL
	 */
	queueInstructionUrl(topic, parameters, nodeId) {
		var url = (this.baseUrl()
			+'/instr/add?nodeId=' +(nodeId || this.nodeId)
			+'&topic=' +encodeURIComponent(topic));
		var i, len;
		if ( Array.isArray(parameters) ) {
			for ( i = 0, len = parameters.length; i < len; i++ ) {
				url += '&' +encodeURIComponent('parameters['+i+'].name') +'=' +encodeURIComponent(parameters[i].name)
					+ '&' +encodeURIComponent('parameters['+i+'].value') +'=' +encodeURIComponent(parameters[i].value);
			}
		}
		return url;
	}

	/**
	 * Create an instruction parameter suitable to passing to {@link NodeInstructionUrlHelperMixin#queueInstructionUrl}.
	 * 
	 * @param {string} name the parameter name 
	 * @param {*} value the parameter value
	 * @returns {object} with <code>name</code> and <code>value</code> properties
	 */
	static instructionParameter(name, value) {
		return {name:name, value:value};
	}
};

/**
 * A concrete {@link UrlHelper} with the {@link NodeInstructionUrlHelperMixin},  {@link UserUrlHelperMixin}, and
 * {@link NodeUrlHelperMixin} mixins.
 * 
 * @mixes NodeInstructionUrlHelperMixin
 * @mixes UserUrlHelperMixin
 * @mixes NodeUrlHelperMixin
 * @extends UrlHelper
 */
class NodeInstructionUrlHelper extends NodeInstructionUrlHelperMixin(UserUrlHelperMixin(NodeUrlHelperMixin(UrlHelper))) {

}

/**
 * The static {@link NodeInstructionUrlHelperMixin#instructionParameter} method so it can be imported directly.
 */
const instructionParameter = NodeInstructionUrlHelper.instructionParameter;

export default NodeInstructionUrlHelperMixin;
export { instructionParameter, NodeInstructionUrlHelper };
import typescript from "@rollup/plugin-typescript";

export default {
	external: (id) => {
		return /(crypto-js|d3-|uri-js)/.test(id);
	},
	input: "src/main/index.ts",
	output: {
		globals: {
			"d3-array": "d3",
			"d3-collection": "d3",
			"d3-time": "d3",
			"d3-time-format": "d3",
			"crypto-js/enc-base64.js": "CryptoJS.Base64",
			"crypto-js/enc-hex.js": "CryptoJS.Hex",
			"crypto-js/hmac-sha256.js": "CryptoJS.HmacSHA256",
			"crypto-js/sha256.js": "CryptoJS.SHA256",
			"uri-js": "URI",
		},
	},
	plugins: [typescript()],
};

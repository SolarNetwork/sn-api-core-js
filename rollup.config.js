import { babel } from "@rollup/plugin-babel";
import includePaths from "rollup-plugin-includepaths";

const includePathOptions = {
	include: {},
	paths: ["src"],
	external: [],
	extensions: [".js"],
};

export default {
	external: (id) => {
		return /(crypto-js|d3-|uri-js)/.test(id);
	},
	output: {
		globals: {
			"d3-array": "d3",
			"d3-collection": "d3",
			"d3-time": "d3",
			"d3-time-format": "d3",
			"crypto-js/enc-base64": "CryptoJS.Base64",
			"crypto-js/enc-hex": "CryptoJS.Hex",
			"crypto-js/hmac-sha256": "CryptoJS.HmacSHA256",
			"crypto-js/sha256": "CryptoJS.SHA256",
			"uri-js": "URI",
		},
	},
	plugins: [
		includePaths(includePathOptions),
		babel({
			babelHelpers: "bundled",
			exclude: "node_modules/**",
			babelrc: false,
			plugins: [],
			presets: [
				[
					"@babel/env",
					{
						targets: {
							browsers: ["last 2 versions"],
							node: "current",
						},
						modules: false,
					},
				],
			],
		}),
	],
};

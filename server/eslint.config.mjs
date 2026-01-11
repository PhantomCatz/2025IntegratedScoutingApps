import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig } from 'eslint/config';

export default defineConfig(
	eslint.configs.recommended,
	tseslint.configs.strictTypeChecked,
	tseslint.configs.recommendedTypeChecked,
	{
		settings: {
			react: {
				version: "detect",
			},
		},
		languageOptions: {
			parserOptions: {
				projectService: true,
			},
		},
		rules: {
			"no-unused-vars": "off", // we have it on for @typescript-eslint/no-unused-vars
			"no-control-regex": "off",
			"eqeqeq": "error",
			"curly": ["error", "all"],
			"default-case": "error",
			"no-template-curly-in-string": "error",
			"no-useless-assignment": "warn",
			"no-self-compare": "warn",
			"no-promise-executor-return": "error",
			"no-await-in-loop": "error",
			"array-callback-return": "error",
			"no-use-before-define": ["error", {
				"functions": false,
			}],
			"yoda": "warn",
			"prefer-promise-reject-errors": "error",
			"prefer-const": "error",
			"prefer-exponentiation-operator": "warn",
			"one-var": ["error", "never"],
			"no-var": "error",
			"no-useless-rename": "warn",
			"no-useless-concat": "error",
			"no-useless-catch": "error",
			"no-useless-call": "error",
			"no-undefined": "warn",
			"no-sequences": "error",
			"no-return-assign": "error",
			"no-octal-escape": "error",
			"no-octal": "error",
			"no-negated-condition": "warn",
			"no-lonely-if": "error",
			"no-implicit-coercion": "error",
			"no-extra-bind": "error",
			"max-depth": "error",
			"id-match": "error",
			"default-param-last": "error",


			// "@typescript-eslint/no-unused-vars": ["warn", {
			// 	"args": "all",
			// 	"caughtErrors": "all",
			// 	"argsIgnorePattern": "^_",
			// 	"caughtErrorsIgnorePattern": "^_",
			// 	"destructuredArrayIgnorePattern": "^_",
			// 	"varsIgnorePattern": "^_",
			// 	"ignoreRestSiblings": true
			// }],
			// "@typescript-eslint/no-explicit-any": "error",
			// "@typescript-eslint/no-namespace": "off", // see https://github.com/microsoft/TypeScript/issues/30994
			// "@typescript-eslint/default-param-last": "warn",
			// "@typescript-eslint/explicit-function-return-type": ["error", {
			// 	allowExpressions: true
			// }],
			// "@typescript-eslint/no-magic-numbers": ["warn", {
			// 	ignore: [0, 1], // i hope i don't regret this...
			// 	ignoreDefaultValues: true,
			// 	enforceConst: false,
			// 	ignoreEnums: true,
			// 	ignoreNumericLiteralTypes: true,
			// 	ignoreTypeIndexes: true,
			// }],
			// "@typescript-eslint/no-unnecessary-condition": "warn",
			// "@typescript-eslint/no-inferrable-types": ["warn", {
			// 	ignoreParameters: true,
			// 	ignoreProperties: true
			// }],
			// "@typescript-eslint/restrict-template-expressions": "off",
			// "@typescript-eslint/no-misused-promises": ["error", {
			// 	checksVoidReturn: false
			// }],
		}
	}
);

module.exports = {
	parser: "@typescript-eslint/parser",
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
	plugins: ["@typescript-eslint"],
	env: {
		browser: true,
		node: true,
	},
	ignorePatterns: ["dist", "build", "node_modules"],
	rules: {
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-empty-object-type": "off",
		"@typescript-eslint/no-empty-interface": "off",
	},
};

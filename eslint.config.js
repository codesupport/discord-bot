const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const tseslint = require("typescript-eslint");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [
    {
        ignores: ["build/", "coverage/", "node_modules/"]
    },
    ...compat.extends("codesupport"),
    {
        files: ["**/*.ts", "**/*.js"],
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 6,
            sourceType: "module"
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin
        },
        rules: {
            "no-useless-constructor": "off",
            "no-empty-function": "off",
            "new-cap": "off",
            "no-unused-vars": "off",
            "no-invalid-this": "off",
            "multiline-ternary": 0,
            "curly": ["error", "multi-line"],
            "lines-between-class-members": "off",
            "space-before-function-paren": ["error", {
                "anonymous": "never",
                "named": "never",
                "asyncArrow": "always"
            }]
        }
    }
];

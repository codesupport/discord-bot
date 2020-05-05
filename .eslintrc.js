module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
    ],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            modules: true
        }
    },
    rules: {
        "no-unused-vars": "off",
        "lines-between-class-members": "off",
        "space-before-function-paren": ["error", {
            "anonymous": "never",
            "named": "never",
            "asyncArrow": "always"
        }],
    },
    extends: [
        "eslint-config-codesupport"
    ],
};
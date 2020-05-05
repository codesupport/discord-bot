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
        "lines-between-class-members": "off"
    },
    extends: [
        "eslint-config-codesupport"
    ],
};
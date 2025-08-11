/* eslint-env node */
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const terser = require("@rollup/plugin-terser");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const url = require("@rollup/plugin-url");
const css = require("rollup-plugin-css-only");

module.exports = {
  input: "src/index.simple.js",
  output: {
    file: "dist/DrawDB.js",
    format: "esm",
    sourcemap: true,
    exports: "named",
  },
  plugins: [
    peerDepsExternal(),
    url({
      include: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"],
      limit: 0, // Don't inline, just emit as files
    }),
    css(),
    resolve({
      extensions: [".js", ".jsx"],
      preferBuiltins: true,
    }),
    commonjs({
      include: "node_modules/**",
      ignore: ["antlr4", "@dbml/core"],
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
      extensions: [".js", ".jsx"],
    }),
    terser(),
  ],
  external: [
    "react",
    "react-dom",
    "react-router-dom",
    "@douyinfe/semi-ui",
    "framer-motion",
    "i18next",
    "react-i18next",
    "dexie",
    "dexie-react-hooks",
    "antlr4",
    "@dbml/core",
    "node-sql-parser",
    "oracle-sql-parser",
    "jsonschema",
    "jspdf",
    "jszip",
    "html-to-image",
    "file-saver",
    "nanoid",
    "classnames",
    "axios",
    "url",
    "usehooks-ts",
    "react-hotkeys-hook",
    "react-tweet",
    "@vercel/analytics",
    "@vercel/speed-insights",
  ],
  onwarn(warning, warn) {
    // Ignore circular dependency warnings
    if (warning.code === "CIRCULAR_DEPENDENCY") return;
    // Ignore unresolved dependency warnings for heavy packages
    if (
      warning.code === "UNRESOLVED_IMPORT" &&
      (warning.source === "antlr4" || warning.source === "@dbml/core")
    )
      return;
    warn(warning);
  },
};

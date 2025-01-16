import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "@rollup/plugin-terser";

export default {
  input: "public/app.js",
  output: {
    file: "public/dist/bundle.js",
    format: "iife",
    name: "app",
  },
  plugins: [
    resolve(),
    commonjs(),
    terser
  ]
};

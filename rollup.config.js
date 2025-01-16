import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss"; // Importar el plugin postcss

export default {
  input: "public/app.js",
  output: {
    file: "public/dist/bundle.js",
    format: "iife", // Formato de salida: Immediately Invoked Function Expression
    name: "app",
  },
  plugins: [
    resolve(),
    commonjs(),
    postcss({ extract: true }), // Agregar el plugin postcss para procesar CSS
    terser
  ],
};

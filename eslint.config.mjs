import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";

/**
 * Next 15 的 eslint-config-next 还是老式的 eslintrc 格式，
 * 用 FlatCompat 转成 flat config 给 ESLint 9 用。
 */
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
];

export default config;

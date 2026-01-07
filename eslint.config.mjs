import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                    tabWidth: 4,
                    printWidth: 120,
                    arrowParens: "always",
                },
            ],
        },
    },
    globalIgnores(["**/dist/**", "**/node_modules/**"]),
]);

export default eslintConfig;

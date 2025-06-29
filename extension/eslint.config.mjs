import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig(
	[
		{
			files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
			plugins: { js },
			extends: ['js/recommended'],
			rules: {
				'space-in-parens': ['error', 'always'],
			},
		},
		{
			files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
			languageOptions: { globals: globals.browser },
		},
		tseslint.configs.recommended,
		{ ignores: ['dist', 'node_modules'] },
	],
	eslintConfigPrettier
);

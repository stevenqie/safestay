import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
	{ ignores: ['dist/**'] },
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	pluginJs.configs.recommended,
];

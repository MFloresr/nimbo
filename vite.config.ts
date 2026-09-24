import adapter from '@sveltejs/adapter-vercel';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Funciones en París, cerca de los servidores de Open-Meteo (Europa)
			adapter: adapter({ regions: ['cdg1'] })
		})
	],
	test: {
		include: ['src/**/*.test.ts']
	}
});

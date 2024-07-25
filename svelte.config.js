import adapter from '@sveltejs/adapter-auto';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
				alias: {
			// these are the aliases and paths to them
			'@components': path.resolve('src/lib/components'),
			'@lib': path.resolve('src/lib'),
			'@utils': path.resolve('src/lib/utils'),
			'@assets': path.resolve('static/assets')
		}
	}
};

export default config;

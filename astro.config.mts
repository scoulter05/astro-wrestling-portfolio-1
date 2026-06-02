import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-wrestling-portfolio-1.siddonfilm.workers.dev',
	base: '/',
	vite: {
		plugins: [tailwindcss()],
	},
});

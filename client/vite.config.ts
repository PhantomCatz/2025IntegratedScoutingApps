import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
	return {
		plugins: [
			react(),
		],
		base: "https://phantomcatz.github.io/2025IntegratedScoutingApps/",
	};
});

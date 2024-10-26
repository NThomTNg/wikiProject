import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
    plugins: [sveltekit()],

    server: {
        fs: {
            allow: [
                '.',
                'static',
                path.resolve('static')
            ]
        }
    },

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    }
});
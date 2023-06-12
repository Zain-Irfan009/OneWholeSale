import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import laravel from "laravel-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.js',
            refresh: true,
        }),
        react({ fastRefresh: false })
    ],
    // [react({ fastRefresh: false })],
    worker: {
        plugins: [react()],
    },
    server: {
        host: "localhost",
        port: 3000,
    },
})

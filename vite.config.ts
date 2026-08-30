import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
export default defineConfig({ css:{postcss:{plugins:[tailwindcss()]}}, plugins:[react()] });


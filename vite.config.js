import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const [repositoryOwner, repositoryName] = process.env.GITHUB_REPOSITORY?.split('/') ?? [];
const isAccountSite = repositoryName?.toLowerCase() === `${repositoryOwner?.toLowerCase()}.github.io`;
const base = process.env.GITHUB_ACTIONS === 'true' && repositoryName && !isAccountSite
  ? `/${repositoryName}/`
  : '/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
});

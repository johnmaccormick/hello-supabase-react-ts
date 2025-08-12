import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change 'your-repo-name' to match your GitHub repo name
export default defineConfig({
  plugins: [react()],
  base: '/hello-supabase-react-ts/',
})

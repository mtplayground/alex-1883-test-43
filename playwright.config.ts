import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0 --port 8080',
    reuseExistingServer: true,
    timeout: 120_000,
    url: 'http://127.0.0.1:8080',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})

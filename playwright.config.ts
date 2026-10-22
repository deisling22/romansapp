import { defineConfig, devices } from '@playwright/test';

const javaHome = process.env['JAVA_HOME'] ?? '/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home';

export default defineConfig({
  testDir: './e2e',
  // The tests share one backend with an in-memory database, so they run serially.
  workers: 1,
  fullyParallel: false,
  retries: process.env['CI'] ? 1 : 0,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'retain-on-failure',
    locale: 'de-DE',
    serviceWorkers: 'block',
  },
  projects: [
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], viewport: { width: 393, height: 852 } },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: './mvnw -q -Djava.version=21 spring-boot:run',
      cwd: './backend',
      url: 'http://localhost:8080/api/plans',
      env: { JAVA_HOME: javaHome },
      reuseExistingServer: true,
      timeout: 180_000,
    },
    {
      command: 'npx ng serve --port 4200',
      url: 'http://localhost:4200',
      reuseExistingServer: true,
      timeout: 180_000,
    },
  ],
});

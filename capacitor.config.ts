import type { CapacitorConfig } from '@capacitor/cli'

// Native Android shell for the Copa ETec 2026 site.
// The UI is the deployed Next.js app; this project only wraps it as an installable app.
const SITE_URL = 'https://copaetec.online'

const config: CapacitorConfig = {
  appId: 'com.copaetec.app',
  appName: 'Copa ETec 2026',
  // Required by the CLI. Holds the offline fallback page; the live site is loaded from server.url.
  webDir: 'mobile/www',
  server: {
    url: SITE_URL,
    androidScheme: 'https',
    // Keep these origins inside the app (frontend, backend API and the Google sign-in hop
    // so the backend session cookie lands in the same cookie jar). Anything else opens
    // in the system browser.
    allowNavigation: [
      'copaetec.online',
      'www.copaetec.online',
      'copaetec.vercel.app',
      'copaetec-backend.vercel.app',
      'accounts.google.com',
      '*.google.com',
      '*.gstatic.com',
    ],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#09090b',
    // Present a plain Chrome-on-Android user agent so Google OAuth does not reject the
    // embedded WebView with "disallowed_useragent".
    overrideUserAgent:
      'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 900,
      launchAutoHide: true,
      backgroundColor: '#09090b',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
  },
}

export default config

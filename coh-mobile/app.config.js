import 'dotenv/config'

export default {
  expo: {
    name: 'Epic',
    slug: 'coh-mobile',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.sammy56lt.cohmobile',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.epic.cohmobile',
      googleServicesFile:
        '/Users/samlubelsky/CommunityOfHope/coh-mobile/google-services.json',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/icon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      'expo-web-browser',
      'expo-font',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '2ca0779e-1e24-44fa-83a5-b93323ff1f8d',
      },
    },
  },
}

import 'dotenv/config';



export default {

  expo: {
    name: 'bag-discovery',
    slug: 'bag-discovery',
    version: '1.0.0',
    orientation: 'portrait',

    icon: './assets/images/icon.png',

    scheme: 'bagdiscovery',

    userInterfaceStyle: 'automatic',

    ios: {
      supportsTablet: true,

      bundleIdentifier:
        'com.assessment.bagdiscovery',

      config: {
        googleMapsApiKey:
          process.env.GOOGLE_MAPS_IOS_API_KEY,
      },

      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'We use your location to show nearby places',
      },
    },

    android: {
      package: 'com.assessment.bagdiscovery',

      permissions: [
        'android.permission.POST_NOTIFICATIONS',
        'ACCESS_FINE_LOCATION',
      ],

      config: {
        googleMaps: {
          apiKey:
            process.env
              .GOOGLE_MAPS_ANDROID_API_KEY,
        },
      },

      adaptiveIcon: {
        backgroundColor: '#E6F4FE',

        foregroundImage:
          './assets/images/android-icon-foreground.png',

        backgroundImage:
          './assets/images/android-icon-background.png',

        monochromeImage: '#E6F4FE',
      },

      edgeToEdgeEnabled: true,

      predictiveBackGestureEnabled: false,
    },

    web: {
      output: 'static',

      favicon: './assets/images/favicon.png',

      bundler: 'metro',
    },

    plugins: [
      'expo-router',

      [
        'expo-splash-screen',
        {
          image:
            './assets/images/splash-icon.png',

          imageWidth: 200,

          resizeMode: 'contain',

          backgroundColor: '#ffffff',

          dark: {
            backgroundColor: '#000000',
          },
        },
      ],

      'expo-localization',

      'expo-notifications',
    ],

    experiments: {
      typedRoutes: true,

      reactCompiler: false,
    },
  },
};
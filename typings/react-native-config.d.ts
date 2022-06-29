declare module 'react-native-config' {
  interface Env {
    ENV: string;
    BASE_URL: string;
  }

  const BuildConfig: Env;

  export default BuildConfig;
}

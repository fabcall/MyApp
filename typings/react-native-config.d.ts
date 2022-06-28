declare module 'react-native-config' {
  interface Env {
    ENV: string;
  }

  const BuildConfig: Env;

  export default BuildConfig;
}

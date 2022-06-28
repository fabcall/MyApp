const pluginModuleResolver = [
  'babel-plugin-module-resolver',
  {
    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@mapp': './src',
    },
  },
];

const plugins = [pluginModuleResolver];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};

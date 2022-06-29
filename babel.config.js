const pluginTransformTypescriptMetadata = [
  'babel-plugin-transform-typescript-metadata',
];

const pluginProposalDecorators = [
  '@babel/plugin-proposal-decorators',
  {
    legacy: true,
  },
];

const pluginModuleResolver = [
  'babel-plugin-module-resolver',
  {
    extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
    alias: {
      '@mapp': './src',
      '@mapp-assets': './assets',
    },
  },
];

const plugins = [
  pluginTransformTypescriptMetadata,
  pluginProposalDecorators,
  pluginModuleResolver,
];

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins,
};

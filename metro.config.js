const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Bundle size optimizations (Hermes does bytecode minification; this helps non-Hermes builds)
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: { toplevel: false },
};

module.exports = config;

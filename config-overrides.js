const { override, addWebpackModuleRule, addWebpackAlias, adjustStyleLoaders } = require('customize-cra');
const path = require('path');

const isEnvProd = process.env.NODE_ENV === 'production';

module.exports = {
  webpack: override(
    addWebpackModuleRule({
      test: /\.pug$/,
      use: [
        'babel-loader',
        'pug-as-jsx-loader'
      ],
    }),
    adjustStyleLoaders(({ use: [ , css, postcss, resolve, processor ] }) => {
      css.options.sourceMap = !isEnvProd;
      postcss.options.sourceMap = !isEnvProd;
      if (resolve) {
        resolve.options.sourceMap = !isEnvProd;
      }
      if (processor && processor.loader.includes('stylus-loader')) {
        Object.assign(processor.options, {
          include: [ __dirname + '/node_modules' ],
        });
      }
    }),
    addWebpackAlias({
      '~': path.resolve('src'),
    }),
  )
};

const pugLoad = require('pug-load');
const resolvePug = pugLoad.resolve;
pugLoad.resolve = function (filename, source, options) {
  if (filename.startsWith('~/')) {
    filename = '/src' + filename.substr(1);
  }
  return resolvePug.call(this, filename, source, options);
}

const stylusPathCache = require('stylus-loader/lib/pathcache');
const stylusResolvers = stylusPathCache.resolvers;
stylusPathCache.resolvers = function () {
  const resolvers = stylusResolvers.apply(this, arguments);
  const resolveStylus = resolvers[0];
  resolvers[0] = function (context, filename) {
    filename = !filename.startsWith('~/') ? filename : filename.substr(2);
    return resolveStylus.call(this, context, filename);
  };
  return resolvers;
}

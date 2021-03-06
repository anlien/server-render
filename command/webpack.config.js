const webpack = require('../node_modules/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { clientConfig } = require('./config');
const TerserPlugin = require('terser-webpack-plugin'); //精简代码
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
//Solves extract-text-webpack-plugin CSS duplication problem
//https://github.com/NMFR/optimize-css-assets-webpack-plugin

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';
const shouldUseSourceMap = true;
const { port } = require('./webpack.dev.server.config');

const fileLoader = {
  loader: require.resolve('file-loader'),
  // Exclude `js` files to keep "css" loader working as it injects
  // its runtime that would otherwise be processed through "file" loader.
  // Also exclude `html` and `json` extensions so they get processed
  // by webpacks internal loaders.
  exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
  options: {
    name: 'media/[name].[contenthash:8].[ext]',
  },
};

// "url" loader works like "file" loader except that it embeds assets
// smaller than specified limit in bytes as data URLs to avoid requests.
// A missing `test` is equivalent to a match.
const imgLoader = {
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    limit: false,
    name: 'media/[name].[hash:8].[ext]',
  },
};

// Opt-in support for SASS (using .scss or .sass extensions).
// By default we support SASS Modules with the
// extensions .module.scss or .module.sass
const scssLoader = {
  test: /\.(scss|sass)$/,
  exclude: /\.module\.(scss|sass)$/,
  use: [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader', //style-loader 开发阶段使用--写入到页面
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        sourceMap: shouldUseSourceMap,
      },
    },
    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: require.resolve('postcss-loader'),
      options: {
        // Necessary for external CSS imports to work
        // https://github.com/facebook/create-react-app/issues/2677
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
        sourceMap: shouldUseSourceMap,
      },
    },
    {
      loader: require.resolve('sass-loader'),
      options: {
        sourceMap: shouldUseSourceMap,
      },
    },
  ],
  // Don't consider CSS imports dead code even if the
  // containing package claims to have no side effects.
  // Remove this when webpack adds a warning or an error for this.
  // See https://github.com/webpack/webpack/issues/6571
  sideEffects: true,
};

//babel/transform-runtime
const jsLoader = {
  test: /\.(t|j)sx?$/,
  exclude: /\/node_modules/,
  // include: clientConfig.srcDir,
  loader: require.resolve('babel-loader'),
  options: {
    cacheDirectory: true,
    babelrc: false,
    presets: [
      '@babel/preset-react',
      [
        '@babel/env',
        {
          targets: { ie: 9 },
          ignoreBrowserslistConfig: true,
          useBuiltIns: false,
          modules: false,
          // "browsers": [
          //     'last 2 versions',
          //     'Firefox ESR',
          //     '> 1%',
          //     'ie >= 9',
          //     'iOS >= 8',
          //     'Android >= 4',
          // ]
        },
      ],
      '@babel/preset-typescript',
    ],
    plugins: ['@babel/plugin-proposal-class-properties'], //
  },
};

// //开发环境
if (!isProduction) {
  jsLoader.options.plugins.push('react-hot-loader/babel');
}

// const tsLoader = {
//   test: /\.(t|j)sx?$/,
//   exclude: /node_modules/,
//   use: {
//     loader: 'ts-loader',
//     options: {
//       transpileOnly: true,
//     },
//   },
// };
const WebConfig = {
  mode: isProduction ? 'production' : 'development',
  target: 'web',
  cache: true,
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  entry: clientConfig.entryJs, //在config中 设置入口
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
  output: {
    pathinfo: true,
    path: clientConfig.buildDir,
    filename: `js/[name].[${isProduction ? 'chunkhash:8' : 'hash'}].js`, //hash
    chunkFilename: `js/[name].[${isProduction ? 'chunkhash:8' : 'hash'}].js`, //非入口依赖文件, 使用 chunkhash 而非 hash:8
    publicPath: isProduction ? '/' : `//localhost:${port}/`, //暂时没有域名的问题
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: !isProduction,
        sourceMap: true,
        extractComments: true,
        terserOptions: {
          ecma: '2015',
          mangle: true,
          module: false,
          ie8: false,
          safari10: false,
        },
      }),
      new OptimizeCSSAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessorOptions: {
          safe: true,
          autoprefixer: { disable: true },
          mergeLonghand: false,
          discardComments: {
            removeAll: true,
          },
        },
        canPrint: true,
      }),
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '.',
      automaticNameMaxLength: 30,
      name: true,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          // priority: -10
        },
        // styles: {
        //     name: 'styles',
        //     test: /\.css$/,
        //     chunks: 'all',
        //     enforce: true,
        // },
      },
      chunks: 'all',
    },
    runtimeChunk: false,
    namedChunks: true,
    mergeDuplicateChunks: true,
    occurrenceOrder: true,
  },
  module: {
    rules: [
      // Disable require.ensure as it's not a standard language feature.
      { parser: { requireEnsure: false } },
      {
        oneOf: [imgLoader, scssLoader, fileLoader, jsLoader],
      },
    ],
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      __Client__: true,
      __ISPROD__: isProduction,
    }),
  ],
};

if (!isProduction) {
  WebConfig.resolve.alias = {
    'react-dom': '@hot-loader/react-dom',
  };
}
//开发环境
if (!isProduction) {
  WebConfig.plugins.unshift(
    new ManifestPlugin({
      fileName: `../${clientConfig.assetManifestName}.json`,
    }),
  );
  // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
  WebConfig.plugins.unshift(new webpack.HotModuleReplacementPlugin());
  WebConfig.plugins.unshift(new webpack.NamedModulesPlugin()); //倒着
  WebConfig.plugins.unshift(new CaseSensitivePathsPlugin());
} else {
  WebConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css', //hash
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
  );
}
module.exports = WebConfig;

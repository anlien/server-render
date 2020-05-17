const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { clientConfig } = require('./config');
const TerserPlugin = require('terser-webpack-plugin'); //精简代码
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
//Solves extract-text-webpack-plugin CSS duplication problem
//https://github.com/NMFR/optimize-css-assets-webpack-plugin
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const shouldUseSourceMap = false;
const fileLoader = {
    loader: require.resolve('file-loader'),
    // Exclude `js` files to keep "css" loader working as it injects
    // its runtime that would otherwise be processed through "file" loader.
    // Also exclude `html` and `json` extensions so they get processed
    // by webpacks internal loaders.
    exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
    options: {
        name: 'media/[name].[hash:8].[ext]'
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
}

// Opt-in support for SASS (using .scss or .sass extensions).
// By default we support SASS Modules with the
// extensions .module.scss or .module.sass
const scssLoader = {
    test: /\.(scss|sass)$/,
    exclude: /\.module\.(scss|sass)$/,
    use: [
        'style-loader',//开发阶段使用--写入到页面
        // {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {
        //         esModule: true
        //         // hmr: true,
        //         // reloadAll: true
        //     },
        // },
        {
            loader: require.resolve('css-loader'),
            options: {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap,
            }
        }, {
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
        }, {
            loader: require.resolve('sass-loader'),
            options: {
                sourceMap: shouldUseSourceMap
            }
        }],
    // Don't consider CSS imports dead code even if the
    // containing package claims to have no side effects.
    // Remove this when webpack adds a warning or an error for this.
    // See https://github.com/webpack/webpack/issues/6571
    sideEffects: true,
};

//babel/transform-runtime
const jsLoader = {
    test: /\.js$/,
    exclude: /\/node_modules/,
    // include: clientConfig.srcDir,
    loader: require.resolve('babel-loader'),
    options: {
        cacheDirectory: true,
        babelrc: false,
        "presets": [
            "@babel/preset-react",
            [
                "@babel/preset-env"
            ]
        ],
        "plugins": ["@babel/plugin-proposal-class-properties", "react-hot-loader/babel"]//
    }
}

const WebConfig = {
    mode: 'development',
    target: 'web',
    cache: true,
    devtool: 'none',
    // devtool: 'source-map',
    entry: clientConfig.entryJs,//在config中 设置入口
    output: {
        pathinfo: true,
        path: clientConfig.buildDir,
        filename: 'js/[name].[hash].js',//hash
        chunkFilename: 'js/[name].[hash].js',//非入口依赖文件, 使用 chunkhash 而非 hash:8
        publicPath: 'http://localhost:3001/'//暂时没有域名的问题
    },
    optimization: {
        // minimize: true// Tell webpack to minimize the bundle using the UglifyjsWebpackPlugin.This is true by default in production mode.
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
                vendor: {//使用的模块，固定下来
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                    // priority: -10
                },
                // styles: {
                //     name: 'styles',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true,
                // },
            },
            chunks: 'all'
        },
        runtimeChunk: false,//runtime~ 文件
        namedChunks: true,
        mergeDuplicateChunks: true,
        occurrenceOrder: true, // To keep filename consistent between different modes (for example building only)  
    },
    module: {
        rules: [
            // Disable require.ensure as it's not a standard language feature.
            { parser: { requireEnsure: false } },
            {
                oneOf: [
                    imgLoader,//不能使用base64 babel暂时没做不兼容
                    scssLoader,
                    fileLoader,
                    jsLoader
                ]
            }]
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.NoEmitOnErrorsPlugin(),

        new webpack.DefinePlugin({
            __Client__: true
        }),
        new MiniCssExtractPlugin({
            // disable: NODE_ENV !== 'production',
            // filename: 'css/[name].css',//May contain [contenthash:8]  `[name]`, `[id]`, `hash` and `[chunkhash]`
            // chunkFilename: 'css/[name].css',
            filename: 'css/[name].[contenthash:8].css',//hash
            chunkFilename: 'css/[name].[contenthash:8].css',//非入口依赖文件, 使用 chunkhash 而非 hash:8
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new ManifestPlugin({
            fileName: '../asset-manifest.json'
        })
    ]
}

module.exports = WebConfig;
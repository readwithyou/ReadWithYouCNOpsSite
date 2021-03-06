const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals'); // Remove node_modules when creating the bundle
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const path = require('path');

module.exports = [
    {
        entry: {
            main: './src/client/main.js',
            previewEntry: './src/client/pages/Preview/preview.js'
        },
        output: {
            filename: '[name].bundle.js',
            chunkFilename: '[id].bundle_[chunkhash].js',
            sourceMapFilename: '[file].map',
            path: __dirname + '/dist/assets',
        },
        devServer: {
            port: 3000,
            proxy: {
                '/api/*': {
                    target: 'http://localhost:8000',
                    secure: false
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: { loader: 'babel-loader' },
                },
                {
                    test: /\.vue$/,
                    use: { loader: 'vue-loader' },
                },
                {
                    test: /\.html$/,
                    use: [{ loader: 'html-loader', options: { minimize: true }, },],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.scss$/,
                    use: [
                        'style-loader', // creates style nodes from JS strings
                        'css-loader', // translates CSS into CommonJS
                        'sass-loader' // compiles Sass to CSS
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        { loader: MiniCssExtractPlugin.loader },
                        {
                            loader: 'css-loader',
                            options: { modules: true, importLoaders: 1, localIdentName: '[name]-[hash:4]', sourceMap: true, minimize: true, },
                        },
                        { loader: 'less-loader' },
                    ],
                },
                {
                    test: /\.(png|jp(e*)g|svg)$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 410000, // Convert images < 410kb to base64 strings
                            name: 'images/[hash]-[name].[ext]'
                        }
                    }]
                },
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "url-loader?limit=10000&minetype=application/font-woff"
                },
                {
                    test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader"
                }
            ],
        },
        resolve: {
            modules: [
                path.resolve('./src/client'),
                path.resolve('./node_modules')
            ],
            alias: {
                vue: 'vue/dist/vue.js'
            }
        },
        plugins: [
            new CleanWebpackPlugin(['dist/'], { watch: true }),
            new HtmlWebPackPlugin({ template: './src/client/index.html', filename: './index.html', chunks: ['main'] }),
            new HtmlWebPackPlugin({ template: './src/client/pages/Preview/preview.html', filename: './preview.html', chunks: ['previewEntry'] }),
            new MiniCssExtractPlugin({
                filename: 'index.css', chunkFilename: 'index.css',
            }),
            new VueLoaderPlugin()
        ],
    },
    {
        entry: './src/server/App.js',
        output: {
            filename: 'server.js',
            path: __dirname + '/dist',
            libraryTarget: 'commonjs2',
        },
        target: 'node',
        node: { console: false, global: false, process: false, Buffer: false, __filename: false, __dirname: false, },
        externals: nodeExternals(),
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: [/node_modules/, /\.less$/, /\.css$/],
                    use: {
                        loader: 'babel-loader',
                    },
                },
                { test: /\.json$/, },
                { test: /\.css$/, use: { loader: 'ignore-loader', }, },
                {
                    test: /\.less$/, use: { loader: 'ignore-loader', },
                },
            ],
        }
    },
];
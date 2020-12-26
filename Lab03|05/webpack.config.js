const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
// const $ = require("jquery");

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html/views');

module.exports = {
    entry: [
        './src/js/index.js',
        './src/scss/style.scss',
    ],
    output: {
        filename: './js/bundle.js'
    },
    devServer: {
        overlay: true
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, 'src/js'),
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            modules: false
                        }],
                    ],
                    plugins: ['@babel/plugin-proposal-class-properties'],
                }
            }
        },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {}
                },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            url: false
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            sourceMap: true,
                            plugins: () => [
                                require('cssnano')({
                                    preset: ['default', {
                                        discardComments: {
                                            removeAll: true,
                                        },
                                    }]
                                }),
                                require('autoprefixer')({
                                    'browsers': ['> 1%', 'last 2 versions']
                                }),
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/html/includes'),
                use: ['raw-loader']
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "./css/style.bundle.css"
        }),
        new CopyWebpackPlugin([
            {
                from: './src/fonts',
                to: './fonts'
            },
            {
                from: './src/media',
                to: './media'
            },
            {
                from: './src/chatroom',
                to: './chatroom'
            },
            {
                from: './src/js/libs',
                to: './js/libs'
            },

        ]),
        // new webpack.ProvidePlugin( {
        //     $: 'jquery',
        //     jQuery: 'jquery',
        //     'window.jQuery': 'jquery'
        // } ),
        new BrowserSyncPlugin(
          // BrowserSync options
          {
              // browse to http://localhost:3000/ during development
              host: 'localhost',
              port: 8080,
              // proxy the Webpack Dev Server endpoint
              // (which should be serving on http://localhost:3100/)
              // through BrowserSync
              proxy: 'http://localhost:8080/'
          },
          // plugin options
          {
              // prevent BrowserSync from reloading the page
              // and let Webpack Dev Server take care of this
              reload: false
          }
        )
    ].concat(htmlPlugins)
};

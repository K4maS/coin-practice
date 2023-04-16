const HtmlWibpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlagin = require('mini-css-extract-plugin')
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  entry: './src/js/index.js',
  output: {
    filename: 'main.[contenthash].js',
    // publicPath нужен чтобы одностраничное приложение работало корректно, чтобы все ссылки были со из слеша в начале
    publicPath: '/',
  },
  module: {
    // Блок для того чтобы определять файлы
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: "defaults" }]
            ]
          }
        }
      },

      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings, тут выбор в завсисимости от значения входящего значения
          env.prod ? MiniCssExtractPlagin.loader : {loader: "style-loader"},
          // Translates CSS into CommonJS
          {loader: "css-loader"},
          // Compiles Sass to CSS
         { loader: "sass-loader"},
        ],
      },
    ],
  },

  optimization: {
    minimizer: [
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },

  plugins: [
    new HtmlWibpackPlugin({
      title: 'Coin.',
    }),
    new MiniCssExtractPlagin({
      filename: 'main.[contenthash].css',
    })
  ],
  // настройки сервера
  devServer: {
    // сохраняется история одностраничного приложения
    historyApiFallback: true,
    // настройки для обновления стилей без обновления страницы
    hot: true
  }
}
)

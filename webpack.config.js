const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const cssnano = require("cssnano");

module.exports = {
  devtool: undefined,
  entry: {
    options: path.resolve(__dirname, "./src/options/index.js"),
  },
  mode: "production",
  module: {
    rules: [
      {
        exclude: [path.resolve(__dirname, "./node_modules/")],
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        include: [path.resolve(__dirname, "./src/")],
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                mode: "local",
                localIdentName: "[hash:base64]",
                context: path.resolve(__dirname, "./src"),
              },
            },
          },
          {
            loader: "postcss-loader",
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }),
      new OptimizeCSSAssetsPlugin({
        canPrint: false,
        cssProcessor: cssnano,
        cssProcessorOptions: {
          preset: [
            "default",
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      }),
    ],
    moduleIds: "hashed",
    chunkIds: "named",
  },
  output: {
    chunkFilename: "[name]-[contenthash:10].js",
    filename: "[name]-[contenthash:10].js",
    path: path.resolve(__dirname, "./build"),
    publicPath: "/",
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        "**/*",
        "!images",
        "!images/*.png",
        "!images/*.jpg",
      ],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "./src/icons/"),
          to: path.resolve(__dirname, "./build/icons/"),
        },
        {
          from: path.resolve(__dirname, "./src/manifest.json"),
          to: path.resolve(__dirname, "./build/"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      chunkFilename: "[name]-[contenthash:10].min.css",
      filename: "[name]-[contenthash:10].min.css",
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    new ManifestPlugin({
      fileName: "build-manifest.json",
    }),
  ],
  resolve: {
    extensions: [".js", ".json"],
  },
  target: "web",
};

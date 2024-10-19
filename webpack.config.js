/*
=========================================================
* © 2024 Ronan LE MEILLAT for SCTG Development
=========================================================
*/
/* eslint-disable no-undef */

import devCerts from "office-addin-dev-certs";
import CopyWebpackPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WebpackShellPluginNext from "webpack-shell-plugin-next";
import webpack from "webpack";
import fs from "fs";
import path from "path";
import { simpleGit } from "simple-git";

const urlDev = "https://localhost:3000/";
const urlProd = "https://outlook.addin.pp.ua/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function generateVersionFile() {
  const git = simpleGit();
  const commit = await git.revparse(["HEAD"]);
  const commitDate = await git.show(["-s", "--format=%ci", commit]);
  const versionInfo = { commit, date: commitDate.replaceAll("\n", "") };
  fs.writeFileSync(path.resolve(".", "src/version.json"), JSON.stringify(versionInfo, null, 2));
}

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

export default async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      vendor: ["react", "react-dom", "core-js", "@fluentui/react-components", "@fluentui/react-icons"],
      taskpane: ["./src/aipane/index.tsx", "./src/aipane/aipane.html"],
    },
    output: {
      filename: "sctg_ai_outlook_[contenthash].js",
      clean: true,
    },
    optimization: {
      splitChunks: {
        maxSize: 250000,
        chunks: "all",
      },
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
      fallback: { url: false, fs: false, module: false },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
              plugins: ["@babel/plugin-syntax-import-attributes"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|ttf|woff|woff2|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.{json,xml}",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "aipane.html",
        template: "./src/aipane/aipane.html",
        chunks: ["polyfill", "vendor", "taskpane"],
      }),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"],
      }),
      new WebpackShellPluginNext({
        onBuildStart: {
          scripts: [generateVersionFile],
          blocking: true,
          parallel: false,
        },
      }),
    ],
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};

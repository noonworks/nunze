import { ConfigurationFactory } from 'webpack';
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';
import TerserPlugin from 'terser-webpack-plugin';

const config: ConfigurationFactory = () => {
  return {
    entry: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_global: path.join(__dirname, 'src/content_scripts/global.ts'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_lodestone: path.join(
        __dirname,
        'src/content_scripts/lodestone.ts'
      ),
      events: path.join(__dirname, 'src/events/main.ts'),
      options: path.join(__dirname, 'src/option/main.ts'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      options_sub: path.join(__dirname, 'src/option/sub.ts'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      retainer_search_result: path.join(
        __dirname,
        'src/pages/search_result.ts'
      ),
      // eslint-disable-next-line @typescript-eslint/camelcase
      shop_log: path.join(__dirname, 'src/pages/shop_log.ts'),
      // eslint-disable-next-line @typescript-eslint/camelcase
      shop_log_sub: path.join(__dirname, 'src/pages/shop_log_sub.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist/js'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          exclude: '/node_modules/',
        },

        {
          test: /\.css$/,
          loader: [
            'vue-style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
      alias: {
        'vue-ctk-date-time-picker': path.resolve(
          __dirname,
          'lib/vue-ctk-date-time-picker'
        ),
      },
    },
    plugins: [new VueLoaderPlugin()],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            compress: {
              // eslint-disable-next-line @typescript-eslint/camelcase
              drop_console: true,
            },
          },
        }),
      ],
    },
  };
};

export default config;

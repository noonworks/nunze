import { ConfigurationFactory } from 'webpack';
import path from 'path';
import { VueLoaderPlugin } from 'vue-loader';

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
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue'],
    },
    plugins: [new VueLoaderPlugin()],
    optimization: {
      minimize: false,
    },
  };
};

export default config;

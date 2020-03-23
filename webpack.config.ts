import { ConfigurationFactory } from 'webpack';
import path from 'path';

const config: ConfigurationFactory = () => {
  return {
    entry: {
      // eslint-disable-next-line @typescript-eslint/camelcase
      content_scripts: path.join(__dirname, 'src', 'content_scripts/main.ts'),
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    module: {
      rules: [
        {
          test: /.ts$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
      ],
    },
    resolve: {
      extensions: ['ts', 'js'],
    },
    plugins: [],
    optimization: {
      minimize: false,
    },
  };
};

export default config;

import baseConfig from './base.js';

export default {
  ...baseConfig,
  overrides: [
    {
      files: ['*.jsx', '*.tsx', '*.js', '*.ts'],
      options: {
        parser: 'typescript',
      },
    },
  ],
};

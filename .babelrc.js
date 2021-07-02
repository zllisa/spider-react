const babel = {
  presets: [
    "@babel/preset-react",
    "@babel/preset-typescript",
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: {
          version: 3
        },
        targets: {
          chrome: '60',
          firefox: '60',
          ie: '9',
          safari: '10',
          edge: '17'
        }
      },
    ]
  ],
  plugins: [
    [
      "@babel/plugin-proposal-class-properties",
    ],
    "@babel/plugin-transform-runtime",
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ]
  ]
}

module.exports = babel;
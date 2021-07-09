module.exports = {
  extends: 'helloitsjoe',
  rules: {
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        labelAttributes: ['label'],
        depth: 3,
      },
    ],
  },
};

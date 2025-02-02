export default [
  {
    script: 'dist/main.js',
    name: 'gldcart-api',
    exec_mode: 'cluster',
    instances: 2,
  },
];

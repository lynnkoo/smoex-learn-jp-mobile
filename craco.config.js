// module.exports = {
//   // babel: {
//   //   plugins: ['./config/babel/babel-plugin-bem-classname'],
//   // },
// }

module.exports = {
  style: {
    sass: {
      loaderOptions: (sassLoaderOptions, { env, paths }) => { 
        return sassLoaderOptions;
      }
    },
  },
};
// import { getOptions } from 'loader-utils';
// import validateOptions from 'schema-utils';

// const schema = {
//   type: 'object',
//   properties: {
//     test: {
//       type: 'string'
//     }
//   }
// };

module.exports = function (source) {
    //   const options = getOptions(this);

    //   validateOptions(schema, options, 'Example Loader');

    // Apply some transformations to the source...
    const obj = { one: 1 };
    if (this.resourcePath.endsWith('node_modules/unicode/category/Nl.js') ||
        this.resourcePath.endsWith('node_modules/unicode/category/Lo.js')) {
        console.log('this.resourcePath');
        console.log(this.resourcePath);
        return `const x = require('out/client/unicode_category_Llxyz.js');\nexport default x;`;
    }
    return source;
};

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { getOptions } from 'loader-utils';
import * as path from 'path';

export type Options = {
    nodeModuleBundles: Map<string, string | [string, boolean]>;
};

const normalizedPath = normalizePath(path.join(__dirname, '..', '..'));
const normalizedNodeModulesPath = normalizePath(path.join(__dirname, '..', '..', 'node_modules'));

function normalizePath(filePath: string) {
    return filePath.replace(/\\/g, '/');
}
// tslint:disable:no-default-export no-invalid-this
export default function (source: string) {
    if (this.resourcePath.indexOf('node_modules') === -1) {
        const options = getOptions(this) as Options;
        options.nodeModuleBundles.forEach(key => {
            const regex = new RegExp(`from '${key}';`, 'g');
            const replacement = `from './${key}'`;
            source = source.replace(regex, replacement);

            const regex2 = new RegExp(` await import\\('${key}'\\);`, 'g');
            const replacement2 = `await ('./${key}');`;
            source = source.replace(regex2, replacement2);

            const regex3 = new RegExp(` require\\('${key}'\\);`, 'g');
            const replacement3 = ` require('./${key}');`;
            source = source.replace(regex3, replacement3);
        });
        if (this.resourcePath === '/Users/donjayamanne/.vscode-insiders/extensions/pythonVSCode/src/client/language/unicode.ts'){
            console.log(source);
        }
    }
    // console.log(this.resourcePath);
    // const normalizedFilePath = normalizePath(this.resourcePath);
    // if (normalizedFilePath.startsWith(normalizedNodeModulesPath)) {
    //     const options = getOptions(this) as Options;
    //     // console.log(options);
    //     const pathRelativeToNodeModules = normalizedFilePath.substring(normalizedNodeModulesPath.length + 1);
    //     const dirName = pathRelativeToNodeModules.split('/')[0];
    //     if (options.nodeModuleBundles.has(pathRelativeToNodeModules) && this.resourcePath.indexOf(dirName) === -1) {
    //         const bundleModule = options.nodeModuleBundles.get(pathRelativeToNodeModules);
    //         const name = Array.isArray(bundleModule) ? bundleModule[0] : bundleModule;
    //         const defaultSuffix = Array.isArray(bundleModule) ? '.default' : '';
    //         // return `export require('${name}')${defaultSuffix};`;
    //         return `
    //         function __export(m) {
    //             for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    //         }
    //         __export(require('${name}'));
    //         `;
    //     }
    //     // console.log(this.resourcePath);
    //     console.log(`${pathRelativeToNodeModules} in ${this.resourcePath}`);
    //     // console.log('Failed');
    // }
    return source;
}

// // import { getOptions } from 'loader-utils';
// // import validateOptions from 'schema-utils';
//  // const schema = {
// //   type: 'object',
// //   properties: {
// //     test: {
// //       type: 'string'
// //     }
// //   }
// // };
// // tslint:disable-next-line:no-default-export
// export default function (source) {
//     //   const options = getOptions(this);
//      //   validateOptions(schema, options, 'Example Loader');
//      // Apply some transformations to the source...
//     const obj = { one: 1 };
//     if (this.resourcePath.endsWith('node_modules/unicode/category/Nl.js') ||
//         this.resourcePath.endsWith('node_modules/unicode/category/Lo.js')) {
//         console.log('this.resourcePath');
//         console.log(this.resourcePath);
//         return `const x = require('out/client/unicode_category_Llxyz.js');\nexport default x;`;
//     }
//     return source;
// };

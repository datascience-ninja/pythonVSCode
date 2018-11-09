// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const path = require("path");
const normalizedPath = normalizePath(path.join(__dirname, '..', '..'));
const normalizedNodeModulesPath = normalizePath(path.join(__dirname, '..', '..', 'node_modules'));
function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}
// tslint:disable:no-default-export no-invalid-this
function default_1(source) {
    if (this.resourcePath.indexOf('node_modules') === -1) {
        const options = loader_utils_1.getOptions(this);
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
        if (this.resourcePath === '/Users/donjayamanne/.vscode-insiders/extensions/pythonVSCode/src/client/language/unicode.ts') {
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
exports.default = default_1;

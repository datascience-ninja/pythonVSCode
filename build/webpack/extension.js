// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const setup_1 = require("./setup");
const nodeModulesToExernalize = [
    ...['Lu', 'Ll', 'Lt', 'Lo', 'Lm', 'Nd', 'Nl', 'Mn', 'Mc', 'Pc']
        .map(category => `unicode/category/${category}`)
        .map(item => {
        const entry = `${item}.js`;
        const moduleName = item;
        const bundleName = item.replace(/\//g, '_');
        return { entry, bundleName, moduleName };
    }),
];
function getNodeModuleBunleEntries() {
    const entries = {};
    nodeModulesToExernalize.map(item => {
        entries[item.bundleName] = item.entry;
    });
    return entries;
}
exports.getNodeModuleBunleEntries = getNodeModuleBunleEntries;
function getExternalSourceLoaderOptions() {
    const entries = new Map();
    setup_1.getNodeModuleDependencies().concat(nodeModulesToExernalize.map(item => item.moduleName)).forEach(item => {
        entries.set(item, item);
    });
    // nodeModulesToExernalize.map(item => {
    //     entries.set(item.entry, `./${item.bundleName}`);
    // });
    // // entries.set('md5/md5.js', './md5');
    // // entries.set('file-matcher/index.js', './file-matcher');
    // // entries.set('request-progress/index.js', './request-progress');
    // entries.set('request/index.js', './request');
    // // entries.set('fs-extra/lib/index.js', './fs-extra');
    // // entries.set('@jupyterlab/services/lib/index.js', './@jupyterlab/services');
    // // entries.set('iconv-lite/lib/index.js', './iconv-lite');
    // // entries.set('glob/glob.js', './glob');
    // // entries.set('semver/semver.js', './semver');
    // // entries.set('untildify/index.js', ['./untildify', true]);
    // // entries.set('winreg/lib/registry.js', './winreg');
    // entries.set('azure-storage/lib/azure-storage.js', './azure-storage');
    // // entries.set('xml2js/lib/xml2js.js', './xml2js');
    return { nodeModuleBundles: entries };
}
exports.getExternalSourceLoaderOptions = getExternalSourceLoaderOptions;
function getExternalSourcesToIgnore() {
    // return nodeModulesToExernalize
    // .map(item => `./${item.bundleName}.js`)
    // .concat(nodeModulesToExernalize.map(item => `./${item.bundleName}`));
    const items = setup_1.getNodeModuleDependencies().concat(nodeModulesToExernalize.map(item => item.moduleName));
    return items.map(item => `./${item}.js`)
        .concat(items.map(item => `./${item}`));
}
exports.getExternalSourcesToIgnore = getExternalSourcesToIgnore;

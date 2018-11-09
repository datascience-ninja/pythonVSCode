// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { Options } from './externalSourceLoader';
import { getNodeModuleDependencies } from './setup';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

type NodeModuleExternalizeInfo = {
    entry: string;
    moduleName: string;
    bundleName: string;
};

const nodeModulesToExernalize: NodeModuleExternalizeInfo[] = [
    ...['Lu', 'Ll', 'Lt', 'Lo', 'Lm', 'Nd', 'Nl', 'Mn', 'Mc', 'Pc']
        .map(category => `unicode/category/${category}`)
        .map(item => {
            const entry = `${item}.js`;
            const moduleName = item;
            const bundleName = item.replace(/\//g, '_');
            return { entry, bundleName, moduleName };
        }),
    // {
    //     bundleName: 'azure-storage',
    //     entry: 'azure-storage'
    // },
    // {
    //     bundleName: 'request',
    //     entry: 'request'
    // }
    // ...['fs-extra', 'glob', 'md5', 'lodash', 'crypto',
    //     '@jupyterlab/services', 'file-matcher', 'iconv-lite', 'request', 'request-progress',
    //     'untildify', 'winreg', 'xml2js', 'semver']
    //     .map(item => {
    //         return { entry: item, bundleName: item };
    //     })
];

export function getNodeModuleBunleEntries() {
    const entries: { [key: string]: string } = {};
    nodeModulesToExernalize.map(item => {
        entries[item.bundleName] = item.entry;
    });
    return entries;
}

export function getExternalSourceLoaderOptions(): Options {
    const entries = new Map<string, string | [string, boolean]>();
    getNodeModuleDependencies().concat(nodeModulesToExernalize.map(item => item.moduleName)).forEach(item => {
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

export function getExternalSourcesToIgnore(): string[] {
    // return nodeModulesToExernalize
    // .map(item => `./${item.bundleName}.js`)
    // .concat(nodeModulesToExernalize.map(item => `./${item.bundleName}`));
    const items = getNodeModuleDependencies().concat(nodeModulesToExernalize.map(item => item.moduleName));
    return items.map(item => `./${item}.js`)
        .concat(items.map(item => `./${item}`));
}

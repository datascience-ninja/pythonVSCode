// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

// tslint:disable:no-require-imports

import * as fs from 'fs-extra';
import * as path from 'path';

export function getNodeModuleDependencies() {
    const dependencies = require('../../package.json').dependencies as { [key: string]: string };
    return Object.keys(dependencies)
        .filter(item => ['arch', 'reflect-metadata', 'inversify'].indexOf(item) === -1);
}

export function generateBundleMain() {
    const targetFile = path.join('..', '..', 'src', 'client', 'bundle.ts');
    getNodeModuleDependencies().forEach(generateEntryPoint);
}

function generateEntryPoint(moduleName: string): void {
    const code = `// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

// tslint:disable:no-var-requires no-require-imports no-function-expression

Object.defineProperty(exports, '__esModule', { value: true });
(function (exports) {
    const mod = require('${moduleName}');
    Object.keys(mod).forEach(key => {
        if (!exports.hasOwnProperty(key)) {
            exports[key] = mod[key];
        }
    });

    exports.default = mod;
})(exports);
`;

    const targetFile = path.normalize(path.join(__dirname, '..', '..', 'src', 'client', 'bundles', `${moduleName}.ts`));
    fs.ensureDirSync(path.dirname(targetFile));
    fs.writeFileSync(targetFile, code);
}

generateBundleMain();

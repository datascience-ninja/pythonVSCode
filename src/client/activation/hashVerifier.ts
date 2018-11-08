// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as fs from 'fs';
import { createDeferred } from '../common/utils/async';

export class HashVerifier {
    public async verifyHash(filePath: string, platformString: string, expectedDigest: string): Promise<boolean> {
        const readStream = fs.createReadStream(filePath);
        const deferred = createDeferred();
        const crypto = await import('crypto');
        const hash = crypto.createHash('sha512');
        hash.setEncoding('hex');
        readStream
            .on('end', () => {
                hash.end();
                deferred.resolve();
            })
            .on('error', (err) => {
                deferred.reject(`Unable to calculate file hash. Error ${err}`);
            });

        readStream.pipe(hash);
        await deferred.promise;
        const actual = hash.read() as string;
        return expectedDigest === platformString ? true : actual.toLowerCase() === expectedDigest.toLowerCase();
    }
}

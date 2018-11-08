// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as iconv from 'iconv-lite';
import { injectable } from 'inversify';
import { DEFAULT_ENCODING } from './constants';
import { IBufferDecoder } from './types';

@injectable()
export class BufferDecoder implements IBufferDecoder {
    private readonly iconv: typeof iconv;
    constructor() {
        // tslint:disable-next-line:no-require-imports
        this.iconv = require('iconv-lite') as typeof iconv;
    }
    public decode(buffers: Buffer[], encoding: string = DEFAULT_ENCODING): string {
        encoding = this.iconv.encodingExists(encoding) ? encoding : DEFAULT_ENCODING;
        return this.iconv.decode(Buffer.concat(buffers), encoding);
    }
}

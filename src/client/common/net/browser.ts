// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

'use strict';

import { injectable } from 'inversify';
import { IBrowserService } from '../types';

export async function launch(url: string) {
    const opn = await import('opn');
    return opn(url);
}

@injectable()
export class BrowserService implements IBrowserService {
    public  launch(url: string): Promise<void> {
        return launch(url);
    }
}

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

import * as fs from 'fs';
import { Stats } from 'fs-extra';
import { inject, injectable } from 'inversify';
import * as path from 'path';
import { createDeferred } from '../utils/async';
import { IFileSystem, IPlatformService, TemporaryFile } from './types';

@injectable()
export class FileSystem implements IFileSystem {
    constructor(@inject(IPlatformService) private platformService: IPlatformService) { }

    public get directorySeparatorChar(): string {
        return path.sep;
    }

    public async objectExists(filePath: string, statCheck: (s: Stats) => boolean): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            fs.stat(filePath, (error, stats) => {
                if (error) {
                    return resolve(false);
                }
                return resolve(statCheck(stats));
            });
        });
    }

    public fileExists(filePath: string): Promise<boolean> {
        return this.objectExists(filePath, (stats) => stats.isFile());
    }
    /**
     * Reads the contents of the file using utf8 and returns the string contents.
     * @param {string} filePath
     * @returns {Promise<string>}
     * @memberof FileSystem
     */
    public async readFile(filePath: string): Promise<string> {
        const fsExtra = await import('fs-extra');
        return fsExtra.readFile(filePath).then(buffer => buffer.toString());
    }

    public async writeFile(filePath: string, data: {}): Promise<void> {
        const fsExtra = await import('fs-extra');
        await fsExtra.writeFile(filePath, data, { encoding: 'utf8' });
    }

    public directoryExists(filePath: string): Promise<boolean> {
        return this.objectExists(filePath, (stats) => stats.isDirectory());
    }

    public async createDirectory(directoryPath: string): Promise<void> {
        const fsExtra = await import('fs-extra');
        return fsExtra.mkdirp(directoryPath);
    }

    public async getSubDirectories(rootDir: string): Promise<string[]> {
        return new Promise<string[]>(resolve => {
            fs.readdir(rootDir, (error, files) => {
                if (error) {
                    return resolve([]);
                }
                const subDirs: string[] = [];
                files.forEach(name => {
                    const fullPath = path.join(rootDir, name);
                    try {
                        if (fs.statSync(fullPath).isDirectory()) {
                            subDirs.push(fullPath);
                        }
                        // tslint:disable-next-line:no-empty
                    } catch (ex) { }
                });
                resolve(subDirs);
            });
        });
    }

    public arePathsSame(path1: string, path2: string): boolean {
        path1 = path.normalize(path1);
        path2 = path.normalize(path2);
        if (this.platformService.isWindows) {
            return path1.toUpperCase() === path2.toUpperCase();
        } else {
            return path1 === path2;
        }
    }

    public async getRealPath(filePath: string): Promise<string> {
        return new Promise<string>(resolve => {
            fs.realpath(filePath, (err, realPath) => {
                resolve(err ? filePath : realPath);
            });
        });
    }

    public async copyFile(src: string, dest: string): Promise<void> {
        const deferred = createDeferred<void>();
        const rs = fs.createReadStream(src).on('error', (err) => {
            deferred.reject(err);
        });
        const ws = fs.createWriteStream(dest).on('error', (err) => {
            deferred.reject(err);
        }).on('close', () => {
            deferred.resolve();
        });
        rs.pipe(ws);
        return deferred.promise;
    }

    public async deleteFile(filename: string): Promise<void> {
        const deferred = createDeferred<void>();
        fs.unlink(filename, err => err ? deferred.reject(err) : deferred.resolve());
        return deferred.promise;
    }
    public async getFileHash(filePath: string): Promise<string | undefined> {
        return new Promise<string | undefined>(resolve => {
            fs.lstat(filePath, async (err, stats) => {
                if (err) {
                    resolve();
                } else {
                    const crypto = await import('crypto');
                    const actual = crypto.createHash('sha512').update(`${stats.ctimeMs}-${stats.mtimeMs}`).digest('hex');
                    resolve(actual);
                }
            });
        });
    }
    public async search(globPattern: string): Promise<string[]> {
        const glob = await import('glob');
        return new Promise<string[]>((resolve, reject) => {
            glob.default(globPattern, (ex, files) => {
                if (ex) {
                    return reject(ex);
                }
                resolve(Array.isArray(files) ? files : []);
            });
        });
    }
    public async createTemporaryFile(extension: string): Promise<TemporaryFile> {
        const tmp = await import('tmp');

        return new Promise<TemporaryFile>((resolve, reject) => {
            tmp.file({ postfix: extension }, (err, tmpFile, _, cleanupCallback) => {
                if (err) {
                    return reject(err);
                }
                resolve({ filePath: tmpFile, dispose: cleanupCallback });
            });
        });
    }

    public createWriteStream(filePath: string): fs.WriteStream {
        return fs.createWriteStream(filePath);
    }

    public chmod(filePath: string, mode: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.chmod(filePath, mode, (err: NodeJS.ErrnoException) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
}

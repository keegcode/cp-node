const assert = require('assert');

const { promises } = require('fs');
const { join } = require('path');
const { randomBytes } = require('crypto');

const { writeFile, mkdir, rm, readdir } = promises;

const { copy } = require('../lib/copy');

/**
 * In this test case we will create 2 directories with some files in one directory from where we are going to try to copy those into another directory
 */
module.exports = {
    name: 'dir to dir',
    handler: async () => {
        const source = join(__dirname, 'src');
        const destination = join(__dirname, 'dst');
        try {
            await mkdir(source);
            await mkdir(destination);

            await writeFile(join(source, '1.txt'), randomBytes(8).toString('hex'));
            await writeFile(join(source, '2.txt'), randomBytes(8).toString('hex'));

            await copy(source, destination);

            const files = await readdir(destination);

            assert.strictEqual(files.length, 2);
        } catch (e) {
            if(e instanceof assert.AssertionError) {
                return { success: false, error: e };
            }
        } finally {
            await rm(source, { recursive: true });
            await rm(destination, { recursive: true });
        }
    }
};
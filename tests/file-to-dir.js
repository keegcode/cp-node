const assert = require('assert');

const { promises } = require('fs');
const { join } = require('path');
const { randomBytes } = require('crypto');

const { writeFile, mkdir, rm, readdir } = promises;

const { copy } = require('../lib/copy');

/**
 * In this test case we will create 1 directory and 1 file which we are going to try to copy to the newly created directory
 */
module.exports = {
    name: 'file to dir',
    handler: async () => {
        const source = join(__dirname, 'src');
        const destination = join(__dirname, 'dst');
        try {
            await mkdir(source);
            await mkdir(destination);

            const filepath = join(source, '1.txt');

            await writeFile(filepath, randomBytes(8).toString('hex'));

            await copy(filepath, destination);

            const files = await readdir(destination);

            assert.strictEqual(files.length, 1);
        } catch (e) {
            if(e instanceof assert.AssertionError) {
                return { success: false, error: e };
            }
            throw e;
        } finally {
            await rm(source, { recursive: true });
            await rm(destination, { recursive: true });
        }
    }
}
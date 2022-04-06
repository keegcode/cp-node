const { createReadStream, createWriteStream, promises } = require('fs');
const { pipeline } = require('stream/promises');
const { join, parse } = require('path');

const { lstat, readdir } = promises;

const copy = async (source, destination) => {
    const src = await lstat(source);
    const dst = await lstat(destination);

    if(src.isDirectory() && dst.isFile()) {
        throw new Error(`Cannot copy directory to file! Source: ${source} | Destination: ${destination}`);
    }

    if(src.isDirectory() && dst.isDirectory()) {
        await copyDirectory(source, destination);
    }

    if(src.isFile() && dst.isDirectory()) {
        await copyFileToDirectory(source, destination);
    }

    if(src.isFile() && dst.isFile()) {
        await copyFile(source, destination);
    }
};

const copyDirectory = async (source, destination) => {
    const files = await readdir(source, { withFileTypes: true });
    const options = files
        .filter(file => file.isFile())
        .map(({ name }) => ({ source: join(source, name), destination: join(destination, name) }));
    for(const option of options) {
        await copyFile(option.source, option.destination);
    }
};

const copyFileToDirectory = async (source, destination) => {
    const { name, ext } = parse(source);
    await copyFile(source, join(destination, name + ext));
};

const copyFile = async (source, destination) => {
    await pipeline(createReadStream(source), createWriteStream(destination));
};

module.exports = { copy };
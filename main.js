const { copy } = require('./lib/copy');

const main = async () => {
    const [destination, ...sources] = process.argv.slice(2).reverse();
    for(const source of sources) {
        await copy(source, destination);
    }
}

main();